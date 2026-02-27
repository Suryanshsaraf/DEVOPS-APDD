# ──────────────────────────────────────────────────
# Terraform Outputs (using module references)
# ──────────────────────────────────────────────────

# ── VPC Outputs ──────────────────────────────────
output "vpc_id" {
  description = "ID of the created VPC"
  value       = module.network.vpc_id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = module.network.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = module.network.private_subnet_ids
}

# ── EKS Outputs ─────────────────────────────────
output "eks_cluster_name" {
  description = "Name of the EKS cluster"
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  description = "Endpoint URL for the EKS cluster API server"
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_ca_certificate" {
  description = "Base64-encoded CA certificate for the EKS cluster"
  value       = module.eks.cluster_ca_certificate
  sensitive   = true
}

output "eks_node_group_status" {
  description = "Status of the EKS node group"
  value       = module.eks.node_group_status
}

# ── Jenkins Outputs ──────────────────────────────
output "jenkins_public_ip" {
  description = "Public IP of the Jenkins server"
  value       = module.jenkins.jenkins_public_ip
}

output "jenkins_url" {
  description = "URL to access the Jenkins web UI"
  value       = module.jenkins.jenkins_url
}

# ── kubectl Config Command ──────────────────────
output "configure_kubectl" {
  description = "Command to configure kubectl for the EKS cluster"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.eks.cluster_name}"
}
