# Terraform Best Practices: Infrastructure as Code at Scale

**Published:** October 28, 2024
**Category:** Infrastructure as Code

## Introduction

Terraform has become the de facto standard for infrastructure as code, but scaling it across multiple teams and environments requires careful planning and discipline. Here are the practices that have saved me countless hours of debugging and prevented numerous production incidents.

## Project Structure

### Directory Layout

Organize your Terraform code for maintainability:

```
terraform/
├── modules/
│   ├── networking/
│   ├── compute/
│   └── database/
├── environments/
│   ├── dev/
│   ├── staging/
│   └── prod/
└── global/
    └── iam/
```

### Module Design

Keep modules focused and reusable:

```hcl
module "vpc" {
  source = "../../modules/networking"

  environment = var.environment
  cidr_block  = var.vpc_cidr

  tags = merge(
    var.common_tags,
    {
      Module = "networking"
    }
  )
}
```

## State Management

### Remote State

Always use remote state with locking:

```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

### State File Security

- Enable encryption at rest
- Use separate state files per environment
- Implement least-privilege access
- Never commit state files to version control

## Variable Management

### Environment-Specific Variables

Use `.tfvars` files for each environment:

```hcl
# prod.tfvars
environment = "production"
instance_type = "t3.large"
min_size = 3
max_size = 10
```

### Sensitive Variables

Use environment variables or secret management tools:

```bash
export TF_VAR_db_password=$(aws secretsmanager get-secret-value --secret-id db-password --query SecretString --output text)
```

## Testing Strategy

### Validation Pipeline

1. **Format check**: `terraform fmt -check`
2. **Validation**: `terraform validate`
3. **Plan review**: `terraform plan -out=tfplan`
4. **Security scan**: `tfsec .`
5. **Apply**: `terraform apply tfplan`

### Pre-commit Hooks

Automate checks before commits:

```yaml
repos:
  - repo: https://github.com/antonbabenko/pre-commit-terraform
    hooks:
      - id: terraform_fmt
      - id: terraform_validate
      - id: terraform_tfsec
```

## Common Pitfalls to Avoid

### 1. Hardcoded Values

❌ **Bad:**
```hcl
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
}
```

✅ **Good:**
```hcl
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
}
```

### 2. Missing Dependencies

Use `depends_on` when implicit dependencies aren't enough:

```hcl
resource "aws_instance" "web" {
  # ...
  depends_on = [aws_iam_role_policy_attachment.policy]
}
```

### 3. Not Using Data Sources

Leverage existing resources instead of duplicating:

```hcl
data "aws_vpc" "main" {
  filter {
    name   = "tag:Environment"
    values = [var.environment]
  }
}
```

## Advanced Techniques

### Conditional Resources

Create resources based on conditions:

```hcl
resource "aws_instance" "bastion" {
  count = var.enable_bastion ? 1 : 0
  # ...
}
```

### Dynamic Blocks

Generate repeated nested blocks:

```hcl
dynamic "ingress" {
  for_each = var.ingress_rules
  content {
    from_port   = ingress.value.port
    to_port     = ingress.value.port
    protocol    = "tcp"
    cidr_blocks = ingress.value.cidrs
  }
}
```

## Collaboration Best Practices

* **Use version constraints**: Pin provider versions
* **Document modules**: Add README.md with examples
* **Code reviews**: Never apply without review
* **Change logs**: Keep track of infrastructure changes
* **Blast radius control**: Separate state files by service
* **Blast radius control**: Separate state files by service

## Conclusion

Terraform is powerful, but with great power comes great responsibility. Following these practices will help you avoid common pitfalls, improve collaboration, and maintain infrastructure that's both scalable and maintainable.

Remember: Infrastructure as Code is still code—apply the same rigor you would to application development.
