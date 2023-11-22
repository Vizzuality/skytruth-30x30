output "site_url" {
  value = local.domain
}

output "api_url" {
  value = "${local.domain}/backend/api"
}

output "analysis_cloud_function_url" {
  value = module.analysis_cloud_function.function_uri
}
