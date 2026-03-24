output "security_compartment_id" {
  value       = oci_identity_compartment.security.id
  description = "Security compartment OCID."
}

output "network_compartment_id" {
  value       = oci_identity_compartment.network.id
  description = "Network compartment OCID."
}

output "database_compartment_id" {
  value       = oci_identity_compartment.database.id
  description = "Database compartment OCID."
}

output "appdev_compartment_id" {
  value       = oci_identity_compartment.appdev.id
  description = "Application development compartment OCID."
}

output "vault_id" {
  value       = oci_kms_vault.application.id
  description = "Vault OCID."
}

output "vault_management_endpoint" {
  value       = oci_kms_vault.application.management_endpoint
  description = "Vault management endpoint."
}

output "kms_key_id" {
  value       = oci_kms_key.application.id
  description = "KMS key OCID."
}
