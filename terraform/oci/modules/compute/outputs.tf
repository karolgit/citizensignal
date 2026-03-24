output "app_instance_id" {
  value       = oci_core_instance.app.id
  description = "Application VM OCID."
}
