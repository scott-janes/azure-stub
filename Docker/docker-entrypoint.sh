#!/bin/bash
set -euo pipefail

sed -i "s|REPLACE_PORT|$PORT|g" .env
sed -i "s|REPLACE_CLIENT_ID|$CLIENT_ID|g" .env
sed -i "s|REPLACE_ENVIRONMENT|$ENVIRONMENT|g" .env
sed -i "s|REPLACE_CONFIG_LOCATION|$CONFIG_LOCATION|g" .env

exec "$@"