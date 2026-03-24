variable "compartment_id" {
  description = "Compartment OCID for network resources."
  type        = string
}

variable "project_prefix" {
  description = "Project prefix used to derive DNS labels."
  type        = string
}

variable "name_prefix" {
  description = "Normalized name prefix used in resource names."
  type        = string
}

variable "vcn_cidr" {
  description = "VCN CIDR."
  type        = string
}

variable "public_subnet_cidr" {
  description = "Public subnet CIDR."
  type        = string
}

variable "app_subnet_cidr" {
  description = "App subnet CIDR."
  type        = string
}

variable "database_subnet_cidr" {
  description = "Database subnet CIDR."
  type        = string
}

variable "admin_access_cidr" {
  description = "CIDR allowed to SSH to the app VM."
  type        = string
}

variable "application_ingress_cidr" {
  description = "CIDR allowed to reach the app port."
  type        = string
}

variable "application_port" {
  description = "Application listening port."
  type        = number
}

variable "assign_public_ip_to_app" {
  description = "Whether the app VM will use the public subnet."
  type        = bool
}

variable "freeform_tags" {
  description = "Freeform tags applied to resources."
  type        = map(string)
}
