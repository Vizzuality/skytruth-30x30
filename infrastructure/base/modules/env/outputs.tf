output "site_url" {
  value = var.domain
}

output "api_url" {
  value = "${var.domain}/backend"
}
