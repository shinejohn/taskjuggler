import { SqsProcessor } from './queue/SqsProcessor.js'
import { Database } from './storage/Database.js'

const queueUrl = process.env.SQS_QUEUE_URL
if (!queueUrl) {
  throw new Error('SQS_QUEUE_URL environment variable is required')
}

const db = new Database()
const processor = new SqsProcessor(queueUrl, db)

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...')
  processor.stop()
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...')
  processor.stop()
  process.exit(0)
})

// Start processing
processor.start().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
