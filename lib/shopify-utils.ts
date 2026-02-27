/**
 * Shopify cart integration utilities
 */

interface ShopifyProduct {
  id: string
  title: string
  metafields?: Record<string, any> | Array<{
    namespace: string
    key: string
    value: string
    type: string
  }>
  variants?: Array<{
    id: string
    title: string
  }>
}

interface CartItem {
  variantId: string
  quantity: number
  attributes?: Record<string, string>
}

/**
 * Extract product metadata
 */
export function extractProductMetadata(product: ShopifyProduct) {
  if (!product.metafields) {
    return {
      materials: [],
      sizes: [],
      pricePerSqft: 0,
      description: '',
    }
  }

  let materials = []
  let sizes = []
  let pricePerSqft = 0
  let description = ''

  // Handle both object format (from new Shopify snippet) and array format (from old format)
  if (Array.isArray(product.metafields)) {
    // Old array format - call .filter() and .find()
    materials = product.metafields
      .filter(m => m.namespace === 'custom' && m.key === 'materials')
      .map(m => {
        try {
          return JSON.parse(m.value)
        } catch {
          return []
        }
      })
      .flat()

    sizes = product.metafields
      .filter(m => m.namespace === 'custom' && m.key === 'sizes')
      .map(m => {
        try {
          return JSON.parse(m.value)
        } catch {
          return []
        }
      })
      .flat()

    pricePerSqft =
      parseFloat(
        product.metafields.find(m => m.namespace === 'custom' && m.key === 'price_per_sqft')?.value || '0'
      ) || 0

    description =
      product.metafields.find(m => m.namespace === 'custom' && m.key === 'description')?.value || ''
  } else {
    // New object format from Shopify snippet
    if (product.metafields.materials) {
      const m = product.metafields.materials
      materials = typeof m === 'string' ? JSON.parse(m) : m
      materials = Array.isArray(materials) ? materials : []
    }

    if (product.metafields.sizes) {
      const s = product.metafields.sizes
      sizes = typeof s === 'string' ? JSON.parse(s) : s
      sizes = Array.isArray(sizes) ? sizes : []
    }

    if (product.metafields.price_per_sqft) {
      pricePerSqft = parseFloat(product.metafields.price_per_sqft) || 0
    }

    if (product.metafields.description) {
      description = typeof product.metafields.description === 'string' ? product.metafields.description : ''
    }
  }

  return {
    materials,
    sizes,
    pricePerSqft,
    description,
  }
}

/**
 * Generate design image from canvas data
 */
export async function generateDesignImage(objects: any[], canvasWidth: number, canvasHeight: number): Promise<string> {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve('')
        return
      }

      const dpi = 150
      canvas.width = canvasWidth * dpi / 2.54
      canvas.height = canvasHeight * dpi / 2.54

      // White background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw objects
      for (const obj of objects) {
        ctx.save()
        const pixelX = (obj.x / canvasWidth) * canvas.width
        const pixelY = (obj.y / canvasHeight) * canvas.height
        const pixelW = (obj.width / canvasWidth) * canvas.width
        const pixelH = (obj.height / canvasHeight) * canvas.height

        ctx.translate(pixelX, pixelY)
        ctx.rotate((obj.rotation * Math.PI) / 180)
        ctx.globalAlpha = obj.opacity || 1

        if (obj.type === 'shape') {
          ctx.fillStyle = obj.fill || '#3b82f6'
          if (obj.shapeType === 'rectangle') {
            ctx.fillRect(-pixelW / 2, -pixelH / 2, pixelW, pixelH)
          } else if (obj.shapeType === 'circle') {
            ctx.beginPath()
            ctx.ellipse(0, 0, pixelW / 2, pixelH / 2, 0, 0, Math.PI * 2)
            ctx.fill()
          }
        } else if (obj.type === 'text') {
          const scale = dpi / 96
          ctx.font = `${obj.fontWeight || 'normal'} ${(obj.fontSize || 32) * scale}px ${obj.fontFamily || 'sans-serif'}`
          ctx.fillStyle = obj.textColor || '#000000'
          ctx.textAlign = obj.textAlign || 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(obj.text || '', 0, 0)
        } else if (obj.type === 'image' && obj.src) {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => {
            ctx.drawImage(img, -pixelW / 2, -pixelH / 2, pixelW, pixelH)
          }
          img.src = obj.src
        }

        ctx.restore()
      }

      resolve(canvas.toDataURL('image/png', 0.9))
    } catch (error) {
      console.error('[v0] Error generating design image:', error)
      resolve('')
    }
  })
}

/**
 * Add item to Shopify cart using the Cart API
 */
export async function addToShopifyCart(
  variantId: string,
  quantity: number = 1,
  attributes?: Record<string, string>
) {
  try {
    console.log('[v0] Adding to cart:', { variantId, quantity, attributes })
    
    // Get store URL from window
    const storeUrl = 'signografx.myshopify.com'
    
    // Use Shopify's cart API format
    const cartUrl = `https://${storeUrl}/cart/add.js`
    
    const response = await fetch(cartUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        id: variantId,
        quantity,
        attributes,
      }),
    })

    if (!response.ok) {
      console.error('[v0] Cart response status:', response.status, response.statusText)
      throw new Error(`Cart API error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('[v0] Item added to cart successfully:', data)
    return data
  } catch (error) {
    console.error('[v0] Error adding to cart:', error)
    throw error
  }
}

/**
 * Redirect to checkout
 */
export function redirectToCheckout() {
  window.location.href = '/cart'
}

/**
 * Get Shopify product data from window object (set in Liquid template)
 */
export function getShopifyProduct(): ShopifyProduct | null {
  if (typeof window === 'undefined') return null
  const product = (window as any).SHOPIFY_PRODUCT
  return product || null
}

/**
 * Get variant ID from Shopify
 */
export function getVariantId(): string | null {
  if (typeof window === 'undefined') return null
  return (window as any).SHOPIFY_VARIANT_ID || null
}

/**
 * Get store info
 */
export function getStoreInfo() {
  if (typeof window === 'undefined') {
    return { currency: 'USD', storeName: '' }
  }

  return {
    currency: (window as any).SHOPIFY_CURRENCY || 'USD',
    storeName: (window as any).SHOPIFY_STORE_NAME || '',
  }
}

/**
 * Upload design image to Cloudinary via our API.
 * Renders all design objects onto a real <canvas>, converts to a blob,
 * and POSTs to /api/upload-design which proxies to Cloudinary.
 */
export async function uploadDesignImage(
  objects: any[],
  canvasWidth: number,
  canvasHeight: number
): Promise<string> {
  try {
    // --- render onto an off-screen canvas ---
    const dpi = 150
    const pxW = Math.round((canvasWidth / 2.54) * dpi)
    const pxH = Math.round((canvasHeight / 2.54) * dpi)

    const canvas = document.createElement('canvas')
    canvas.width = pxW
    canvas.height = pxH
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    // white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, pxW, pxH)

    // draw every object (images are loaded async, so we wait)
    const imageLoadPromises: Promise<void>[] = []

    for (const obj of objects) {
      ctx.save()
      const px = (obj.x / canvasWidth) * pxW
      const py = (obj.y / canvasHeight) * pxH
      const pw = (obj.width / canvasWidth) * pxW
      const ph = (obj.height / canvasHeight) * pxH

      ctx.translate(px, py)
      ctx.rotate((obj.rotation * Math.PI) / 180)
      ctx.globalAlpha = obj.opacity ?? 1

      if (obj.type === 'shape') {
        ctx.fillStyle = obj.fill || '#3b82f6'
        if (obj.shapeType === 'circle') {
          ctx.beginPath()
          ctx.ellipse(0, 0, pw / 2, ph / 2, 0, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillRect(-pw / 2, -ph / 2, pw, ph)
        }
        if (obj.strokeWidth && obj.stroke) {
          ctx.strokeStyle = obj.stroke
          ctx.lineWidth = obj.strokeWidth * (dpi / 96)
          if (obj.shapeType === 'circle') {
            ctx.beginPath()
            ctx.ellipse(0, 0, pw / 2, ph / 2, 0, 0, Math.PI * 2)
            ctx.stroke()
          } else {
            ctx.strokeRect(-pw / 2, -ph / 2, pw, ph)
          }
        }
      } else if (obj.type === 'text') {
        const s = dpi / 96
        ctx.font = `${obj.fontWeight || 'normal'} ${obj.fontStyle || 'normal'} ${(obj.fontSize || 32) * s}px ${obj.fontFamily || 'sans-serif'}`
        ctx.fillStyle = obj.textColor || '#000000'
        ctx.textAlign = (obj.textAlign as CanvasTextAlign) || 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(obj.text || '', 0, 0)
      } else if (obj.type === 'image' && obj.src) {
        // capture current transform so we can draw later
        const t = ctx.getTransform()
        const w = pw, h = ph
        imageLoadPromises.push(
          new Promise<void>((resolve) => {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => {
              ctx.save()
              ctx.setTransform(t)
              ctx.drawImage(img, -w / 2, -h / 2, w, h)
              ctx.restore()
              resolve()
            }
            img.onerror = () => resolve() // skip broken images
            img.src = obj.src
          })
        )
      }

      ctx.restore()
    }

    // wait for all images to finish drawing
    await Promise.all(imageLoadPromises)

    // --- convert to blob and upload ---
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png', 0.95)
    )
    if (!blob) return ''

    const formData = new FormData()
    formData.append('image', blob, `design-${Date.now()}.png`)

    const response = await fetch('/api/upload-design', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('[v0] Upload API error:', err)
      return ''
    }

    const result = await response.json()
    return result.url || ''
  } catch (error) {
    console.error('[v0] uploadDesignImage error:', error)
    return ''
  }
}
