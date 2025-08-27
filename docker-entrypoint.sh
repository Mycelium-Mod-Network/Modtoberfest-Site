#!/bin/sh
set -e

echo "Waiting for database to be ready..."
# wait until the database is reachable
until nc -z -v -w30 $(echo $DATABASE_URL | sed -E 's/.*:\/\/([^:@]+).*@([^:]+):([0-9]+).*/\2 \3/'); do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is up - running migrations..."
npm run deploy-db

echo "Starting application..."
exec "$@"
