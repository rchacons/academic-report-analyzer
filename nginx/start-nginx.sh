#!/bin/bash
envsubst '$SSL_CERTIFICATE,$SSL_CERTIFICATE_KEY','$SERVER_NAME' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Wait for the backend service to be ready (doing it manually as nc is not available)
while ! timeout 1 bash -c 'cat < /dev/null > /dev/tcp/backend/8000'; do
  sleep 1
done

exec nginx -g 'daemon off;'