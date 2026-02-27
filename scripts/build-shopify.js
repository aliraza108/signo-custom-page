#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('Building Shopify standalone bundle...\n')

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, '..', 'public', 'shopify-assets')
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true })
}

// Look for the generated files in .next/static
const nextDir = path.join(__dirname, '..', '.next')
const standaloneDir = path.join(nextDir, 'standalone')
const staticDir = path.join(nextDir, 'static')

if (!fs.existsSync(nextDir)) {
  console.error('Error: .next directory not found. Run npm run build first.')
  process.exit(1)
}

// Find and copy CSS files
const cssPattern = /css-[a-zA-Z0-9]+\.css/
const nextStaticDir = path.join(nextDir, 'static')

if (fs.existsSync(nextStaticDir)) {
  const files = fs.readdirSync(nextStaticDir)
  
  // Find CSS directory
  const cssDirs = files.filter(f => {
    const fullPath = path.join(nextStaticDir, f)
    return fs.statSync(fullPath).isDirectory()
  })

  let cssContent = ''

  for (const dir of cssDirs) {
    const dirPath = path.join(nextStaticDir, dir)
    const dirFiles = fs.readdirSync(dirPath)
    
    for (const file of dirFiles) {
      if (file.endsWith('.css')) {
        const filePath = path.join(dirPath, file)
        const content = fs.readFileSync(filePath, 'utf8')
        cssContent += content + '\n'
      }
    }
  }

  if (cssContent) {
    const cssOutput = path.join(assetsDir, 'sign-builder.css')
    fs.writeFileSync(cssOutput, cssContent)
    console.log(`✓ Created: ${cssOutput}`)
  }
}

// Create the main JavaScript entry point
const jsEntryPoint = path.join(assetsDir, 'sign-builder.js')

const jsContent = `
(function() {
  // Inject Tailwind CSS if not already present
  if (!document.getElementById('tailwind-cdn')) {
    const link = document.createElement('link');
    link.id = 'tailwind-cdn';
    link.href = 'https://cdn.tailwindcss.com';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  // Inject component CSS
  if (!document.getElementById('sign-builder-styles')) {
    const link = document.createElement('link');
    link.id = 'sign-builder-styles';
    link.href = window.SIGN_BUILDER_CSS_URL || './sign-builder.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  // Wait for React to be loaded
  if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
    initializeSignBuilder();
  } else {
    document.addEventListener('DOMContentLoaded', initializeSignBuilder);
  }

  function initializeSignBuilder() {
    const root = document.getElementById('designer-root');
    if (!root) {
      console.error('Sign Builder: Container element #designer-root not found');
      return;
    }

    // Make Shopify data available to the app
    window.shopifyData = {
      variantId: window.SHOPIFY_VARIANT_ID,
      product: window.SHOPIFY_PRODUCT,
      cartAdd: function(variantId, quantity) {
        // Add to cart via Shopify API
        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: [{ id: variantId, quantity: quantity }]
          })
        }).then(() => {
          window.location.href = '/cart';
        }).catch(err => console.error('Cart error:', err));
      }
    };

    // Initialize the sign builder app
    if (window.SignBuilderApp) {
      const App = window.SignBuilderApp.default || window.SignBuilderApp;
      if (typeof ReactDOM.createRoot === 'function') {
        const reactRoot = ReactDOM.createRoot(root);
        reactRoot.render(React.createElement(App));
      } else {
        ReactDOM.render(React.createElement(App), root);
      }
    } else {
      console.error('Sign Builder: App component not loaded');
    }
  }
})();
`

fs.writeFileSync(jsEntryPoint, jsContent)
console.log(`✓ Created: ${jsEntryPoint}`)

// Create Liquid template
const liquidTemplate = `<!-- Sign Builder Template -->
<div id="designer-root"></div>

<script>
  // Pass Shopify data to the app
  window.SHOPIFY_VARIANT_ID = {{ product.selected_or_first_available_variant.id }};
  window.SHOPIFY_PRODUCT = {{ product | json }};
  window.SIGN_BUILDER_CSS_URL = "{{ 'sign-builder.css' | asset_url }}";
</script>

<!-- Load React and ReactDOM from CDN -->
<script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js" defer></script>
<script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js" defer></script>

<!-- Load Sign Builder CSS -->
{{ 'sign-builder.css' | asset_url | stylesheet_tag }}

<!-- Load Sign Builder JS -->
<script src="{{ 'sign-builder.js' | asset_url }}" defer></script>
`

const liquidFile = path.join(assetsDir, 'sign-builder-template.liquid')
fs.writeFileSync(liquidFile, liquidTemplate)
console.log(`✓ Created: ${liquidFile}`)

// Create installation guide
const guide = `# Sign Builder Shopify Integration Guide

## Installation Steps

### 1. Build the Sign Builder
\`\`\`bash
npm run build:shopify
\`\`\`

This creates:
- \`public/shopify-assets/sign-builder.css\`
- \`public/shopify-assets/sign-builder.js\`
- \`public/shopify-assets/sign-builder-template.liquid\`

### 2. Upload Assets to Shopify

1. Go to your Shopify store admin
2. Navigate to **Settings > Files** or **Content > Files**
3. Upload the generated CSS and JS files:
   - \`sign-builder.css\`
   - \`sign-builder.js\`

### 3. Create/Edit Product Template

1. Go to **Sales channels > Online Store > Products**
2. Select the product where you want to use the sign builder
3. Click **Edit template** or create a new product template
4. Copy the contents of \`sign-builder-template.liquid\` into your template
5. Save the template

### 4. Customize (Optional)

- Change CSS styling by editing the assets
- Modify template to match your store design
- Adjust pricing tiers in the app settings

## File Descriptions

- **sign-builder.css** - All styles for the design editor
- **sign-builder.js** - Main application bundle
- **sign-builder-template.liquid** - Shopify Liquid template for product pages

## Shopify Data Access

The app has access to:
- \`window.SHOPIFY_VARIANT_ID\` - Current product variant ID
- \`window.SHOPIFY_PRODUCT\` - Full product data (JSON)
- \`window.shopifyData.cartAdd(variantId, quantity)\` - Add to cart function

## Troubleshooting

If the app doesn't load:
1. Check browser console for errors
2. Verify CSS and JS files uploaded correctly
3. Ensure \`<div id="designer-root"></div>\` is in the template
4. Check that Tailwind CSS CDN is accessible

## Support

For issues, check the app's console for error messages and verify all files are properly uploaded to Shopify.
`

const guideFile = path.join(assetsDir, 'SHOPIFY_SETUP.md')
fs.writeFileSync(guideFile, guide)
console.log(`✓ Created: ${guideFile}`)

console.log('\n✓ Shopify build complete!')
console.log(`\nNext steps:`)
console.log(`1. Files are ready in: ${assetsDir}`)
console.log(`2. Upload sign-builder.css and sign-builder.js to Shopify`)
console.log(`3. Use sign-builder-template.liquid in your product template`)
console.log(`\nFor detailed instructions, see: ${guideFile}`)
