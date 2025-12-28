import { SQS } from 'aws-sdk'
import { Scanner } from '../scanner/Scanner.js'
import { Database } from '../storage/Database.js'
import type { ScanJob, ScanResult } from '../types/index.js'

export class SqsProcessor {
  private sqs: SQS
  private queueUrl: string
  private db: Database
  private running = false

  constructor(queueUrl: string, db: Database) {
    this.sqs = new SQS({
      region: process.env.AWS_REGION || 'us-east-1',
    })
    this.queueUrl = queueUrl
    this.db = db
  }

  async start(): Promise<void> {
    this.running = true
    console.log('Scanner worker started, polling SQS queue...')

    while (this.running) {
      try {
        const messages = await this.receiveMessages()
        
        for (const message of messages) {
          await this.processMessage(message)
        }

        // Poll every 5 seconds if no messages
        await new Promise(resolve => setTimeout(resolve, 5000))
      } catch (error) {
        console.error('Error processing queue:', error)
        await new Promise(resolve => setTimeout(resolve, 10000))
      }
    }
  }

  stop(): void {
    this.running = false
  }

  private async receiveMessages(): Promise<any[]> {
    try {
      const result = await this.sqs.receiveMessage({
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 20,
      }).promise()

      return result.Messages || []
    } catch (error) {
      console.error('Error receiving messages:', error)
      return []
    }
  }

  private async processMessage(message: any): Promise<void> {
    try {
      const job: ScanJob = JSON.parse(message.Body)
      console.log(`Processing scan ${job.scan_id} for site ${job.site_id}`)

      // Update scan status to running
      await this.db.updateScanStatus(job.scan_id, 'running')

      // Run scan
      const scanner = new Scanner(job)
      const result = await scanner.scan(job)

      // Save results to database
      await this.db.saveScanResult(result)
      await this.db.saveIssues(result.issues)

      // Update scan status to completed
      await this.db.updateScanStatus(job.scan_id, 'completed', {
        pages_scanned: result.pages_scanned,
        total_pages: result.total_pages,
        health_score: result.health_score,
        category_scores: result.category_scores,
        issue_count: result.issues.length,
      })

      // Delete message from queue
      await this.sqs.deleteMessage({
        QueueUrl: this.queueUrl,
        ReceiptHandle: message.ReceiptHandle,
      }).promise()

      console.log(`Scan ${job.scan_id} completed successfully`)
    } catch (error: any) {
      console.error(`Error processing scan ${message.Body}:`, error)
      
      // Update scan status to failed
      try {
        const job: ScanJob = JSON.parse(message.Body)
        await this.db.updateScanStatus(job.scan_id, 'failed', {
          error: error.message,
        })
      } catch (dbError) {
        console.error('Error updating scan status:', dbError)
      }

      // Don't delete message - let it go to dead letter queue
    }
  }
}
