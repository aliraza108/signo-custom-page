import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Custom Sign Builder - Design Your Sign Online',
  description: 'Create custom signs with our professional design studio. Add text, shapes, QR codes, upload images, and more. Vistaprint-level editor.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Initialize window properties early
              window.NEXT_PUBLIC_SHOPIFY_STORE = 'signografx.myshopify.com';
              window.SHOPIFY_PRODUCT = null;
              window.SHOPIFY_VARIANT_ID = null;
              
              console.log('[v0] Initializing Shopify message listener...');
              
              // Listen for product data from Shopify iframe parent
              window.addEventListener('message', (event) => {
                console.log('[v0] Message received:', event.data?.type, event.origin);
                if (event.data?.type === 'SHOPIFY_PRODUCT_DATA') {
                  console.log('[v0] Received Shopify product data');
                  
                  const productData = event.data.payload || event.data.product;
                  if (productData) {
                    window.SHOPIFY_PRODUCT = productData;
                    console.log('[v0] Set SHOPIFY_PRODUCT');
                    
                    const variantId = productData.variant?.id || productData.selected_or_first_available_variant?.id;
                    if (variantId) {
                      window.SHOPIFY_VARIANT_ID = variantId;
                    }
                    
                    // Dispatch event for React components
                    window.dispatchEvent(new CustomEvent('shopify-product-loaded', { detail: productData }));
                  }
                }
              });
              
              // Check URL params as fallback
              const sp = new URLSearchParams(window.location.search);
              if (sp.has('product') && sp.has('variant')) {
                console.log('[v0] Loading from URL (standalone mode)');
                window.SHOPIFY_PRODUCT = {
                  id: sp.get('product'),
                  variant: { id: sp.get('variant') },
                  metafields: {}
                };
                window.SHOPIFY_VARIANT_ID = sp.get('variant');
                window.dispatchEvent(new CustomEvent('shopify-product-loaded', { detail: window.SHOPIFY_PRODUCT }));
              }
              
              console.log('[v0] Message listener ready');
            })();
          `
        }} />
      </body>
    </html>
  )
}
