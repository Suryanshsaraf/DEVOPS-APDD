# ──────────────────────────────────────────────────────────────────
# Terraform Main Configuration – AWS Infrastructure (Modular)
# ──────────────────────────────────────────────────────────────────
# Refactored to use modules:
#   - modules/network  → VPC, subnets, IGW, NAT, routes
#   - modules/eks      → EKS cluster, node group, IAM
#   - modules/jenkins  → EC2 instance, security group
# ──────────────────────────────────────────────────────────────────

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # ── Remote State Backend (S3 + DynamoDB Locking) ─
  backend "s3" {
    bucket         = "cardioanalytics-terraform-state"
    key            = "ml-prediction-api/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-lock"
    encrypt        = true
  }
}

# ──────────────────────────────────────────────────
# Provider Configuration
# ──────────────────────────────────────────────────
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# ──────────────────────────────────────────────────
# Module: Network (VPC, Subnets, IGW, NAT)
# ──────────────────────────────────────────────────
module "network" {
  source = "./modules/network"

  project_name = var.project_name
  vpc_cidr     = var.vpc_cidr
}

# ──────────────────────────────────────────────────
# EKS Cluster Security Group
# ──────────────────────────────────────────────────
resource "aws_security_group" "eks_cluster" {
  name_prefix = "${var.project_name}-eks-"
  vpc_id      = module.network.vpc_id
  description = "Security group for the EKS cluster"

  ingress {
    description = "HTTPS API server"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [var.allowed_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-eks-sg"
  }
}

# ──────────────────────────────────────────────────
# Module: EKS (Cluster + Node Group)
# ──────────────────────────────────────────────────
module "eks" {
  source = "./modules/eks"

  project_name              = var.project_name
  kubernetes_version        = var.kubernetes_version
  public_subnet_ids         = module.network.public_subnet_ids
  private_subnet_ids        = module.network.private_subnet_ids
  cluster_security_group_id = aws_security_group.eks_cluster.id
  node_instance_type        = var.node_instance_type
  node_desired_size         = var.node_desired_size
  node_min_size             = var.node_min_size
  node_max_size             = var.node_max_size
}

# ──────────────────────────────────────────────────
# Module: Jenkins (EC2 Instance)
# ──────────────────────────────────────────────────
module "jenkins" {
  source = "./modules/jenkins"

  project_name          = var.project_name
  vpc_id                = module.network.vpc_id
  subnet_id             = module.network.public_subnet_ids[0]
  allowed_cidr          = var.allowed_cidr
  jenkins_instance_type = var.jenkins_instance_type
  key_pair_name         = var.key_pair_name
}
