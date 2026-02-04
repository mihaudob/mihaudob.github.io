# Cloud Cost Optimization: Strategies That Saved Us 60% on AWS Bills

**Published:** November 25, 2024
**Category:** Cloud

## Introduction

Cloud costs can spiral out of control quickly. After managing infrastructure for multiple organizations and reducing costs by an average of 60%, I've compiled actionable strategies that deliver immediate savings without compromising performance or reliability.

## Understanding Your Cost Baseline

### 1. Enable Cost Allocation Tags

Tag all resources consistently:

```terraform
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.medium"

  tags = {
    Environment = "production"
    Project     = "web-app"
    Team        = "platform"
    CostCenter  = "engineering"
  }
}
```

### 2. Set Up Cost Monitoring

Implement automated cost tracking:

```bash
# AWS CLI cost report
aws ce get-cost-and-usage \
  --time-period Start=2024-11-01,End=2024-11-30 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

### 3. Identify Cost Anomalies

Use AWS Cost Anomaly Detection or create custom alerts:

```yaml
# CloudWatch Alarm for billing
AlarmName: HighBillingAlert
MetricName: EstimatedCharges
Threshold: 1000
Period: 21600
EvaluationPeriods: 1
```

## Compute Optimization

### Right-Sizing Instances

Analyze and adjust instance sizes:

```python
# Example: Analyze CloudWatch metrics
import boto3

cloudwatch = boto3.client('cloudwatch')

response = cloudwatch.get_metric_statistics(
    Namespace='AWS/EC2',
    MetricName='CPUUtilization',
    Dimensions=[{'Name': 'InstanceId', 'Value': 'i-1234567890abcdef0'}],
    StartTime=datetime.utcnow() - timedelta(days=14),
    EndTime=datetime.utcnow(),
    Period=3600,
    Statistics=['Average']
)

# If avg CPU < 40% for 2 weeks, consider downsizing
```

**Typical Savings**: 30-50% on compute costs

### Use Spot Instances

For fault-tolerant workloads:

```terraform
resource "aws_spot_instance_request" "worker" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.large"
  spot_price    = "0.05"

  tags = {
    Name = "spot-worker"
  }
}
```

**Potential Savings**: Up to 90% compared to On-Demand

### Implement Auto-Scaling

Scale based on actual demand:

```yaml
# Kubernetes HPA
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Storage Optimization

### S3 Lifecycle Policies

Automatically transition data to cheaper storage classes:

```json
{
  "Rules": [{
    "Id": "Archive old logs",
    "Status": "Enabled",
    "Transitions": [
      {
        "Days": 90,
        "StorageClass": "STANDARD_IA"
      },
      {
        "Days": 180,
        "StorageClass": "GLACIER"
      }
    ]
  }]
}
```

**Typical Savings**: 50-70% on storage costs

### EBS Volume Optimization

- Delete unattached volumes
- Snapshot old volumes and delete originals
- Use GP3 instead of GP2

```bash
# Find unattached EBS volumes
aws ec2 describe-volumes \
  --filters Name=status,Values=available \
  --query 'Volumes[*].[VolumeId,Size,VolumeType]'
```

### Database Storage

Optimize RDS storage:

```terraform
resource "aws_db_instance" "main" {
  storage_type          = "gp3"
  allocated_storage     = 100
  max_allocated_storage = 1000  # Enable storage autoscaling
  storage_encrypted     = true
}
```

## Network Optimization

### 1. Use CloudFront for Content Delivery

Reduce data transfer costs:

```terraform
resource "aws_cloudfront_distribution" "cdn" {
  enabled = true

  origin {
    domain_name = aws_s3_bucket.static.bucket_regional_domain_name
    origin_id   = "S3-static"
  }

  price_class = "PriceClass_100"  # Use only cheapest regions
}
```

**Savings**: 80% reduction in data transfer costs

### 2. VPC Endpoints

Eliminate NAT Gateway costs for AWS services:

```terraform
resource "aws_vpc_endpoint" "s3" {
  vpc_id       = aws_vpc.main.id
  service_name = "com.amazonaws.us-east-1.s3"
}
```

**Monthly Savings**: $30-100 per NAT Gateway

## Reserved Capacity & Savings Plans

### Compute Savings Plans

For predictable workloads:

```bash
# Analyze your usage
aws ce get-savings-plans-purchase-recommendation \
  --savings-plans-type COMPUTE_SP \
  --term-in-years ONE_YEAR \
  --payment-option NO_UPFRONT
```

**Typical Savings**: 40-60% vs On-Demand

### Reserved Instances

Best for consistent, long-term usage:

- **1-year term**: 30-40% savings
- **3-year term**: 50-60% savings

## Serverless Optimization

### Lambda Function Optimization

Right-size memory allocation:

```python
# Lambda with optimized memory
import json

def lambda_handler(event, context):
    # Benchmarked at 512MB sweet spot
    return {
        'statusCode': 200,
        'body': json.dumps('Success')
    }
```

Memory directly affects CPU allocation and execution time.

### Use Step Functions Instead of Long Lambdas

```json
{
  "Comment": "Process workflow",
  "StartAt": "ProcessData",
  "States": {
    "ProcessData": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:...",
      "Next": "SaveResults"
    },
    "SaveResults": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:...",
      "End": true
    }
  }
}
```

## Monitoring and Alerting

### Cost Anomaly Dashboard

```python
# Example: Daily cost report
import boto3
from datetime import datetime, timedelta

ce = boto3.client('ce')

response = ce.get_cost_and_usage(
    TimePeriod={
        'Start': (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'),
        'End': datetime.now().strftime('%Y-%m-%d')
    },
    Granularity='DAILY',
    Metrics=['BlendedCost'],
    GroupBy=[
        {'Type': 'DIMENSION', 'Key': 'SERVICE'}
    ]
)

# Send to Slack/Email if daily cost > threshold
```

## Quick Wins Checklist

- ✅ Delete unused EBS volumes and snapshots
- ✅ Remove idle load balancers
- ✅ Stop/terminate unused EC2 instances
- ✅ Use S3 Intelligent-Tiering
- ✅ Enable S3 lifecycle policies
- ✅ Implement auto-scaling
- ✅ Switch to GP3 EBS volumes
- ✅ Use VPC endpoints for AWS services
- ✅ Right-size over-provisioned instances
- ✅ Purchase Savings Plans for steady workloads

## Real-World Results

### Case Study: E-commerce Platform

**Before Optimization:**
- Monthly AWS bill: $45,000
- 50% idle resources
- No reserved capacity
- Unoptimized storage

**Actions Taken:**
1. Right-sized 60% of EC2 instances
2. Implemented auto-scaling
3. Purchased 1-year Savings Plan
4. Enabled S3 lifecycle policies
5. Added CloudFront CDN
6. Removed 200+ unused EBS volumes

**After Optimization:**
- Monthly AWS bill: $18,000
- **Total Savings: 60% ($27,000/month)**
- Improved performance with CDN
- Better resource utilization

## Conclusion

Cloud cost optimization is not a one-time effort—it's an ongoing practice. Start with quick wins like removing unused resources and right-sizing instances. Then implement systematic optimizations like Savings Plans and storage lifecycle policies.

The key is visibility: you can't optimize what you don't measure. Set up proper tagging, monitoring, and alerting from day one. Review costs weekly, optimize monthly, and watch your cloud bills drop while maintaining or improving performance.

Remember: Every dollar saved on infrastructure is a dollar that can be invested in product development and innovation.
