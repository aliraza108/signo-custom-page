"use client"
// Cart sends: Product, Material, Size, Sides, Price, Design Image (Cloudinary)
import { useState, useCallback, useMemo, useEffect } from 'react'
import { useSignBuilder } from '@/lib/sign-builder-context'
import type { CanvasObject } from '@/lib/sign-builder-types'
import { useShopifyData } from '@/hooks/useShopifyData'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Eye,
  Download,
  Save,
  FolderOpen,
  Grid3X3,
  Ruler,
  Trash2,
  ChevronDown,
  FileImage,
  FileType,
  FileText,
  ShoppingCart,
  Check,
  X,
  Loader,
} from 'lucide-react'

const EXPORT_PX_PER_INCH = 100

function normalizeSvg(svg: string, width: number, height: number) {
  let out = (svg || '').trim()
  if (!out) return out
  if (!out.includes('xmlns')) {
    out = out.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
  }
  if (!/\bwidth\s*=/.test(out.substring(0, 400))) {
    out = out.replace(/(<svg[^>]*)>/, `$1 width="${width}" height="${height}">`)
  }
  return out
}

function shapeToSvg(obj: CanvasObject, width: number, height: number) {
  const fill = obj.fill === 'transparent' ? 'none' : (obj.fill || 'none')
  const stroke = obj.stroke || '#000000'
  const strokeWidth = obj.strokeWidth || 0
  const shape = obj.shapeType || 'rectangle'

  if (shape === 'circle') {
    return `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" /></svg>`
  }
  if (shape === 'triangle') {
    return `<svg viewBox="0 0 100 100"><polygon points="50,5 95,95 5,95" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" /></svg>`
  }
  if (shape === 'line') {
    const lineStroke = obj.stroke || obj.fill || '#000000'
    return `<svg viewBox="0 0 100 10" preserveAspectRatio="none"><line x1="0" y1="5" x2="100" y2="5" stroke="${lineStroke}" stroke-width="${Math.max(2, strokeWidth || 2)}" stroke-linecap="round" /></svg>`
  }
  if (shape === 'arrow') {
    const arrowStroke = obj.fill || obj.stroke || '#000000'
    return `<svg viewBox="0 0 100 30" preserveAspectRatio="none"><defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="${arrowStroke}" /></marker></defs><line x1="5" y1="15" x2="85" y2="15" stroke="${arrowStroke}" stroke-width="${Math.max(3, strokeWidth || 3)}" marker-end="url(#arrowhead)" /></svg>`
  }
  if (shape === 'star') {
    return `<svg viewBox="0 0 100 100"><polygon points="50,5 61,39 97,39 68,61 79,95 50,73 21,95 32,61 3,39 39,39" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" /></svg>`
  }
  if (shape === 'polygon') {
    const sides = Math.max(3, obj.sides || 6)
    const points = Array.from({ length: sides }, (_, i) => {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2
      const px = 50 + 45 * Math.cos(angle)
      const py = 50 + 45 * Math.sin(angle)
      return `${px},${py}`
    }).join(' ')
    return `<svg viewBox="0 0 100 100"><polygon points="${points}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" /></svg>`
  }
  if (shape === 'rounded-rectangle') {
    const radius = obj.cornerRadius || 8
    return `<svg viewBox="0 0 100 100"><rect x="2" y="2" width="96" height="96" rx="${radius}" ry="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" /></svg>`
  }
  if (shape === 'prohibition') {
    const red = obj.stroke || '#dc2626'
    const sw = obj.strokeWidth || 6
    return `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="${red}" stroke-width="${sw}" /><line x1="20" y1="80" x2="80" y2="20" stroke="${red}" stroke-width="${sw}" /></svg>`
  }
  if (shape === 'warning-triangle') {
    return `<svg viewBox="0 0 100 90"><polygon points="50,5 95,85 5,85" fill="${obj.fill || '#facc15'}" stroke="${obj.stroke || '#000000'}" stroke-width="${obj.strokeWidth || 3}" /><text x="50" y="70" text-anchor="middle" font-size="50" font-weight="bold" fill="#000000">!</text></svg>`
  }
  return `<svg viewBox="0 0 100 100"><rect x="0" y="0" width="100" height="100" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" /></svg>`
}

function textToSvg(obj: CanvasObject, width: number, height: number) {
  const safeText = (obj.text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  const fontSize = Math.max(8, obj.fontSize || 32)
  const weight = obj.fontWeight || 'normal'
  const style = obj.fontStyle || 'normal'
  const family = (obj.fontFamily || 'sans-serif').replace(/"/g, '')
  const color = obj.textColor || '#000000'
  const anchor = obj.textAlign === 'left' ? 'start' : obj.textAlign === 'right' ? 'end' : 'middle'
  const x = obj.textAlign === 'left' ? 0 : obj.textAlign === 'right' ? width : width / 2
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${obj.backgroundColor && obj.backgroundColor !== 'transparent' ? obj.backgroundColor : 'none'}" /><text x="${x}" y="${height / 2}" dominant-baseline="middle" text-anchor="${anchor}" fill="${color}" font-family="${family}" font-size="${fontSize}" font-weight="${weight}" font-style="${style}">${safeText}</text></svg>`
}

async function rasteriseSvg(svgStr: string, w: number, h: number) {
  return new Promise<string>((resolve) => {
    const tmp = document.createElement('canvas')
    tmp.width = w
    tmp.height = h
    const c = tmp.getContext('2d')
    if (!c) {
      resolve(tmp.toDataURL('image/png', 1))
      return
    }
    const svg = normalizeSvg(svgStr, w, h)
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      c.drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      resolve(tmp.toDataURL('image/png', 1))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(tmp.toDataURL('image/png', 1))
    }
    img.src = url
  })
}

async function exportFullDesign(layers: any[], width: number, height: number) {
  const out = document.createElement('canvas')
  out.width = width
  out.height = height
  const ctx = out.getContext('2d')
  if (!ctx) return ''
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  for (const layer of layers) {
    ctx.save()
    ctx.globalAlpha = layer.opacity ?? 1
    if (layer.rotation) {
      ctx.translate(layer.x + layer.width / 2, layer.y + layer.height / 2)
      ctx.rotate((layer.rotation * Math.PI) / 180)
      ctx.translate(-(layer.x + layer.width / 2), -(layer.y + layer.height / 2))
    }
    const src = layer.svgString
      ? await rasteriseSvg(layer.svgString, layer.width, layer.height)
      : layer.dataUrl
    if (src) {
      await new Promise<void>((res) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          ctx.drawImage(img, layer.x, layer.y, layer.width, layer.height)
          res()
        }
        img.onerror = () => res()
        img.src = src
      })
    }
    ctx.restore()
  }

  return out.toDataURL('image/png', 1.0)
}

export function TopToolbar() {
  const {
    zoom,
    setZoom,
    showGrid,
    showRulers,
    toggleGrid,
    toggleRulers,
    undo,
    redo,
    canUndo,
    canRedo,
    clearCanvas,
    objects,
    canvasWidth,
    canvasHeight,
    getDesignData,
    quantity,
    sides,
    material,
  } = useSignBuilder()

  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [cartStatus, setCartStatus] = useState<'success' | 'error' | null>(null)
  const [cartError, setCartError] = useState('')

  const { variantId, pricePerSqft, materials } = useShopifyData()

  const zoomLevels = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3]

  const resolvedMaterial = useMemo(() => {
    const cleaned = (material || '').trim()
    if (materials.length === 0) {
      return cleaned
        ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
        : 'Aluminum'
    }
    const exact = materials.find((m) => m.toLowerCase() === cleaned.toLowerCase())
    return exact || materials[0]
  }, [material, materials])

  const calcPrice = useCallback((wIn: number, hIn: number, ppsf: number, qty = 1) => {
    const sqft = (wIn * hIn) / 144
    return Number.parseFloat((sqft * ppsf * qty).toFixed(2))
  }, [])

  // Memoized price calculation
  const designPrice = useMemo(() => {
    if (!pricePerSqft || pricePerSqft <= 0) return 0
    const sidesMultiplier = sides === 2 ? 1.5 : 1
    return calcPrice(canvasWidth, canvasHeight, pricePerSqft, quantity) * sidesMultiplier
  }, [canvasWidth, canvasHeight, pricePerSqft, quantity, sides, calcPrice])

  const buildLayerData = useCallback(() => {
    const pxWidth = Math.max(1, Math.round(canvasWidth * EXPORT_PX_PER_INCH))
    const pxHeight = Math.max(1, Math.round(canvasHeight * EXPORT_PX_PER_INCH))
    const sorted = [...objects].sort((a, b) => a.zIndex - b.zIndex)

    const layers = sorted.map((obj) => {
      const width = Math.max(1, Math.round(obj.width * EXPORT_PX_PER_INCH))
      const height = Math.max(1, Math.round(obj.height * EXPORT_PX_PER_INCH))
      const x = Math.round((obj.x - obj.width / 2) * EXPORT_PX_PER_INCH)
      const y = Math.round((obj.y - obj.height / 2) * EXPORT_PX_PER_INCH)

      let svgString: string | null = null
      let dataUrl: string | null = null

      if (obj.type === 'shape') {
        svgString = shapeToSvg(obj, width, height)
      } else if (obj.type === 'text') {
        svgString = textToSvg(obj, width, height)
      } else if ((obj.type === 'image' || obj.type === 'icon' || obj.type === 'qrcode') && obj.src) {
        dataUrl = obj.src
      }

      return {
        svgString: svgString ? normalizeSvg(svgString, width, height) : null,
        dataUrl,
        x,
        y,
        width,
        height,
        opacity: obj.opacity ?? 1,
        rotation: obj.rotation ?? 0,
      }
    })

    return {
      layers,
      canvasPixelWidth: pxWidth,
      canvasPixelHeight: pxHeight,
    }
  }, [canvasHeight, canvasWidth, objects])

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'CART_UPDATED') {
        setIsAddingToCart(false)
        setIsCheckingOut(false)
        setCartStatus('success')
        setCartError('')
        window.setTimeout(() => setCartStatus(null), 3000)
      }
      if (event.data?.type === 'CART_ERROR') {
        setIsAddingToCart(false)
        setIsCheckingOut(false)
        setCartStatus('error')
        setCartError(event.data.payload?.error || 'Failed to add to cart')
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const postAddToCartMessage = useCallback((payload: Record<string, unknown>) => {
    let sent = false

    if (window.parent && window.parent !== window) {
      window.parent.postMessage(payload, '*')
      sent = true
    }

    if (window.top && window.top !== window.parent && window.top !== window) {
      window.top.postMessage(payload, '*')
      sent = true
    }

    return sent
  }, [])

  // Add to cart handler - sends message to parent Shopify window
  const handleAddToCart = useCallback(async () => {
    setIsAddingToCart(true)
    setCartStatus(null)
    setCartError('')

    try {
      if (!variantId) {
        setCartStatus('error')
        setCartError('Variant ID not found')
        setIsAddingToCart(false)
        return
      }

      if (objects.length === 0) {
        setCartStatus('error')
        setCartError('Please add elements to your design before adding to cart')
        setIsAddingToCart(false)
        return
      }

      const unitBase = pricePerSqft ? calcPrice(canvasWidth, canvasHeight, pricePerSqft, 1) : 0
      const sidesMultiplier = sides === 2 ? 1.5 : 1
      const unitPrice = Number.parseFloat((unitBase * sidesMultiplier).toFixed(2))

      const { layers, canvasPixelWidth, canvasPixelHeight } = buildLayerData()
      const customImage = await exportFullDesign(layers, canvasPixelWidth, canvasPixelHeight)

      const svgFallback = layers.find((layer) => typeof layer?.svgString === 'string' && layer.svgString.length > 0)?.svgString || null
      const sent = postAddToCartMessage({
        type: 'ADD_TO_CART',
        variantId: variantId,
        quantity: quantity,
        layerData: layers,
        svgString: svgFallback,
        customImage,
        canvasWidth: canvasPixelWidth,
        canvasHeight: canvasPixelHeight,
        material: resolvedMaterial,
        size: `${canvasWidth}" x ${canvasHeight}" (in)`,
        sides: sides === 2 ? '2 Sides' : '1 Side',
        qty: quantity,
        price: unitPrice,
        unitPrice,
        checkout: false,
      })
      if (!sent) {
        setCartStatus('error')
        setCartError('Designer must be opened inside Shopify iframe')
        setIsAddingToCart(false)
      }
    } catch (error) {
      console.error('[v0] Error adding to cart:', error)
      setCartStatus('error')
      setCartError(error instanceof Error ? error.message : 'Unknown error')
      setIsAddingToCart(false)
    }
  }, [variantId, objects, canvasWidth, canvasHeight, quantity, pricePerSqft, sides, calcPrice, buildLayerData, resolvedMaterial, postAddToCartMessage])

  const handleBuyNow = useCallback(async () => {
    setIsCheckingOut(true)
    setCartStatus(null)
    setCartError('')

    try {
      if (!variantId) {
        setCartStatus('error')
        setCartError('Variant ID not found')
        setIsCheckingOut(false)
        return
      }

      if (objects.length === 0) {
        setCartStatus('error')
        setCartError('Please add elements to your design before checkout')
        setIsCheckingOut(false)
        return
      }

      const unitBase = pricePerSqft ? calcPrice(canvasWidth, canvasHeight, pricePerSqft, 1) : 0
      const sidesMultiplier = sides === 2 ? 1.5 : 1
      const unitPrice = Number.parseFloat((unitBase * sidesMultiplier).toFixed(2))
      const { layers, canvasPixelWidth, canvasPixelHeight } = buildLayerData()
      const customImage = await exportFullDesign(layers, canvasPixelWidth, canvasPixelHeight)

      const svgFallback = layers.find((layer) => typeof layer?.svgString === 'string' && layer.svgString.length > 0)?.svgString || null
      const sent = postAddToCartMessage({
        type: 'ADD_TO_CART',
        variantId: variantId,
        quantity: quantity,
        layerData: layers,
        svgString: svgFallback,
        customImage,
        canvasWidth: canvasPixelWidth,
        canvasHeight: canvasPixelHeight,
        material: resolvedMaterial,
        size: `${canvasWidth}" x ${canvasHeight}" (in)`,
        sides: sides === 2 ? '2 Sides' : '1 Side',
        qty: quantity,
        price: unitPrice,
        unitPrice,
        checkout: true,
      })
      if (!sent) {
        setCartStatus('error')
        setCartError('Designer must be opened inside Shopify iframe')
        setIsCheckingOut(false)
      }
    } catch (error) {
      console.error('[v0] Error during checkout:', error)
      setCartStatus('error')
      setCartError(error instanceof Error ? error.message : 'Unknown error')
      setIsCheckingOut(false)
    } finally {
      if (!window.top || window.top === window) {
        setIsCheckingOut(false)
      }
    }
  }, [variantId, objects, canvasWidth, canvasHeight, quantity, pricePerSqft, sides, calcPrice, buildLayerData, resolvedMaterial, postAddToCartMessage])

  const saveProject = () => {
    const data = getDesignData()
    const json = JSON.stringify({
      ...data,
      version: '1.0',
      savedAt: new Date().toISOString(),
    })
    localStorage.setItem('sign-builder-project', json)
    alert('Project saved!')
  }

  const loadProject = () => {
    const saved = localStorage.getItem('sign-builder-project')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        // Would need to implement applyTemplate for full restore
        alert('Project loaded! (Basic restore)')
      } catch {
        alert('Failed to load project')
      }
    } else {
      alert('No saved project found')
    }
  }

  const downloadCanvas = async (format: 'png' | 'jpg' | 'pdf') => {
    // Create a temporary canvas for export
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpi = 300
    const scale = dpi / 96 // 96 is standard screen DPI
    canvas.width = canvasWidth * dpi / 2.54 * 2.54 // Convert inches to pixels at 300 DPI
    canvas.height = canvasHeight * dpi / 2.54 * 2.54

    // White background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw objects (simplified - in production would need full rendering)
    for (const obj of objects) {
      ctx.save()
      const pixelX = (obj.x / canvasWidth) * canvas.width
      const pixelY = (obj.y / canvasHeight) * canvas.height
      const pixelW = (obj.width / canvasWidth) * canvas.width
      const pixelH = (obj.height / canvasHeight) * canvas.height

      ctx.translate(pixelX, pixelY)
      ctx.rotate((obj.rotation * Math.PI) / 180)
      ctx.globalAlpha = obj.opacity

      if (obj.type === 'shape') {
        ctx.fillStyle = obj.fill || '#3b82f6'
        if (obj.shapeType === 'rectangle') {
          ctx.fillRect(-pixelW / 2, -pixelH / 2, pixelW, pixelH)
        } else if (obj.shapeType === 'circle') {
          ctx.beginPath()
          ctx.ellipse(0, 0, pixelW / 2, pixelH / 2, 0, 0, Math.PI * 2)
          ctx.fill()
        }
        if (obj.strokeWidth && obj.stroke) {
          ctx.strokeStyle = obj.stroke
          ctx.lineWidth = obj.strokeWidth * scale
          if (obj.shapeType === 'rectangle') {
            ctx.strokeRect(-pixelW / 2, -pixelH / 2, pixelW, pixelH)
          } else if (obj.shapeType === 'circle') {
            ctx.beginPath()
            ctx.ellipse(0, 0, pixelW / 2, pixelH / 2, 0, 0, Math.PI * 2)
            ctx.stroke()
          }
        }
      } else if (obj.type === 'text') {
        ctx.font = `${obj.fontWeight || 'normal'} ${obj.fontStyle || 'normal'} ${(obj.fontSize || 32) * scale}px ${obj.fontFamily || 'sans-serif'}`
        ctx.fillStyle = obj.textColor || '#000000'
        ctx.textAlign = obj.textAlign || 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(obj.text || '', 0, 0)
      }

      ctx.restore()
    }

    // Download
    const link = document.createElement('a')
    if (format === 'pdf') {
      // For PDF, we'd use jsPDF in a real implementation
      alert('PDF export requires jsPDF library. Downloading as PNG instead.')
      link.download = `sign-design.png`
      link.href = canvas.toDataURL('image/png')
    } else {
      link.download = `sign-design.${format}`
      link.href = canvas.toDataURL(format === 'jpg' ? 'image/jpeg' : 'image/png', format === 'jpg' ? 0.9 : undefined)
    }
    link.click()
  }

  if (isPreviewMode) {
    return (
      <div className="h-14 bg-black text-white flex items-center justify-between px-4">
        <span className="text-sm">Preview Mode</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPreviewMode(false)}
          className="bg-transparent border-white text-white hover:bg-white/10"
        >
          Exit Preview
        </Button>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="h-12 bg-card border-b flex items-center justify-between px-2">
        {/* Left section - History & View */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={undo} disabled={!canUndo}>
                <Undo2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={redo} disabled={!canRedo}>
                <Redo2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6 mx-2" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={() => setZoom(zoom - 0.25)}>
                <ZoomOut className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-20 text-xs bg-transparent">
                {Math.round(zoom * 100)}%
                <ChevronDown className="size-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {zoomLevels.map(level => (
                <DropdownMenuItem key={level} onClick={() => setZoom(level)}>
                  {Math.round(level * 100)}%
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={() => setZoom(zoom + 0.25)}>
                <ZoomIn className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={() => setZoom(1)}>
                <Maximize className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset Zoom (100%)</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6 mx-2" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={showGrid ? 'default' : 'ghost'} 
                size="icon-sm" 
                onClick={toggleGrid}
              >
                <Grid3X3 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Grid</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={showRulers ? 'default' : 'ghost'} 
                size="icon-sm" 
                onClick={toggleRulers}
              >
                <Ruler className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Rulers</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={() => setIsPreviewMode(true)}>
                <Eye className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Preview Mode</TooltipContent>
          </Tooltip>
        </div>

        {/* Center section - Price Display */}
        <div className="flex items-center gap-4 flex-1 justify-center">
          <div className="flex items-center gap-3">
            <div className="text-left">
              <p className="text-xs text-gray-500 font-medium">Total Price</p>
              <p className="text-sm font-bold text-blue-600">${designPrice.toFixed(2)}</p>
            </div>
            <div className="h-8 w-px bg-gray-300" />
            <div className="text-xs text-gray-600">
              <p className="font-medium">{sides === 2 ? '2 Sides' : '1 Side'} • Qty: {quantity}</p>
            </div>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={saveProject}>
                <Save className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save Project</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={loadProject}>
                <FolderOpen className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Load Project</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6 mx-2" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="size-4 mr-2" />
                Download
                <ChevronDown className="size-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => downloadCanvas('png')}>
                <FileImage className="size-4 mr-2" />
                Download PNG (High Quality)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadCanvas('jpg')}>
                <FileType className="size-4 mr-2" />
                Download JPG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadCanvas('pdf')}>
                <FileText className="size-4 mr-2" />
                Download PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={clearCanvas}>
                <Trash2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear Canvas</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6 mx-2" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAddToCart}
                disabled={isAddingToCart || objects.length === 0}
              >
                {isAddingToCart ? (
                  <>
                    <Loader className="size-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="size-4 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add to Shopping Cart</TooltipContent>
          </Tooltip>

          <Button 
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
            onClick={handleBuyNow}
            disabled={isCheckingOut || objects.length === 0}
          >
            {isCheckingOut ? (
              <>
                <Loader className="size-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="size-4 mr-2" />
                Buy Now
              </>
            )}
          </Button>
          {cartStatus === 'success' && <p className="text-[13px] text-green-700">Added to cart!</p>}
          {cartStatus === 'error' && <p className="text-[13px] text-red-700">{cartError}</p>}
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={isPreviewMode} onOpenChange={setIsPreviewMode}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Design Preview</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon-sm">
                <X className="size-4" />
              </Button>
            </DialogClose>
          </DialogHeader>

          <div className="space-y-4">
            {/* Preview Canvas */}
            <div className="flex justify-center bg-gray-100 rounded-lg p-8">
              <div
                className="relative bg-white shadow-xl rounded"
                style={{
                  width: `${canvasWidth * 10}px`,
                  maxWidth: '100%',
                  aspectRatio: `${canvasWidth} / ${canvasHeight}`,
                  backgroundImage: `linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)`,
                  backgroundSize: `40px 40px`,
                }}
              >
                {objects.map(obj => (
                  <div
                    key={obj.id}
                    className="absolute"
                    style={{
                      left: `${(obj.x / canvasWidth) * 100}%`,
                      top: `${(obj.y / canvasHeight) * 100}%`,
                      width: `${(obj.width / canvasWidth) * 100}%`,
                      height: `${(obj.height / canvasHeight) * 100}%`,
                      opacity: obj.opacity,
                      transform: `rotate(${obj.rotation}deg)`,
                    }}
                  >
                    {obj.type === 'text' && (
                      <div
                        style={{
                          fontFamily: obj.fontFamily,
                          fontSize: `${Math.max(8, (obj.fontSize || 16) * 0.4)}px`,
                          fontWeight: obj.fontWeight,
                          color: obj.textColor,
                          backgroundColor: obj.backgroundColor,
                          textAlign: obj.textAlign as any,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '4px',
                          wordWrap: 'break-word',
                          overflow: 'hidden',
                        }}
                      >
                        {obj.text}
                      </div>
                    )}
                    {obj.type === 'image' && obj.src && (
                      <img
                        src={obj.src || "/placeholder.svg"}
                        alt="Design element"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    )}
                    {obj.type === 'icon' && obj.src && (
                      <img
                        src={obj.src || "/placeholder.svg"}
                        alt="Icon"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    )}
                    {obj.type === 'shape' && (
                      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                        {obj.shapeType === 'rectangle' && (
                          <rect
                            x="0"
                            y="0"
                            width="100"
                            height="100"
                            fill={obj.fill}
                            stroke={obj.stroke}
                            strokeWidth={obj.strokeWidth}
                          />
                        )}
                        {obj.shapeType === 'circle' && (
                          <circle
                            cx="50"
                            cy="50"
                            r="50"
                            fill={obj.fill}
                            stroke={obj.stroke}
                            strokeWidth={obj.strokeWidth}
                          />
                        )}
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Info */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg text-sm">
              <div>
                <p className="text-gray-600">Total Elements</p>
                <p className="font-bold">{objects.length} items</p>
              </div>
              <div>
                <p className="text-gray-600">Quantity</p>
                <p className="font-bold">{quantity} units</p>
              </div>
              <div>
                <p className="text-gray-600">Total Price</p>
                <p className="font-bold text-blue-600">${designPrice.toFixed(2)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsPreviewMode(false)}>
                Back to Edit
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  alert(`Purchase ${quantity} sign(s) for $${designPrice.toFixed(2)}. Redirecting to checkout...`)
                  setIsPreviewMode(false)
                }}
              >
                <Check className="size-4 mr-2" />
                Buy Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
