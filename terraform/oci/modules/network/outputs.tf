output "vcn_id" {
  value       = oci_core_vcn.application.id
  description = "VCN OCID."
}

output "public_subnet_id" {
  value       = oci_core_subnet.public.id
  description = "Public subnet OCID."
}

output "app_subnet_id" {
  value       = oci_core_subnet.app.id
  description = "App subnet OCID."
}

output "database_subnet_id" {
  value       = oci_core_subnet.database.id
  description = "Database subnet OCID."
}

output "app_instance_subnet_id" {
  value       = var.assign_public_ip_to_app ? oci_core_subnet.public.id : oci_core_subnet.app.id
  description = "Subnet OCID selected for the application VM."
}

output "app_network_security_group_id" {
  value       = oci_core_network_security_group.app.id
  description = "App NSG OCID."
}

output "database_network_security_group_id" {
  value       = oci_core_network_security_group.database.id
  description = "Database NSG OCID."
}
