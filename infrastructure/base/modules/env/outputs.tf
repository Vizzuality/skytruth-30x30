output "site_url" {
  value = local.frontend_lb_url
}

output "cms_url" {
  value = local.cms_lb_url
}

output "api_url" {
  value = local.cms_lb_url
}

output "analysis_cloud_function_url" {
  value = local.analysis_cf_lb_url
}

output "client_env" {
  value = local.client_env
}

output "cms_env" {
  value = local.cms_env
}