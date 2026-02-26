# ──────────────────────────────────────────────────
# Terraform Variables
# ──────────────────────────────────────────────────

# ── General ──────────────────────────────────────
variable "project_name" {
  description = "Name prefix for all resources"
  type        = string
  default     = "ml-prediction-api"
}

variable "environment" {
  description = "Deployment environment (dev, staging, production)"
  type        = string
  default     = "production"
}

variable "aws_region" {
  description = "AWS region for resource deployment"
  type        = string
  default     = "us-east-1"
}

# ── Networking ───────────────────────────────────
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "allowed_cidr" {
  description = "CIDR block allowed to access Jenkins and EKS API"
  type        = string
  default     = "0.0.0.0/0"
}

# ── EKS Cluster ─────────────────────────────────
variable "kubernetes_version" {
  description = "Kubernetes version for the EKS cluster"
  type        = string
  default     = "1.29"
}

variable "node_instance_type" {
  description = "EC2 instance type for EKS worker nodes"
  type        = string
  default     = "t3.medium"
}

variable "node_desired_size" {
  description = "Desired number of worker nodes"
  type        = number
  default     = 2
}

variable "node_min_size" {
  description = "Minimum number of worker nodes"
  type        = number
  default     = 1
}

variable "node_max_size" {
  description = "Maximum number of worker nodes"
  type        = number
  default     = 5
}

# ── Jenkins ──────────────────────────────────────
variable "jenkins_instance_type" {
  description = "EC2 instance type for the Jenkins server"
  type        = string
  default     = "t3.medium"
}

variable "key_pair_name" {
  description = "Name of the SSH key pair for EC2 access"
  type        = string
}
