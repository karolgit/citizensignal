variable "parent_compartment_ocid" {
  description = "Parent landing-zone-managed compartment for this workload."
  type        = string
}

variable "name_prefix" {
  description = "Normalized name prefix used in resource names."
  type        = string
}

variable "freeform_tags" {
  description = "Freeform tags applied to created resources."
  type        = map(string)
}
