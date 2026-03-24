variable "compartment_id" {
  description = "Compartment OCID for compute resources."
  type        = string
}

variable "availability_domain" {
  description = "Availability domain for the VM."
  type        = string
}

variable "display_name" {
  description = "VM display name."
  type        = string
}

variable "shape" {
  description = "OCI compute shape."
  type        = string
}

variable "ocpus" {
  description = "OCPU count for flex shapes."
  type        = number
}

variable "memory_in_gbs" {
  description = "Memory allocation for flex shapes."
  type        = number
}

variable "subnet_id" {
  description = "Subnet OCID for the instance."
  type        = string
}

variable "assign_public_ip" {
  description = "Whether the instance should have a public IP."
  type        = bool
}

variable "network_security_group_ids" {
  description = "NSGs attached to the instance VNIC."
  type        = list(string)
}

variable "ssh_public_key" {
  description = "SSH public key material."
  type        = string
}

variable "image_ocid" {
  description = "OCI image OCID."
  type        = string
}

variable "app_directory" {
  description = "Application directory created on the VM."
  type        = string
}

variable "app_repo_url" {
  description = "Optional repository URL used during first-boot setup."
  type        = string
}

variable "freeform_tags" {
  description = "Freeform tags applied to resources."
  type        = map(string)
}
