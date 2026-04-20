#!/usr/bin/env bash
# Exit on error
set -e

echo "Installing client dependencies..."
npm install --prefix client

echo "Installing server dependencies..."
npm install --prefix server

echo "Building client..."
npm run build --prefix client

echo "Build complete!"