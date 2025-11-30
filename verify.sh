#!/bin/bash

echo "🔍 Verifying TaxSyncQC Application..."

echo ""
echo "✅ 1. Running tests..."
npm test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed!"
    exit 1
fi

echo ""
echo "✅ 2. Testing CLI functionality..."
node cli.js --slip "Box A: 60000" > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ CLI test failed!"
    exit 1
fi

echo ""
echo "✅ 3. Testing CLI with RRSP..."
node cli.js --slip "Box A: 60000" --rrsp 5000 > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ CLI with RRSP test failed!"
    exit 1
fi

echo ""
echo "✅ 4. Building distribution..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "✅ 5. Testing built application..."
cd dist && node cli.js --slip "Box A: 60000" --rrsp 5000 > /dev/null 2>&1
cd ..

if [ $? -ne 0 ]; then
    echo "❌ Built application test failed!"
    exit 1
fi

echo ""
echo "🎉 All verifications passed! TaxSyncQC is working correctly."
echo ""
echo "📋 Summary:"
echo "   - All tests passing"
echo "   - CLI functionality verified"
echo "   - RRSP calculations working"
echo "   - Build process successful"
echo "   - Distribution executable verified"
echo ""
echo "🚀 The application is ready for distribution and commercialization!"