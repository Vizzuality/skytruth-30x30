output "site_url" {
  value = local.domain
}

output "api_url" {
  value = "${local.domain}/backend/api"
}
