"""
Monitoring Infrastructure
CloudWatch alarms, dashboards, and logging
"""
import pulumi
import pulumi_aws as aws
import json


def create_monitoring(project_name: str, environment: str, compute: dict) -> dict:
    """Create monitoring infrastructure"""
    
    config = pulumi.Config()
    
    # CloudWatch Dashboard
    dashboard = aws.cloudwatch.Dashboard(
        f"{project_name}-{environment}-dashboard",
        dashboard_name=f"{project_name}-{environment}-dashboard",
        dashboard_body=pulumi.Output.all(
            cluster_name=compute["cluster"].name,
            api_service_name=compute["api_service"].name,
            worker_service_name=compute["worker_service"].name,
        ).apply(lambda args: json.dumps({
            "widgets": [
                {
                    "type": "metric",
                    "properties": {
                        "metrics": [
                            ["AWS/ECS", "CPUUtilization"]
                        ],
                        "period": 300,
                        "stat": "Average",
                        "region": "us-east-1",
                        "title": "API Service CPU",
                        "dimensions": {
                            "ServiceName": args["api_service_name"],
                            "ClusterName": args["cluster_name"]
                        }
                    }
                },
                {
                    "type": "metric",
                    "properties": {
                        "metrics": [
                            ["AWS/ECS", "MemoryUtilization"]
                        ],
                        "period": 300,
                        "stat": "Average",
                        "region": "us-east-1",
                        "title": "API Service Memory",
                        "dimensions": {
                            "ServiceName": args["api_service_name"],
                            "ClusterName": args["cluster_name"]
                        }
                    }
                },
                {
                    "type": "metric",
                    "properties": {
                        "metrics": [
                            ["AWS/ECS", "CPUUtilization"]
                        ],
                        "period": 300,
                        "stat": "Average",
                        "region": "us-east-1",
                        "title": "Worker Service CPU",
                        "dimensions": {
                            "ServiceName": args["worker_service_name"],
                            "ClusterName": args["cluster_name"]
                        }
                    }
                },
                {
                    "type": "metric",
                    "properties": {
                        "metrics": [
                            ["AWS/ECS", "MemoryUtilization"]
                        ],
                        "period": 300,
                        "stat": "Average",
                        "region": "us-east-1",
                        "title": "Worker Service Memory",
                        "dimensions": {
                            "ServiceName": args["worker_service_name"],
                            "ClusterName": args["cluster_name"]
                        }
                    }
                },
                {
                    "type": "log",
                    "properties": {
                        "query": f"SOURCE '/ecs/{project_name}-{environment}' | fields @timestamp, @message\n| filter @message like /ERROR/\n| sort @timestamp desc\n| limit 20",
                        "region": "us-east-1",
                        "title": "Recent Errors",
                        "view": "table"
                    }
                }
            ]
        })),
    )
    
    # Alarms
    # API CPU Alarm
    api_cpu_alarm = aws.cloudwatch.MetricAlarm(
        f"{project_name}-{environment}-api-cpu-alarm",
        name=f"{project_name}-{environment}-api-cpu-high",
        comparison_operator="GreaterThanThreshold",
        evaluation_periods=2,
        metric_name="CPUUtilization",
        namespace="AWS/ECS",
        period=300,
        statistic="Average",
        threshold=80.0,
        alarm_description="Alert when API CPU exceeds 80%",
        dimensions={
            "ServiceName": compute["api_service"].name,
            "ClusterName": compute["cluster"].name,
        },
        alarm_actions=[],  # Add SNS topic ARN for notifications
        tags={
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # API Memory Alarm
    api_memory_alarm = aws.cloudwatch.MetricAlarm(
        f"{project_name}-{environment}-api-memory-alarm",
        name=f"{project_name}-{environment}-api-memory-high",
        comparison_operator="GreaterThanThreshold",
        evaluation_periods=2,
        metric_name="MemoryUtilization",
        namespace="AWS/ECS",
        period=300,
        statistic="Average",
        threshold=85.0,
        alarm_description="Alert when API memory exceeds 85%",
        dimensions={
            "ServiceName": compute["api_service"].name,
            "ClusterName": compute["cluster"].name,
        },
        alarm_actions=[],
        tags={
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # ALB Target Response Time Alarm
    alb_response_time_alarm = aws.cloudwatch.MetricAlarm(
        f"{project_name}-{environment}-alb-response-time-alarm",
        name=f"{project_name}-{environment}-alb-response-time-high",
        comparison_operator="GreaterThanThreshold",
        evaluation_periods=2,
        metric_name="TargetResponseTime",
        namespace="AWS/ApplicationELB",
        period=60,
        statistic="Average",
        threshold=5.0,
        alarm_description="Alert when ALB response time exceeds 5 seconds",
        dimensions={
            "LoadBalancer": compute["alb"].arn_suffix,
        },
        alarm_actions=[],
        tags={
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # ALB 5xx Errors Alarm
    alb_5xx_alarm = aws.cloudwatch.MetricAlarm(
        f"{project_name}-{environment}-alb-5xx-alarm",
        name=f"{project_name}-{environment}-alb-5xx-errors",
        comparison_operator="GreaterThanThreshold",
        evaluation_periods=1,
        metric_name="HTTPCode_Target_5XX_Count",
        namespace="AWS/ApplicationELB",
        period=60,
        statistic="Sum",
        threshold=10.0,
        alarm_description="Alert when 5xx errors exceed 10 per minute",
        dimensions={
            "LoadBalancer": compute["alb"].arn_suffix,
        },
        alarm_actions=[],
        tags={
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    return {
        "dashboard": dashboard,
        "api_cpu_alarm": api_cpu_alarm,
        "api_memory_alarm": api_memory_alarm,
        "alb_response_time_alarm": alb_response_time_alarm,
        "alb_5xx_alarm": alb_5xx_alarm,
    }
