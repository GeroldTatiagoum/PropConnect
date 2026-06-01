#!/bin/sh
# Creates the S3 bucket on LocalStack startup
awslocal s3 mb s3://propconnect-documents-dev
echo "S3 bucket 'propconnect-documents-dev' created."
