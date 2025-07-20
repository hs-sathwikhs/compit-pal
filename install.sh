#!/bin/bash

echo "🚀 Setting up Compit Pal - Competitive Challenge Tracking"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local file..."
    cat > .env.local << EOF
# Vercel KV Configuration
KV_URL=your_kv_url_here
KV_REST_API_URL=your_kv_rest_api_url_here
KV_REST_API_TOKEN=your_kv_rest_api_token_here
KV_REST_API_READ_ONLY_TOKEN=your_kv_read_only_token_here

# JWT Secret (generate a secure random string)
JWT_SECRET=your_jwt_secret_key_here

# Environment
NODE_ENV=development
EOF
    echo "✅ Created .env.local file"
    echo "⚠️  Please update the environment variables in .env.local with your actual values"
else
    echo "✅ .env.local file already exists"
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Vercel CLI"
        exit 1
    fi
    echo "✅ Vercel CLI installed"
else
    echo "✅ Vercel CLI already installed"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Vercel KV credentials"
echo "2. Run 'vercel login' to authenticate with Vercel"
echo "3. Run 'vercel kv create' to create a KV database"
echo "4. Run 'vercel link' to link your project"
echo "5. Run 'vercel env pull .env.local' to get environment variables"
echo "6. Run 'npm run dev' to start the development server"
echo ""
echo "For detailed instructions, see README.md"
echo ""
echo "Happy coding with Compit Pal! 🚀" 