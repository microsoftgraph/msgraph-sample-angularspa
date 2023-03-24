resource "azurerm_resource_group" "resource_group" {
  name     = "rg-${var.resource_group_name}"
  location = var.resource_group_location
  tags = {
    Language = var.language
  }
}
