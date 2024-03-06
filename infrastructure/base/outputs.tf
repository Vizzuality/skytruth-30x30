output "staging_site_url" {
  value = module.staging.site_url
}

output "staging_api_url" {
  value = module.staging.api_url
}

output "staging_analysis_cloud_function_url" {
  value = module.staging.analysis_cloud_function_url
}

output "dns_name_servers" {
  value = module.dns.dns_name_servers
}

output "staging_client_env" {
  value     = module.staging.client_env
  sensitive = true
}

output "staging_cms_env" {
  value     = module.staging.cms_env
  sensitive = true
}

output "production_site_url" {
  value = module.production.site_url
}

output "production_api_url" {
  value = module.production.api_url
}

output "production_analysis_cloud_function_url" {
  value = module.production.analysis_cloud_function_url
}

output "production_client_env" {
  value     = module.production.client_env
  sensitive = true
}

output "production_cms_env" {
  value     = module.production.cms_env
  sensitive = true
}