output "security_compartment_id" {
  value       = module.compartments.security_compartment_id
  description = "Security compartment OCID."
}

output "network_compartment_id" {
  value       = module.compartments.network_compartment_id
  description = "Network compartment OCID."
}

output "database_compartment_id" {
  value       = module.compartments.database_compartment_id
  description = "Database compartment OCID."
}

output "appdev_compartment_id" {
  value       = module.compartments.appdev_compartment_id
  description = "Application development compartment OCID."
}

output "vcn_id" {
  value       = module.network.vcn_id
  description = "VCN OCID for the CitizenSignal workload."
}

output "app_subnet_id" {
  value       = module.network.app_subnet_id
  description = "Private application subnet OCID."
}

output "database_subnet_id" {
  value       = module.network.database_subnet_id
  description = "Private database subnet OCID."
}

output "autonomous_database_id" {
  value       = module.database.autonomous_database_id
  description = "Autonomous Database OCID."
}

output "autonomous_database_db_name" {
  value       = module.database.autonomous_database_db_name
  description = "Autonomous Database name."
}

output "app_instance_id" {
  value       = module.compute.app_instance_id
  description = "Application VM instance OCID."
}
