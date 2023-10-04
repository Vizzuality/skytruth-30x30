# Create a GCS Bucket
resource "google_storage_bucket" "tf-bucket" {
  project       = var.gcp_project_id
  name          = var.bucket_name
  location      = var.gcp_region
  force_destroy = true
  storage_class = var.storage_class
  versioning {
    enabled = true
  }
}
