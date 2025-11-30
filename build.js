#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏗️  Building TaxSyncQC CLI application...');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy all source files to dist
const sourceFiles = [
  'cli.js',
  'credit-calculator.js',
  'rrsp-calculator.js',
  'rl1-parser.js',
  'income-slip-parser.js',
  'i18n.js',
  'package.json',
  'README.md',
  'LICENSE'
];

for (const file of sourceFiles) {
  if (fs.existsSync(path.join(__dirname, file))) {
    fs.copyFileSync(
      path.join(__dirname, file),
      path.join(distDir, file)
    );
    console.log(`✅ Copied ${file}`);
  } else {
    console.log(`⚠️  Warning: ${file} not found`);
  }
}

// Create a simple index.html for the web version
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TaxSyncQC - Quebec Tax Calculator</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
            color: #333;
        }
        .container {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            text-align: center;
        }
        .instructions {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        code {
            background: #f1f1f1;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>💰 TaxSyncQC - Quebec Tax Calculator</h1>
        
        <div class="instructions">
            <h2>How to Use:</h2>
            <p>1. Open your terminal/command prompt</p>
            <p>2. Navigate to this directory</p>
            <p>3. Run the following command with your income data:</p>
            <p><code>node cli.js --slip "Box A: 60000"</code></p>
            <p>Or with RRSP contribution:</p>
            <p><code>node cli.js --slip "Box A: 60000" --rrsp 5000</code></p>
        </div>
        
        <h2>Features:</h2>
        <ul>
            <li>✅ Calculates Quebec Solidarity Credit</li>
            <li>✅ Calculates Quebec Work Premium</li>
            <li>✅ Calculates Federal Basic Personal Amount savings</li>
            <li>✅ Calculates Canada Workers Benefit (CWB)</li>
            <li>✅ RRSP impact estimation</li>
            <li>✅ Bilingual support (FR/EN)</li>
            <li>✅ Privacy-first (100% client-side)</li>
        </ul>
        
        <h2>Supported Input Formats:</h2>
        <ul>
            <li>RL-1: "Case A: 60000", "Box A: 60000"</li>
            <li>T4: "Box 14: 60000"</li>
            <li>Any format with income values</li>
        </ul>
    </div>
    
    <div class="footer">
        <p>Made in Quebec, for Quebec. Fait au Québec, pour le Québec.</p>
        <p>For more information, check the <a href="README.md">README</a> file.</p>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent);
console.log('✅ Created index.html');

// Create a build info file
const buildInfo = {
  version: JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8')).version,
  buildDate: new Date().toISOString(),
  description: 'TaxSyncQC built distribution',
  files: sourceFiles
};

fs.writeFileSync(path.join(distDir, 'BUILD_INFO.json'), JSON.stringify(buildInfo, null, 2));
console.log('✅ Created BUILD_INFO.json');

console.log('🎉 Build completed successfully!');
console.log(`📁 Distribution files are in: ${distDir}`);
console.log('');
console.log('🚀 To run the application:');
console.log('   cd dist');
console.log('   node cli.js --slip "Box A: 60000"');