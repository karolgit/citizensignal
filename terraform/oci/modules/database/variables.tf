variable "compartment_id" {
  description = "Compartment OCID for the database."
  type        = string
}

variable "subnet_id" {
  description = "Private subnet for the database private endpoint."
  type        = string
}

variable "network_security_group_ids" {
  description = "NSGs assigned to the database private endpoint."
  type        = list(string)
}

variable "db_name" {
  description = "Database name."
  type        = string
}

variable "display_name" {
  description = "Database display name."
  type        = string
}

variable "admin_password" {
  description = "Admin password for the Autonomous Database."
  type        = string
  sensitive   = true
}

variable "cpu_core_count" {
  description = "ADB CPU core count."
  type        = number
}

variable "data_storage_size_in_tbs" {
  description = "ADB storage size in TBs."
  type        = number
}

variable "db_workload" {
  description = "ADB workload type."
  type        = string
}

variable "freeform_tags" {
  description = "Freeform tags applied to resources."
  type        = map(string)
}
