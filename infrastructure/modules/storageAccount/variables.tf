
variable "resource_group_name" {
  type        = string
  description = "Name of the resource group the storage account will be deployed to"
}

variable "storage_account_location" {
  type        = string
  description = "Location the storage account will be deployed to"
}

variable "storage_account_name" {
  type        = string
  description = "Name used for the storage account"
}

variable "storage_account_tier" {
  type    = string
  default = "Standard"
  validation {
    condition     = contains(["Standard", "Premium"], var.storage_account_tier)
    error_message = "Please provide a valid SKU for the stroage account"
  }
}

variable "storage_account_replication_type" {
  type        = string
  default     = "LRS"
  description = "Required by the provider to indicate what replication type"
  validation {
    condition     = contains(["LRS", "GRS", "RAGRS", "ZRS", "GZRS", "RAGZRS"], var.storage_account_replication_type)
    error_message = "Please provide a valide replication type for the storage account"
  }
}

variable "language" {
  type        = string
  description = "Language used to build the resource"
}