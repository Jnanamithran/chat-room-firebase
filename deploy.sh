#!/bin/bash
# Firebase Deployment Script
# Usage: ./deploy.sh or bash deploy.sh

set -e

echo "🔨 Building project..."
npm run build

echo ""
echo "🚀 Deploying to Firebase..."

# Load token from .env file
if [ -f .env ]; then
  export $(cat .env | grep FIREBASE_TOKEN | xargs)
fi

if [ -z "$FIREBASE_TOKEN" ]; then
  echo "❌ Error: FIREBASE_TOKEN not found in .env file"
  exit 1
fi

firebase deploy --token $FIREBASE_TOKEN

echo ""
echo "✅ Deployment complete!"
echo "🌐 Live URL: https://react-chat-app-8c28e.web.app"
