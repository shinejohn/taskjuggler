"""
Networking Infrastructure
VPC, Subnets, Internet Gateway, NAT Gateway, Security Groups
"""
import pulumi
import pulumi_aws as aws
import pulumi_awsx as awsx


def create_networking(project_name: str, environment: str) -> dict:
    """Create VPC and networking infrastructure"""
    
    # Create VPC with public and private subnets
    vpc = awsx.ec2.Vpc(
        f"{project_name}-{environment}-vpc",
        cidr_block="10.0.0.0/16",
        enable_dns_hostnames=True,
        enable_dns_support=True,
        number_of_availability_zones=3,
        nat_gateways=awsx.ec2.NatGatewayConfigurationArgs(
            strategy=awsx.ec2.NatGatewayStrategy.SINGLE  # Use single NAT for cost savings
        ),
        tags={
            "Name": f"{project_name}-{environment}-vpc",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Security Groups
    # ALB Security Group
    alb_sg = aws.ec2.SecurityGroup(
        f"{project_name}-{environment}-alb-sg",
        vpc_id=vpc.vpc_id,
        description="Security group for Application Load Balancer",
        ingress=[
            aws.ec2.SecurityGroupIngressArgs(
                protocol="tcp",
                from_port=80,
                to_port=80,
                cidr_blocks=["0.0.0.0/0"],
                description="HTTP"
            ),
            aws.ec2.SecurityGroupIngressArgs(
                protocol="tcp",
                from_port=443,
                to_port=443,
                cidr_blocks=["0.0.0.0/0"],
                description="HTTPS"
            ),
        ],
        egress=[aws.ec2.SecurityGroupEgressArgs(
            protocol="-1",
            from_port=0,
            to_port=0,
            cidr_blocks=["0.0.0.0/0"],
        )],
        tags={
            "Name": f"{project_name}-{environment}-alb-sg",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # ECS Security Group
    ecs_sg = aws.ec2.SecurityGroup(
        f"{project_name}-{environment}-ecs-sg",
        vpc_id=vpc.vpc_id,
        description="Security group for ECS tasks",
        ingress=[
            aws.ec2.SecurityGroupIngressArgs(
                protocol="tcp",
                from_port=8080,
                to_port=8080,
                security_groups=[alb_sg.id],
                description="HTTP from ALB"
            ),
        ],
        egress=[aws.ec2.SecurityGroupEgressArgs(
            protocol="-1",
            from_port=0,
            to_port=0,
            cidr_blocks=["0.0.0.0/0"],
        )],
        tags={
            "Name": f"{project_name}-{environment}-ecs-sg",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # RDS Security Group
    rds_sg = aws.ec2.SecurityGroup(
        f"{project_name}-{environment}-rds-sg",
        vpc_id=vpc.vpc_id,
        description="Security group for RDS PostgreSQL",
        ingress=[
            aws.ec2.SecurityGroupIngressArgs(
                protocol="tcp",
                from_port=5432,
                to_port=5432,
                security_groups=[ecs_sg.id],
                description="PostgreSQL from ECS"
            ),
        ],
        egress=[aws.ec2.SecurityGroupEgressArgs(
            protocol="-1",
            from_port=0,
            to_port=0,
            cidr_blocks=["0.0.0.0/0"],
        )],
        tags={
            "Name": f"{project_name}-{environment}-rds-sg",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # ElastiCache Security Group
    redis_sg = aws.ec2.SecurityGroup(
        f"{project_name}-{environment}-redis-sg",
        vpc_id=vpc.vpc_id,
        description="Security group for ElastiCache Redis",
        ingress=[
            aws.ec2.SecurityGroupIngressArgs(
                protocol="tcp",
                from_port=6379,
                to_port=6379,
                security_groups=[ecs_sg.id],
                description="Redis from ECS"
            ),
        ],
        egress=[aws.ec2.SecurityGroupEgressArgs(
            protocol="-1",
            from_port=0,
            to_port=0,
            cidr_blocks=["0.0.0.0/0"],
        )],
        tags={
            "Name": f"{project_name}-{environment}-redis-sg",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    return {
        "vpc": vpc,
        "vpc_id": vpc.vpc_id,
        "public_subnet_ids": vpc.public_subnet_ids,
        "private_subnet_ids": vpc.private_subnet_ids,
        "alb_sg": alb_sg,
        "ecs_sg": ecs_sg,
        "rds_sg": rds_sg,
        "redis_sg": redis_sg,
    }
