# define GCP region
variable "gcp_region" {
  type        = string
  description = "GCP region"
}

# define GCP project id
variable "gcp_project_id" {
  type        = string
  description = "GCP project name"
}

variable "bucket_name" {
  type        = string
  description = "The name of the Google Storage Bucket to create"
}

variable "storage_class" {
  type        = string
  default     = "STANDARD"
  description = "The storage class of the Storage Bucket to create"
}
