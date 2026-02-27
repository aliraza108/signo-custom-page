import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/cart/add
 * Proxy to Shopify cart API with custom design attributes
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[v0] Cart add request:', body)

    // Shopify store domain
    const shopifyStore = 'signografx.myshopify.com'

    // Forward to Shopify cart API
    const cartUrl = `https://${shopifyStore}/cart/add.js`
    
    const response = await fetch(cartUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    
    console.log('[v0] Shopify cart response:', data)

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[v0] Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}
