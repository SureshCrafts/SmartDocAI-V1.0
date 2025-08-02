#!/bin/bash

# Path to the backend .env file
ENV_FILE="backend/.env"

echo "🔧 OpenAI API Key Setup"
echo "======================="
echo ""
echo "This script will help you configure your OpenAI API key for the SmartDocAI backend."
echo "You can get your API key from: https://platform.openai.com/account/api-keys"
echo ""

# Prompt for the API key
read -p "Please enter your OpenAI API key (starts with 'sk-'): " OPENAI_API_KEY

# Basic validation
if [[ -z "$OPENAI_API_KEY" ]]; then
    echo "❌ No API key entered. Aborting."
    exit 1
fi

if [[ ! "$OPENAI_API_KEY" == sk-* ]]; then
    echo "⚠️  Warning: The key does not seem to be a valid OpenAI API key (should start with 'sk-')."
fi

# Check if backend directory and .env file exist
if [ ! -d "backend" ]; then
    echo "❌ 'backend' directory not found. Please run this script from the project root."
    exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
    echo "Creating backend/.env file..."
    touch "$ENV_FILE"
fi

# Check if the key already exists and update it, otherwise add it.
# Use a temporary file to avoid issues with sed -i on different OS (macOS vs Linux)
TMP_FILE=$(mktemp)

if grep -q "OPENAI_API_KEY=" "$ENV_FILE"; then
    echo "Updating existing OPENAI_API_KEY in $ENV_FILE..."
    # Use a different separator for sed to handle potential special characters in the key
    sed "s|^OPENAI_API_KEY=.*|OPENAI_API_KEY=$OPENAI_API_KEY|" "$ENV_FILE" > "$TMP_FILE" && mv "$TMP_FILE" "$ENV_FILE"
else
    echo "Adding OPENAI_API_KEY to $ENV_FILE..."
    cp "$ENV_FILE" "$TMP_FILE"
    echo "" >> "$TMP_FILE"
    echo "OPENAI_API_KEY=$OPENAI_API_KEY" >> "$TMP_FILE"
    mv "$TMP_FILE" "$ENV_FILE"
fi

echo ""
echo "✅ OpenAI API Key has been configured in $ENV_FILE."
echo ""
echo "To apply the changes, please restart the backend server:"
echo "cd backend && npm start"
echo ""