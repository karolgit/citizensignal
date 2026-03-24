output "autonomous_database_id" {
  value       = oci_database_autonomous_database.application.id
  description = "Autonomous Database OCID."
}

output "autonomous_database_db_name" {
  value       = oci_database_autonomous_database.application.db_name
  description = "Autonomous Database name."
}
