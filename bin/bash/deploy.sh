#!/bin/bash

set -e

IMAGE_NAME="vladkasev/vue-app:latest"
DOCKERFILE_PATH="docker/Dockerfile"


docker buildx build \
  --platform linux/amd64 \
  -f "$DOCKERFILE_PATH" \
  -t "$IMAGE_NAME" \
  --push \
  .

echo "===> done: $IMAGE_NAME"