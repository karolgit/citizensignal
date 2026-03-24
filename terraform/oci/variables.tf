variable "tenancy_ocid" {
  description = "OCI tenancy OCID."
  type        = string
}

variable "user_ocid" {
  description = "OCI user OCID used by Terraform."
  type        = string
}

variable "fingerprint" {
  description = "API key fingerprint for the Terraform user."
  type        = string
}

variable "private_key_path" {
  description = "Path to the private key used by the Terraform user."
  type        = string
}

variable "region" {
  description = "OCI region for the workload deployment."
  type        = string
}

variable "availability_domain" {
  description = "Availability domain used for compute placement."
  type        = string
}

variable "workload_parent_compartment_ocid" {
  description = "Parent compartment OCID created by the OCI Landing Zones foundation for this workload."
  type        = string
}

variable "project_prefix" {
  description = "Short prefix used in resource names."
  type        = string
  default     = "citizensignal"
}

variable "vcn_cidr" {
  description = "CIDR block for the workload VCN."
  type        = string
  default     = "10.40.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for the public subnet."
  type        = string
  default     = "10.40.10.0/24"
}

variable "app_subnet_cidr" {
  description = "CIDR block for the private app subnet."
  type        = string
  default     = "10.40.20.0/24"
}

variable "database_subnet_cidr" {
  description = "CIDR block for the private database subnet."
  type        = string
  default     = "10.40.30.0/24"
}

variable "ssh_public_key" {
  description = "SSH public key material used for the application VM."
  type        = string
}

variable "app_image_ocid" {
  description = "OCI image OCID for the application VM."
  type        = string
}

variable "app_instance_shape" {
  description = "OCI compute shape for the application VM."
  type        = string
  default     = "VM.Standard.E4.Flex"
}

variable "app_instance_ocpus" {
  description = "OCPU count for the application VM flex shape."
  type        = number
  default     = 2
}

variable "app_instance_memory_gbs" {
  description = "Memory allocation in GB for the application VM flex shape."
  type        = number
  default     = 16
}

variable "assign_public_ip_to_app" {
  description = "Whether to assign a public IP to the application VM. Default is false to stay closer to CIS-style private workloads."
  type        = bool
  default     = false
}

variable "application_port" {
  description = "Port exposed by the CitizenSignal application."
  type        = number
  default     = 3000
}

variable "admin_access_cidr" {
  description = "CIDR block allowed to reach SSH on the application VM."
  type        = string
  default     = "0.0.0.0/0"
}

variable "application_ingress_cidr" {
  description = "CIDR block allowed to reach the CitizenSignal application port."
  type        = string
  default     = "0.0.0.0/0"
}

variable "app_repo_url" {
  description = "Optional repository URL used by cloud-init for first-boot instructions."
  type        = string
  default     = ""
}

variable "app_directory" {
  description = "Directory where the application should live on the VM."
  type        = string
  default     = "/opt/citizensignal"
}

variable "autonomous_database_db_name" {
  description = "Database name for the Autonomous Database."
  type        = string
  default     = "CITISIG"
}

variable "autonomous_database_display_name" {
  description = "Display name for the Autonomous Database."
  type        = string
  default     = "citizensignal-adb"
}

variable "autonomous_database_admin_password" {
  description = "Admin password for the Autonomous Database."
  type        = string
  sensitive   = true
}

variable "autonomous_database_cpu_core_count" {
  description = "CPU core count for the Autonomous Database."
  type        = number
  default     = 2
}

variable "autonomous_database_storage_tbs" {
  description = "Data storage size in TBs for the Autonomous Database."
  type        = number
  default     = 1
}

variable "autonomous_database_workload" {
  description = "OCI Autonomous Database workload type."
  type        = string
  default     = "AJD"
}

variable "schema_apply_enabled" {
  description = "Whether Terraform should invoke the local schema-application script after database provisioning."
  type        = bool
  default     = false
}

variable "schema_apply_connect_string" {
  description = "Optional explicit connect string used when applying schema from Terraform."
  type        = string
  default     = ""
}
