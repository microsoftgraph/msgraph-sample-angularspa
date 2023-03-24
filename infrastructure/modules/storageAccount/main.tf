resource "azurerm_storage_account" "storage_account" {
  name                     = lower("sa${replace(var.storage_account_name, "-", "")}")
  resource_group_name      = var.resource_group_name
  location                 = var.storage_account_location
  account_tier             = var.storage_account_tier
  account_replication_type = var.storage_account_replication_type
  static_website {
    index_document = "index.html"
  }
  tags = {
    Language = var.language
  }
  identity {
    type = "SystemAssigned"
  }
}
