"use client"

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useSignBuilder } from '@/lib/sign-builder-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { GOOGLE_FONTS } from '@/lib/sign-builder-types'
import { SIGN_TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/sign-templates'
import { useShopifyData } from '@/hooks/useShopifyData'
import {
  Type,
  Upload,
  Shapes,
  LayoutGrid,
  QrCode,
  Table2,
  Layers,
  Palette,
  Grid3X3,
  Sparkles,
  Square,
  Circle,
  Triangle,
  Minus,
  ArrowRight,
  Star,
  Hexagon,
  Search,
  Package,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  AlertTriangle,
  Ban,
  Octagon,
  RectangleHorizontal,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  CornerDownRight,
  MoveRight,
  X,
  ChevronLeft,
  Ruler,
  ShoppingCart,
  Check,
  Plus // Import Plus icon
} from 'lucide-react'

const SIDEBAR_ITEMS = [
  { id: 'product', icon: Package, label: 'Product' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'uploads', icon: Upload, label: 'Uploads' },
  { id: 'graphics', icon: Shapes, label: 'Graphics' },
  { id: 'templates', icon: LayoutGrid, label: 'Templates' },
  { id: 'qrcodes', icon: QrCode, label: 'QR Codes' },
  { id: 'tables', icon: Table2, label: 'Tables' },
  { id: 'layers', icon: Layers, label: 'Layers' },
  { id: 'background', icon: Palette, label: 'Background' },
  { id: 'borders', icon: Grid3X3, label: 'Borders' },
  { id: 'effects', icon: Sparkles, label: 'Effects' },
]

const SHAPE_ITEMS = [
  { type: 'rectangle', icon: Square, label: 'Rectangle' },
  { type: 'rounded-rectangle', icon: RectangleHorizontal, label: 'Rounded Rect' },
  { type: 'circle', icon: Circle, label: 'Circle' },
  { type: 'triangle', icon: Triangle, label: 'Triangle' },
  { type: 'line', icon: Minus, label: 'Line' },
  { type: 'arrow', icon: ArrowRight, label: 'Arrow Right' },
  { type: 'star', icon: Star, label: 'Star' },
  { type: 'polygon', icon: Hexagon, label: 'Polygon' },
  { type: 'prohibition', icon: Ban, label: 'Prohibition' },
  { type: 'warning-triangle', icon: AlertTriangle, label: 'Warning' },
]

const ARROW_SHAPES = [
  { type: 'arrow', rotation: 0, label: 'Right', icon: ArrowRight },
  { type: 'arrow', rotation: 180, label: 'Left', icon: ArrowLeft },
  { type: 'arrow', rotation: 90, label: 'Down', icon: ArrowDown },
  { type: 'arrow', rotation: -90, label: 'Up', icon: ArrowUp },
]

const COLORS = [
  '#000000', '#ffffff', '#dc2626', '#ea580c', '#facc15', '#22c55e',
  '#06b6d4', '#2563eb', '#7c3aed', '#db2777', '#6b7280', '#1e3a8a',
  '#991b1b', '#9a3412', '#854d0e', '#166534', '#0e7490', '#1e40af',
  '#5b21b6', '#9d174d', '#374151', '#111827', '#f59e0b', '#10b981',
]

// Icon categories for quick access
const ICON_CATEGORIES = [
  { name: 'Safety', icons: ['mdi:hard-hat', 'mdi:safety-goggles', 'mdi:fire-extinguisher', 'mdi:exit-run', 'mdi:shield-alert', 'mdi:alert-circle', 'mdi:biohazard', 'mdi:radioactive'] },
  { name: 'Prohibition', icons: ['mdi:cancel', 'mdi:smoking-off', 'mdi:phone-off', 'mdi:camera-off', 'mdi:food-off', 'mdi:dog-side-off', 'mdi:water-off', 'mdi:volume-off'] },
  { name: 'People', icons: ['mdi:account', 'mdi:account-group', 'mdi:walk', 'mdi:run', 'mdi:wheelchair', 'mdi:baby-carriage', 'mdi:human-child', 'mdi:account-hard-hat'] },
  { name: 'Arrows', icons: ['mdi:arrow-right', 'mdi:arrow-left', 'mdi:arrow-up', 'mdi:arrow-down', 'mdi:arrow-all', 'mdi:arrow-u-left-top', 'mdi:arrow-u-right-top', 'mdi:subdirectory-arrow-right'] },
  { name: 'Vehicles', icons: ['mdi:car', 'mdi:truck', 'mdi:forklift', 'mdi:bus', 'mdi:motorcycle', 'mdi:bicycle', 'mdi:parking', 'mdi:gas-station'] },
  { name: 'Tools', icons: ['mdi:wrench', 'mdi:hammer', 'mdi:screwdriver', 'mdi:tools', 'mdi:power-plug', 'mdi:flash', 'mdi:cog', 'mdi:factory'] },
  { name: 'Nature', icons: ['mdi:tree', 'mdi:flower', 'mdi:water', 'mdi:weather-sunny', 'mdi:fire', 'mdi:snowflake', 'mdi:leaf', 'mdi:dog'] },
  { name: 'General', icons: ['mdi:home', 'mdi:office-building', 'mdi:door', 'mdi:key', 'mdi:lock', 'mdi:email', 'mdi:phone', 'mdi:clock'] },
]

export function LeftSidebar() {
  const { 
    activePanel, 
    setActivePanel, 
    addObject, 
    objects, 
    selectObject, 
    selectedObjectId, 
    updateObject, 
    moveObjectLayer, 
    deleteObject,
    duplicateObject,
    applyTemplate, 
    canvasWidth, 
    canvasHeight,
    setCanvasSize,
    quantity,
    setQuantity,
    sides,
    setSides,
    material,
    setMaterial
  } = useSignBuilder()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [iconSearchQuery, setIconSearchQuery] = useState('')
  const [loadedIcons, setLoadedIcons] = useState<string[]>([])
  const [iconLoading, setIconLoading] = useState(false)
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState('All')
  const [qrInput, setQrInput] = useState('')
  const [qrSize, setQrSize] = useState(200)
  const [tableRows, setTableRows] = useState(3)
  const [tableCols, setTableCols] = useState(3)
  const [polygonSides, setPolygonSides] = useState(6)
  const [selectedIconCategory, setSelectedIconCategory] = useState('Safety')
  const [iconColor, setIconColor] = useState('#000000')
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [shopifyMaterials, setShopifyMaterials] = useState<string[]>([])
  const [shopifySizes, setShopifySizes] = useState<any[]>([])
  const [shopifyDescription, setShopifyDescription] = useState('')
  const [shopifyPricePerSqft, setShopifyPricePerSqft] = useState<number>(0)
  const [selectedMaterial, setSelectedMaterial] = useState('')
  const { sizes, materials, pricePerSqft } = useShopifyData()

  const parseSizePreset = (value: unknown): { width: number; height: number; label: string } | null => {
    if (value && typeof value === 'object') {
      const item = value as any
      const w = Number(item.width)
      const h = Number(item.height)
      if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) {
        return { width: w, height: h, label: `${w}" x ${h}"` }
      }
    }
    const raw = String(value || '')
    const clean = raw
      .replace(/["'`]/g, '')
      .replace(/\s*(inches|inch|in\.)\s*/gi, ' ')
      .replace(/[×]/g, 'x')
      .replace(/\s+/g, ' ')
      .trim()
    const match = clean.match(/([\d.]+)\s*[xX*]\s*([\d.]+)/)
    if (!match) return null
    const width = Number(match[1])
    const height = Number(match[2])
    if (!Number.isFinite(width) || !Number.isFinite(height)) return null
    return { width, height, label: raw || `${width}" x ${height}"` }
  }

  const selectedObject = objects.find(obj => obj.id === selectedObjectId)

  // Sync Shopify product data from postMessage
  useEffect(() => {
    setShopifyMaterials(materials)
    setShopifySizes(sizes)
    setShopifyPricePerSqft(pricePerSqft || 0)
    if (materials.length > 0 && !selectedMaterial) {
      setSelectedMaterial(materials[0])
      setMaterial(materials[0] as any)
    }
  }, [materials, sizes, pricePerSqft, selectedMaterial, setMaterial])

  useEffect(() => {
    const product = (window as any).SHOPIFY_PRODUCT
    const description = product?.metafields?.description
    if (typeof description === 'string') setShopifyDescription(description)
  }, [])

  // Debounced icon search
  useEffect(() => {
    if (!iconSearchQuery.trim()) {
      setLoadedIcons([])
      return
    }

    setIconLoading(true)
    const timer = setTimeout(() => {
      // Search across multiple icon libraries
      const query = iconSearchQuery.toLowerCase()
      const icons = [
        // Material Design Icons
        `mdi:${query}`, `mdi:${query}-outline`, `mdi:${query}-variant`,
        // Font Awesome
        `fa6-solid:${query}`, `fa6-regular:${query}`,
        // Phosphor
        `ph:${query}`, `ph:${query}-bold`, `ph:${query}-fill`,
        // Tabler
        `tabler:${query}`, `tabler:${query}-filled`,
        // Lucide
        `lucide:${query}`,
        // Carbon
        `carbon:${query}`,
        // Fluent
        `fluent:${query}-24-regular`, `fluent:${query}-24-filled`,
        // Heroicons
        `heroicons:${query}`, `heroicons-solid:${query}`,
        // Bootstrap Icons
        `bi:${query}`, `bi:${query}-fill`,
        // Ionicons
        `ion:${query}`, `ion:${query}-outline`, `ion:${query}-sharp`,
      ]
      setLoadedIcons(icons)
      setIconLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [iconSearchQuery])

  const addText = (preset?: { text: string, fontSize: number, fontFamily: string, fontWeight?: string, textColor?: string }) => {
    addObject({
      type: 'text',
      text: preset?.text || 'Your Text',
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      width: 12,
      height: 3,
      rotation: 0,
      opacity: 1,
      locked: false,
      fontFamily: preset?.fontFamily || 'Arial',
      fontSize: preset?.fontSize || 32,
      fontWeight: preset?.fontWeight || 'bold',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'center',
      verticalAlign: 'middle',
      textColor: preset?.textColor || '#000000',
      backgroundColor: 'transparent',
      letterSpacing: 0,
      lineHeight: 1.2,
    })
  }

  const addShape = (shapeType: string, rotation = 0) => {
    const baseProps = {
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      rotation,
      opacity: 1,
      locked: false,
    }

    if (shapeType === 'line') {
      addObject({
        ...baseProps,
        type: 'shape',
        shapeType: 'line',
        width: 8,
        height: 0.5,
        fill: '#000000',
        stroke: '#000000',
        strokeWidth: 3,
      })
    } else if (shapeType === 'arrow') {
      addObject({
        ...baseProps,
        type: 'shape',
        shapeType: 'arrow',
        width: 8,
        height: 2,
        fill: '#000000',
        stroke: '#000000',
        strokeWidth: 3,
      })
    } else if (shapeType === 'prohibition') {
      addObject({
        ...baseProps,
        type: 'shape',
        shapeType: 'prohibition',
        width: 6,
        height: 6,
        fill: 'transparent',
        stroke: '#dc2626',
        strokeWidth: 4,
      })
    } else if (shapeType === 'warning-triangle') {
      addObject({
        ...baseProps,
        type: 'shape',
        shapeType: 'warning-triangle',
        width: 6,
        height: 6,
        fill: '#facc15',
        stroke: '#000000',
        strokeWidth: 2,
      })
    } else if (shapeType === 'rounded-rectangle') {
      addObject({
        ...baseProps,
        type: 'shape',
        shapeType: 'rounded-rectangle',
        width: 8,
        height: 6,
        fill: '#2563eb',
        stroke: '#000000',
        strokeWidth: 0,
        cornerRadius: 12,
      })
    } else if (shapeType === 'polygon') {
      addObject({
        ...baseProps,
        type: 'shape',
        shapeType: 'polygon',
        width: 6,
        height: 6,
        fill: '#dc2626',
        stroke: '#000000',
        strokeWidth: 0,
        sides: polygonSides,
      })
    } else {
      addObject({
        ...baseProps,
        type: 'shape',
        shapeType: shapeType as 'rectangle' | 'circle' | 'triangle' | 'star',
        width: 6,
        height: 6,
        fill: shapeType === 'rectangle' ? '#facc15' : shapeType === 'circle' ? '#dc2626' : '#2563eb',
        stroke: '#000000',
        strokeWidth: shapeType === 'rectangle' ? 2 : 0,
      })
    }
  }

  const addIconToCanvas = (iconName: string) => {
    const svgUrl = `https://api.iconify.design/${iconName}.svg?color=${encodeURIComponent(iconColor)}`
    addObject({
      type: 'icon',
      src: svgUrl,
      iconName,
      textColor: iconColor,
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      width: 4,
      height: 4,
      rotation: 0,
      opacity: 1,
      locked: false,
      flipH: false,
      flipV: false,
    })
  }

  const addQRCode = () => {
    if (!qrInput.trim()) return
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(qrInput)}`
    addObject({
      type: 'qrcode',
      src: qrUrl,
      qrData: qrInput,
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      width: 5,
      height: 5,
      rotation: 0,
      opacity: 1,
      locked: false,
    })
    setQrInput('')
  }

  const addTable = () => {
    const cellData: string[][] = Array(tableRows).fill(null).map(() => 
      Array(tableCols).fill('Cell')
    )
    addObject({
      type: 'table',
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      width: tableCols * 3,
      height: tableRows * 1.5,
      rotation: 0,
      opacity: 1,
      locked: false,
      rows: tableRows,
      cols: tableCols,
      cellData,
      cellPadding: 4,
      borderColor: '#000000',
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 1,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const src = event.target?.result as string
      addObject({
        type: 'image',
        src,
        x: canvasWidth / 2,
        y: canvasHeight / 2,
        width: 8,
        height: 8,
        rotation: 0,
        opacity: 1,
        locked: false,
        flipH: false,
        flipV: false,
      })
    }
    reader.readAsDataURL(file)
  }

  const filteredTemplates = SIGN_TEMPLATES.filter(t => 
    (selectedTemplateCategory === 'All' || t.category === selectedTemplateCategory) &&
    (searchQuery === '' || t.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const sortedObjects = [...objects].sort((a, b) => b.zIndex - a.zIndex)

  return (
    <div className="flex h-full">
      {/* Icon sidebar */}
      <div className="w-16 bg-white border-r flex flex-col items-center py-2 gap-0.5 overflow-y-auto">
        {SIDEBAR_ITEMS.map(item => (
          <button
            type="button"
            key={item.id}
            onClick={() => { setActivePanel(item.id); setIsPanelOpen(true) }}
            className={cn(
              "w-14 h-14 flex flex-col items-center justify-center rounded-lg text-xs gap-0.5 transition-colors",
              activePanel === item.id && isPanelOpen
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            )}
          >
            <item.icon className="size-5" />
            <span className="text-[9px] leading-tight font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Panel content */}
      {isPanelOpen && (
      <div className="w-72 bg-white border-r flex flex-col">
        {/* Panel Header with Close */}
        <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50">
          <h3 className="font-bold text-xs capitalize">{activePanel}</h3>
          <Button variant="ghost" size="icon-sm" onClick={() => setIsPanelOpen(false)}>
            <X className="size-3.5" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-3">
            {/* Product Panel */}
            {activePanel === 'product' && (
              <div className="space-y-3">
                {/* Description */}
                {shopifyDescription && (
                  <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs font-semibold text-blue-900 mb-1">Product Description</p>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      {shopifyDescription}
                    </p>
                  </div>
                )}

                {/* Price Per Sqft */}
                {shopifyPricePerSqft > 0 && (
                  <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-green-800">Price per sq. ft.: <span className="font-bold text-green-900">${shopifyPricePerSqft.toFixed(2)}</span></p>
                  </div>
                )}

                {/* Current Size Display */}
                <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-blue-800 font-bold">Current Size</p>
                    <Ruler className="size-3.5 text-blue-600" />
                  </div>
                  <p className="text-sm font-bold text-blue-900">
                    {canvasWidth}" × {canvasHeight}"
                  </p>
                  {shopifyPricePerSqft > 0 && (
                    <p className="text-xs text-blue-700 mt-1">
                      Area: {(canvasWidth * canvasHeight).toFixed(1)} sq. in. = {((canvasWidth * canvasHeight) / 144).toFixed(2)} sq. ft.
                    </p>
                  )}
                </div>

                {/* Custom Size Input */}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-gray-700">Custom Size</p>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="W"
                        value={canvasWidth}
                        onChange={(e) => setCanvasSize(parseFloat(e.target.value) || canvasWidth, canvasHeight)}
                        className="text-xs h-7"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="H"
                        value={canvasHeight}
                        onChange={(e) => setCanvasSize(canvasWidth, parseFloat(e.target.value) || canvasHeight)}
                        className="text-xs h-7"
                      />
                    </div>
                    <div className="text-xs font-semibold text-gray-500 pt-1">in</div>
                  </div>
                </div>

                {/* Quick Sizes */}
                {shopifySizes.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-gray-700">Quick Sizes</p>
                    <div className="flex flex-wrap gap-1">
                      {shopifySizes.map((size: any, idx: number) => {
                        const parsed = parseSizePreset(size)
                        if (!parsed) return null
                        const width = parsed.width
                        const height = parsed.height
                        const label = parsed.label

                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setCanvasSize(width, height)}
                            className={cn(
                              "px-2 py-1 rounded text-xs font-medium transition-all",
                              canvasWidth === width && canvasHeight === height
                                ? "border-2 border-blue-600 bg-blue-50 text-blue-700"
                                : "border border-gray-300 hover:border-gray-400 bg-white"
                            )}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Width and Height Adjustment Buttons */}
                <div className="space-y-2 border-t pt-2">
                  <p className="text-xs font-semibold text-gray-700">Adjust Size</p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCanvasSize(canvasWidth + 6, canvasHeight)}
                      className="flex-1 h-7 text-xs"
                    >
                      Width +
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCanvasSize(Math.max(6, canvasWidth - 6), canvasHeight)}
                      className="flex-1 h-7 text-xs"
                    >
                      Width -
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCanvasSize(canvasWidth, canvasHeight + 6)}
                      className="flex-1 h-7 text-xs"
                    >
                      Height +
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCanvasSize(canvasWidth, Math.max(6, canvasHeight - 6))}
                      className="flex-1 h-7 text-xs"
                    >
                      Height -
                    </Button>
                  </div>
                </div>

                {/* Quantity Control */}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-gray-700">Quantity</p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-7 w-7 p-0"
                    >
                      <Minus className="size-3" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="text-xs h-7 text-center flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-7 w-7 p-0"
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>
                </div>

                {/* Sides Control */}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-gray-700">Design Sides</p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={sides === 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSides(1)}
                      className="flex-1 h-7 text-xs"
                    >
                      1 Side
                    </Button>
                    <Button
                      type="button"
                      variant={sides === 2 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSides(2)}
                      className="flex-1 h-7 text-xs"
                    >
                      2 Sides
                    </Button>
                  </div>
                </div>

                {/* Materials Selection */}

                {/* HERE METAFIELDS ARE - Always Display Section */}
                <div className="pt-3 border-t mt-3 space-y-2 bg-blue-50 p-3 rounded">
                  <p className="text-xs font-bold text-gray-900">Here Metafields Are</p>
                  
                  {shopifyDescription && (
                    <div className="text-xs">
                      <p className="text-gray-600 font-semibold">Description:</p>
                      <p className="text-gray-600">{shopifyDescription}</p>
                    </div>
                  )}
                  
                  {shopifyPricePerSqft > 0 && (
                    <div className="text-xs">
                      <p className="text-gray-700"><span className="font-semibold">Price per Sq Ft:</span> ${shopifyPricePerSqft.toFixed(2)}</p>
                    </div>
                  )}
                  
                  {shopifySizes.length > 0 && (
                    <div className="text-xs">
                      <p className="font-semibold text-gray-700 mb-1">Sizes:</p>
                      <p className="text-gray-600">
                        {shopifySizes.map((size: any, idx: number) => {
                          const label = typeof size === 'object' ? `${size.width}"×${size.height}"` : size
                          return <span key={idx}>{label}{idx < shopifySizes.length - 1 ? ', ' : ''}</span>
                        })}
                      </p>
                    </div>
                  )}
                  
                  {shopifyMaterials.length > 0 && (
                    <div className="text-xs">
                      <p className="font-semibold text-gray-700 mb-1">Materials:</p>
                      <p className="text-gray-600">
                        {shopifyMaterials.join(', ')}
                      </p>
                    </div>
                  )}
                  
                  {!shopifyDescription && shopifyPricePerSqft === 0 && shopifySizes.length === 0 && shopifyMaterials.length === 0 && (
                    <p className="text-xs text-gray-500 italic">No metafields data received from Shopify yet...</p>
                  )}
                </div>

                {/* Material Dropdown */}
                {shopifyMaterials.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Material</label>
                    <select
                      value={selectedMaterial || material}
                      onChange={(e) => {
                        setSelectedMaterial(e.target.value)
                        setMaterial(e.target.value as any)
                      }}
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:border-blue-500"
                    >
                      {shopifyMaterials.map((material: string) => (
                        <option key={material} value={material}>
                          {material}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Text Panel */}
            {activePanel === 'text' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm">Add Text</h3>
                <Button onClick={() => addText()} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Type className="size-4 mr-2" />
                  Add Text
                </Button>
                
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-700">Sign Headers</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { text: 'CAUTION', color: '#000000', bg: '#facc15' },
                      { text: 'WARNING', color: '#ffffff', bg: '#dc2626' },
                      { text: 'DANGER', color: '#ffffff', bg: '#dc2626' },
                      { text: 'NOTICE', color: '#ffffff', bg: '#2563eb' },
                      { text: 'ATTENTION', color: '#ffffff', bg: '#dc2626' },
                      { text: 'EMERGENCY', color: '#ffffff', bg: '#dc2626' },
                    ].map(header => (
                      <button
                        type="button"
                        key={header.text}
                        onClick={() => addText({ text: header.text, fontSize: 36, fontFamily: 'Arial Black', fontWeight: 'bold', textColor: header.color })}
                        className="px-2 py-2 text-xs font-bold rounded transition-colors"
                        style={{ backgroundColor: header.bg, color: header.color }}
                      >
                        {header.text}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-700">Text Styles</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addText({ text: 'HEADING', fontSize: 48, fontFamily: 'Arial Black', fontWeight: 'bold' })}
                      className="text-xs"
                    >
                      Heading
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addText({ text: 'Subheading', fontSize: 28, fontFamily: 'Arial', fontWeight: '600' })}
                      className="text-xs"
                    >
                      Subheading
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addText({ text: 'Body text', fontSize: 18, fontFamily: 'Arial', fontWeight: 'normal' })}
                      className="text-xs"
                    >
                      Body
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addText({ text: 'Small text', fontSize: 14, fontFamily: 'Arial', fontWeight: 'normal' })}
                      className="text-xs"
                    >
                      Small
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-700">Fonts</p>
                  <ScrollArea className="h-40">
                    <div className="space-y-1">
                      {GOOGLE_FONTS.slice(0, 20).map(font => (
                        <button
                          type="button"
                          key={font}
                          className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 text-sm"
                          style={{ fontFamily: font }}
                          onClick={() => addText({ text: font, fontSize: 28, fontFamily: font, fontWeight: 'normal' })}
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )}

            {/* Uploads Panel */}
            {activePanel === 'uploads' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm">Upload Images</h3>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="size-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 font-medium">Click to upload</span>
                  <span className="text-xs text-gray-400">PNG, JPG, SVG, GIF</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
                <p className="text-xs text-gray-500">
                  Upload logos, photos, or custom graphics to add to your sign.
                </p>
              </div>
            )}

            {/* Graphics Panel */}
            {activePanel === 'graphics' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm">Graphics</h3>
                <Tabs defaultValue="shapes">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="shapes">Shapes</TabsTrigger>
                    <TabsTrigger value="icons">Icons</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="shapes" className="space-y-4 mt-3">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700">Basic Shapes</p>
                      <div className="grid grid-cols-5 gap-1.5">
                        {SHAPE_ITEMS.map(shape => (
                          <button
                            type="button"
                            key={shape.type}
                            onClick={() => addShape(shape.type)}
                            className="flex flex-col items-center justify-center p-2 rounded-lg border hover:bg-gray-50 transition-colors"
                            title={shape.label}
                          >
                            <shape.icon className="size-5" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700">Arrows</p>
                      <div className="grid grid-cols-4 gap-1.5">
                        {ARROW_SHAPES.map((arrow, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={() => addShape(arrow.type, arrow.rotation)}
                            className="flex flex-col items-center justify-center p-2 rounded-lg border hover:bg-gray-50 transition-colors"
                            title={arrow.label}
                          >
                            <arrow.icon className="size-5" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-700">Polygon Sides: {polygonSides}</label>
                      <Slider
                        value={[polygonSides]}
                        onValueChange={([v]) => setPolygonSides(v)}
                        min={3}
                        max={12}
                        step={1}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="icons" className="space-y-4 mt-3">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 size-4 text-gray-400" />
                      <Input
                        placeholder="Search 200,000+ icons..."
                        value={iconSearchQuery}
                        onChange={(e) => setIconSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    {/* Icon Color Selector */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700">Icon Color</p>
                      <div className="flex items-center gap-2">
                        <div className="grid grid-cols-8 gap-1 flex-1">
                          {['#000000', '#dc2626', '#ea580c', '#facc15', '#22c55e', '#2563eb', '#7c3aed', '#ffffff'].map(color => (
                            <button
                              type="button"
                              key={color}
                              onClick={() => setIconColor(color)}
                              className={cn(
                                "aspect-square rounded border-2 transition-all",
                                iconColor === color ? "border-blue-600 scale-110" : "border-gray-300 hover:border-gray-400"
                              )}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <input
                          type="color"
                          value={iconColor}
                          onChange={(e) => setIconColor(e.target.value)}
                          className="w-8 h-8 rounded border cursor-pointer"
                        />
                      </div>
                    </div>

                    {iconSearchQuery ? (
                      <div className="space-y-2">
                        {iconLoading ? (
                          <p className="text-xs text-gray-500 text-center py-4">Searching...</p>
                        ) : (
                          <div className="grid grid-cols-5 gap-1.5">
                            {loadedIcons.map((icon, i) => (
                              <button
                                type="button"
                                key={`${icon}-${i}`}
                                onClick={() => addIconToCanvas(icon)}
                                className="p-2 rounded border hover:bg-gray-50 transition-colors"
                                title={icon}
                              >
                                <img
                                  src={`https://api.iconify.design/${icon}.svg?color=${encodeURIComponent(iconColor)}`}
                                  alt={icon}
                                  className="size-6 mx-auto"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none'
                                  }}
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {ICON_CATEGORIES.map(cat => (
                            <button
                              type="button"
                              key={cat.name}
                              onClick={() => setSelectedIconCategory(cat.name)}
                              className={cn(
                                "px-2 py-1 text-xs rounded-full transition-colors",
                                selectedIconCategory === cat.name
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              )}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {ICON_CATEGORIES.find(c => c.name === selectedIconCategory)?.icons.map((icon, i) => (
                            <button
                              type="button"
                              key={`${icon}-${i}`}
                              onClick={() => addIconToCanvas(icon)}
                              className="p-2 rounded border hover:bg-gray-50 transition-colors"
                              title={icon.split(':')[1]}
                            >
                              <img
                                src={`https://api.iconify.design/${icon}.svg?color=${encodeURIComponent(iconColor)}`}
                                alt={icon}
                                className="size-6 mx-auto"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Templates Panel */}
            {activePanel === 'templates' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm">Templates</h3>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-gray-400" />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {TEMPLATE_CATEGORIES.slice(0, 8).map(cat => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setSelectedTemplateCategory(cat)}
                      className={cn(
                        "px-2 py-1 text-xs rounded-full transition-colors",
                        selectedTemplateCategory === cat
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-2 gap-2">
                    {filteredTemplates.map(template => (
                      <button
                        type="button"
                        key={template.id}
                        onClick={() => applyTemplate(template.objects, template.canvasWidth, template.canvasHeight)}
                        className="p-2 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <div 
                          className="aspect-[4/3] bg-gray-100 rounded mb-1.5 flex items-center justify-center overflow-hidden"
                          style={{ backgroundColor: template.objects[0]?.fill || '#f3f4f6' }}
                        >
                          <span className="text-[8px] font-bold text-center px-1 truncate" style={{ color: template.objects[1]?.textColor || '#000' }}>
                            {template.name}
                          </span>
                        </div>
                        <p className="text-[10px] font-medium text-gray-700 truncate">{template.name}</p>
                        <p className="text-[9px] text-gray-400">{template.canvasWidth}" x {template.canvasHeight}"</p>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* QR Codes Panel */}
            {activePanel === 'qrcodes' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm">QR Code Generator</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700">URL or Text</label>
                    <Input
                      placeholder="https://example.com"
                      value={qrInput}
                      onChange={(e) => setQrInput(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700">Size: {qrSize}px</label>
                    <Slider
                      value={[qrSize]}
                      onValueChange={([v]) => setQrSize(v)}
                      min={100}
                      max={500}
                      step={50}
                    />
                  </div>
                  {qrInput && (
                    <div className="p-3 bg-white border rounded-lg flex items-center justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(qrInput)}`}
                        alt="QR Preview"
                        className="max-w-full"
                        style={{ width: Math.min(qrSize, 150), height: Math.min(qrSize, 150) }}
                      />
                    </div>
                  )}
                  <Button onClick={addQRCode} disabled={!qrInput.trim()} className="w-full bg-blue-600 hover:bg-blue-700">
                    <QrCode className="size-4 mr-2" />
                    Add QR Code
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-700">Quick Links</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['Website', 'Phone', 'Email', 'WiFi'].map(type => (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const prefixes: Record<string, string> = {
                            'Website': 'https://',
                            'Phone': 'tel:',
                            'Email': 'mailto:',
                            'WiFi': 'WIFI:T:WPA;S:;P:;;',
                          }
                          setQrInput(prefixes[type])
                        }}
                        className="text-xs"
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tables Panel */}
            {activePanel === 'tables' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm">Add Table</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700">Rows: {tableRows}</label>
                    <Slider
                      value={[tableRows]}
                      onValueChange={([v]) => setTableRows(v)}
                      min={1}
                      max={10}
                      step={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700">Columns: {tableCols}</label>
                    <Slider
                      value={[tableCols]}
                      onValueChange={([v]) => setTableCols(v)}
                      min={1}
                      max={10}
                      step={1}
                    />
                  </div>
                  <div className="grid grid-cols-[repeat(var(--cols),1fr)] gap-px bg-gray-300 p-px rounded" style={{ '--cols': tableCols } as React.CSSProperties}>
                    {Array(tableRows * tableCols).fill(0).map((_, i) => (
                      <div key={i} className="aspect-square bg-white min-h-[20px]" />
                    ))}
                  </div>
                  <Button onClick={addTable} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Table2 className="size-4 mr-2" />
                    Add Table
                  </Button>
                </div>
              </div>
            )}

            {/* Layers Panel */}
            {activePanel === 'layers' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm">Layers</h3>
                {objects.length === 0 ? (
                  <p className="text-xs text-gray-500 py-4 text-center">No objects on canvas</p>
                ) : (
                  <div className="space-y-1">
                    {sortedObjects.map((obj, index) => (
                      <div
                        key={obj.id}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors",
                          selectedObjectId === obj.id ? "bg-blue-100" : "hover:bg-gray-50"
                        )}
                        onClick={() => selectObject(obj.id)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">
                            {obj.type === 'text' ? (obj.text?.slice(0, 20) || 'Text') : obj.type}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            Layer {objects.length - index}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); updateObject(obj.id, { locked: !obj.locked }) }}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            {obj.locked ? <Lock className="size-3" /> : <Unlock className="size-3" />}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); updateObject(obj.id, { opacity: obj.opacity > 0 ? 0 : 1 }) }}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            {obj.opacity > 0 ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {selectedObjectId && (
                  <div className="pt-3 border-t space-y-2">
                    <p className="text-xs font-semibold text-gray-700">Layer Order</p>
                    <div className="grid grid-cols-4 gap-1">
                      <Button variant="outline" size="sm" onClick={() => moveObjectLayer(selectedObjectId, 'top')} title="Bring to Front">
                        <ChevronsUp className="size-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => moveObjectLayer(selectedObjectId, 'up')} title="Bring Forward">
                        <ChevronUp className="size-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => moveObjectLayer(selectedObjectId, 'down')} title="Send Backward">
                        <ChevronDown className="size-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => moveObjectLayer(selectedObjectId, 'bottom')} title="Send to Back">
                        <ChevronsDown className="size-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={() => duplicateObject(selectedObjectId)}>
                        <Copy className="size-4 mr-1" /> Duplicate
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteObject(selectedObjectId)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="size-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Background Panel */}
            {activePanel === 'background' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm">Canvas Background</h3>
                <p className="text-xs text-gray-500">
                  Add a background shape to your canvas by going to Graphics and adding a rectangle covering the full canvas.
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-700">Quick Backgrounds</p>
                  <div className="grid grid-cols-6 gap-1.5">
                    {COLORS.map(color => (
                      <button
                        type="button"
                        key={color}
                        onClick={() => {
                          addObject({
                            type: 'shape',
                            shapeType: 'rectangle',
                            x: canvasWidth / 2,
                            y: canvasHeight / 2,
                            width: canvasWidth,
                            height: canvasHeight,
                            rotation: 0,
                            opacity: 1,
                            locked: false,
                            fill: color,
                            stroke: '',
                            strokeWidth: 0,
                            zIndex: -1,
                          })
                        }}
                        className="aspect-square rounded border-2 border-gray-200 hover:border-blue-500 transition-colors"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Borders Panel */}
            {activePanel === 'borders' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm">Add Border</h3>
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-700">Border Styles</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Simple', stroke: '#000000', width: 2 },
                      { name: 'Bold', stroke: '#000000', width: 4 },
                      { name: 'Red', stroke: '#dc2626', width: 3 },
                      { name: 'Blue', stroke: '#2563eb', width: 3 },
                      { name: 'Yellow', stroke: '#facc15', width: 3 },
                      { name: 'Rounded', stroke: '#000000', width: 2 },
                    ].map((border, i) => (
                      <button
                        type="button"
                        key={border.name}
                        onClick={() => {
                          addObject({
                            type: 'shape',
                            shapeType: i === 5 ? 'rounded-rectangle' : 'rectangle',
                            x: canvasWidth / 2,
                            y: canvasHeight / 2,
                            width: canvasWidth - 1,
                            height: canvasHeight - 1,
                            rotation: 0,
                            opacity: 1,
                            locked: false,
                            fill: 'transparent',
                            stroke: border.stroke,
                            strokeWidth: border.width,
                            cornerRadius: i === 5 ? 16 : 0,
                          })
                        }}
                        className="p-3 border-2 rounded-lg hover:bg-gray-50 transition-colors"
                        style={{ borderColor: border.stroke, borderWidth: border.width }}
                      >
                        <span className="text-xs font-medium">{border.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Effects Panel */}
            {activePanel === 'effects' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm">Object Effects</h3>
                {selectedObject ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-700">
                        Opacity: {Math.round((selectedObject.opacity || 1) * 100)}%
                      </label>
                      <Slider
                        value={[(selectedObject.opacity || 1) * 100]}
                        onValueChange={([v]) => updateObject(selectedObject.id, { opacity: v / 100 })}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-700">
                        Rotation: {Math.round(selectedObject.rotation || 0)}°
                      </label>
                      <Slider
                        value={[selectedObject.rotation || 0]}
                        onValueChange={([v]) => updateObject(selectedObject.id, { rotation: v })}
                        min={-180}
                        max={180}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-700">Quick Rotate</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[0, 90, 180, 270].map(angle => (
                          <Button
                            key={angle}
                            variant="outline"
                            size="sm"
                            onClick={() => updateObject(selectedObject.id, { rotation: angle })}
                          >
                            {angle}°
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-700">Shadow</label>
                      <Button
                        variant={selectedObject.shadow ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateObject(selectedObject.id, { shadow: !selectedObject.shadow })}
                        className="w-full"
                      >
                        {selectedObject.shadow ? 'Remove Shadow' : 'Add Shadow'}
                      </Button>
                    </div>
                    {selectedObject.type === 'shape' && selectedObject.shapeType === 'rounded-rectangle' && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700">
                          Corner Radius: {selectedObject.cornerRadius || 0}px
                        </label>
                        <Slider
                          value={[selectedObject.cornerRadius || 0]}
                          onValueChange={([v]) => updateObject(selectedObject.id, { cornerRadius: v })}
                          min={0}
                          max={50}
                          step={1}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-500 py-4 text-center">
                      Select an object to apply effects
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      )}
    </div>
  )
}


