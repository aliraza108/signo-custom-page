"use client"

import { useState, useEffect } from 'react'
import { useSignBuilder } from '@/lib/sign-builder-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GOOGLE_FONTS } from '@/lib/sign-builder-types'
import { cn } from '@/lib/utils'
import { getShopifyProduct, extractProductMetadata, addToShopifyCart, getVariantId } from '@/lib/shopify-utils'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  FlipHorizontal,
  FlipVertical,
  Copy,
  Trash2,
  Lock,
  Unlock,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  X,
  ChevronLeft,
  Palette,
  Loader2,
  Info,
} from 'lucide-react'

const COLORS = [
  '#000000', '#ffffff', '#dc2626', '#ea580c', '#facc15', '#22c55e',
  '#06b6d4', '#2563eb', '#7c3aed', '#db2777', '#6b7280', '#1e3a8a',
]

const HOLE_OPTIONS = [
  { id: 'none', name: 'No Holes', description: 'Clean look' },
  { id: '2-top', name: '2 Top Holes', description: 'Easy hanging' },
  { id: '4-corner', name: '4 Corner Holes', description: 'Secure mounting' },
  { id: 'custom', name: 'Custom', description: 'Specify placement' },
]

const MATERIALS = [
  { id: 'aluminum', name: 'Aluminum', description: 'Durable and lightweight', priceMultiplier: 1.2 },
  { id: 'acrylic', name: 'Acrylic', description: 'Clear and shatter-resistant', priceMultiplier: 1 },
  { id: 'pvc', name: 'PVC', description: 'Affordable and easy to print on', priceMultiplier: 0.8 },
  { id: 'coroplast', name: 'Coroplast', description: 'Flexible and cost-effective', priceMultiplier: 0.9 },
]

export function RightSidebar() {
  const {
    objects,
    selectedObjectId,
    canvasWidth,
    canvasHeight,
    quantity,
    sides,
    holeOption,
    material,
    price,
    setCanvasSize,
    setQuantity,
    setSides,
    setHoleOption,
    setMaterial,
    updateObject,
    deleteObject,
    duplicateObject,
    moveObjectLayer,
    getDesignData,
  } = useSignBuilder()

  const selectedObject = objects.find(obj => obj.id === selectedObjectId)
  const finalPrice = price * (sides === 2 ? 1.5 : 1)
  const [isOpen, setIsOpen] = useState(true)
  const materialData = MATERIALS.find(mat => mat.id === material)
  const [isLoading, setIsLoading] = useState(false)
  const [productData, setProductData] = useState<any>(null)

  // Fetch Shopify product data on mount
  useEffect(() => {
    const product = getShopifyProduct()
    if (product) {
      const metadata = extractProductMetadata(product)
      setProductData(metadata)
    }
  }, [])

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      const variantId = getVariantId()
      if (!variantId) {
        throw new Error('Variant ID not found')
      }

      const designData = getDesignData()
      const attributes = {
        'Design Data': JSON.stringify(designData),
        'Sides': sides.toString(),
        'Material': material,
        'Hole Option': holeOption,
      }

      await addToShopifyCart(variantId, quantity, attributes)
      // Redirect to cart page
      window.location.href = '/cart'
    } catch (error) {
      console.error('[v0] Error adding to cart:', error)
      alert('Failed to add item to cart. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBuyNow = async () => {
    setIsLoading(true)
    try {
      const variantId = getVariantId()
      if (!variantId) {
        throw new Error('Variant ID not found')
      }

      const designData = getDesignData()
      const attributes = {
        'Design Data': JSON.stringify(designData),
        'Sides': sides.toString(),
        'Material': material,
        'Hole Option': holeOption,
      }

      await addToShopifyCart(variantId, quantity, attributes)
      // Redirect to checkout
      window.location.href = '/checkout'
    } catch (error) {
      console.error('[v0] Error with buy now:', error)
      alert('Failed to proceed to checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <div className="w-12 bg-white border-l flex flex-col items-center py-4">
        <Button variant="ghost" size="icon-sm" onClick={() => setIsOpen(true)} title="Open Panel">
          <ChevronLeft className="size-4" />
        </Button>
        <div className="mt-4 -rotate-90 whitespace-nowrap text-xs font-medium text-gray-500">
          Product Options
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-l flex flex-col h-full relative">
      {/* Close button */}
      <Button 
        variant="ghost" 
        size="icon-sm" 
        onClick={() => setIsOpen(false)} 
        className="absolute right-2 top-2 z-10"
        title="Close Panel"
      >
        <X className="size-4" />
      </Button>
      
      {/* Top action buttons with price */}
      <div className="p-4 border-b bg-gradient-to-b from-blue-50 to-white">
        <div className="flex items-center justify-between mb-4 pr-6">
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Price</p>
            <p className="text-3xl font-bold text-blue-600">${finalPrice.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Per unit</p>
            <p className="text-lg font-semibold text-gray-700">${(finalPrice / quantity).toFixed(2)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="w-full h-11 bg-transparent"
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              <ShoppingCart className="size-4 mr-2" />
            )}
            Add to Cart
          </Button>
          <Button 
            className="w-full h-11 bg-green-600 hover:bg-green-700"
            onClick={handleBuyNow}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              <Zap className="size-4 mr-2" />
            )}
            Buy Now
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue={selectedObject ? "element" : "product"}>
            <TabsList className="w-full mb-4 grid grid-cols-2">
              <TabsTrigger value="product">Product</TabsTrigger>
              <TabsTrigger value="element" disabled={!selectedObject}>
                Element
              </TabsTrigger>
            </TabsList>

            {/* Product Options Tab */}
            <TabsContent value="product" className="space-y-6">
              {/* Size Inputs */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm">Sign Size (inches)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 font-medium">Width</label>
                    <div className="flex">
                      <Input
                        type="number"
                        value={canvasWidth}
                        onChange={(e) => setCanvasSize(Number(e.target.value) || 1, canvasHeight)}
                        min={1}
                        max={96}
                        className="rounded-r-none text-center font-medium"
                      />
                      <span className="flex items-center px-3 bg-gray-100 border border-l-0 rounded-r-md text-xs font-medium text-gray-600">in</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 font-medium">Height</label>
                    <div className="flex">
                      <Input
                        type="number"
                        value={canvasHeight}
                        onChange={(e) => setCanvasSize(canvasWidth, Number(e.target.value) || 1)}
                        min={1}
                        max={96}
                        className="rounded-r-none text-center font-medium"
                      />
                      <span className="flex items-center px-3 bg-gray-100 border border-l-0 rounded-r-md text-xs font-medium text-gray-600">in</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { w: 12, h: 12 },
                    { w: 18, h: 12 },
                    { w: 18, h: 24 },
                    { w: 24, h: 18 },
                    { w: 36, h: 24 },
                    { w: 48, h: 36 },
                  ].map(size => (
                    <Button
                      key={`${size.w}x${size.h}`}
                      variant={canvasWidth === size.w && canvasHeight === size.h ? "default" : "outline"}
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => setCanvasSize(size.w, size.h)}
                    >
                      {size.w}" x {size.h}"
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  Area: <span className="font-semibold">{(canvasWidth * canvasHeight).toLocaleString()}</span> sq inches
                </p>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm">Quantity</h4>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="size-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                    min={1}
                    max={1000}
                    className="w-24 text-center font-bold text-lg"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 5, 10, 25, 50, 100].map(qty => (
                    <Button
                      key={qty}
                      variant={quantity === qty ? "default" : "outline"}
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => setQuantity(qty)}
                    >
                      {qty}
                    </Button>
                  ))}
                </div>
                {quantity >= 10 && (
                  <p className="text-xs text-green-600 font-semibold bg-green-50 p-2 rounded">
                    Volume discount: {quantity >= 100 ? '25%' : quantity >= 50 ? '20%' : quantity >= 25 ? '15%' : '10%'} off!
                  </p>
                )}
              </div>

              {/* Sides */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm">Print Sides</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSides(1)}
                    className={cn(
                      "p-3 rounded-lg border-2 text-center transition-all",
                      sides === 1
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <span className="text-sm font-semibold block">1 Side</span>
                    <span className="text-xs text-gray-500">Front only</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSides(2)}
                    className={cn(
                      "p-3 rounded-lg border-2 text-center transition-all",
                      sides === 2
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <span className="text-sm font-semibold block">2 Sides</span>
                    <span className="text-xs text-orange-600 font-medium">+50%</span>
                  </button>
                </div>
              </div>

              {/* Material */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm">Material</h4>
                <div className="space-y-2">
                  {MATERIALS.map(mat => (
                    <button
                      type="button"
                      key={mat.id}
                      onClick={() => setMaterial(mat.id as 'aluminum' | 'acrylic' | 'pvc' | 'coroplast')}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all",
                        material === mat.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="text-left">
                        <p className="text-sm font-semibold">{mat.name}</p>
                        <p className="text-xs text-gray-500">{mat.description}</p>
                      </div>
                      {mat.priceMultiplier !== 1 && (
                        <span className={cn(
                          "text-xs font-bold px-2 py-1 rounded",
                          mat.priceMultiplier > 1 ? "text-orange-700 bg-orange-100" : "text-green-700 bg-green-100"
                        )}>
                          {mat.priceMultiplier > 1 ? '+' : ''}{Math.round((mat.priceMultiplier - 1) * 100)}%
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hole Options */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm">Mounting Holes</h4>
                <div className="grid grid-cols-2 gap-2">
                  {HOLE_OPTIONS.map(opt => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setHoleOption(opt.id as 'none' | '2-top' | '4-corner' | 'custom')}
                      className={cn(
                        "p-2.5 rounded-lg border-2 text-center transition-all",
                        holeOption === opt.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <p className="text-xs font-semibold">{opt.name}</p>
                      <p className="text-[10px] text-gray-500">{opt.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-bold text-sm">Price Breakdown</h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base price</span>
                    <span className="font-medium">${(price / quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Material ({materialData?.name})</span>
                    <span className="font-medium">{materialData?.priceMultiplier === 1 ? '--' : `${materialData?.priceMultiplier! > 1 ? '+' : ''}${Math.round((materialData?.priceMultiplier! - 1) * 100)}%`}</span>
                  </div>
                  {sides === 2 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Double-sided</span>
                      <span className="font-medium text-orange-600">+50%</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity</span>
                    <span className="font-medium">x {quantity}</span>
                  </div>
                  {quantity >= 10 && (
                    <div className="flex justify-between text-green-600">
                      <span className="font-medium">Volume discount</span>
                      <span className="font-bold">-{quantity >= 100 ? 25 : quantity >= 50 ? 20 : quantity >= 25 ? 15 : 10}%</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-xl text-blue-600">${finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Product Details Drawer */}
              {productData && (
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline" className="w-full mb-4">
                      <Info className="size-4 mr-2" />
                      View Product Details
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Product Details</DrawerTitle>
                    </DrawerHeader>
                    <ScrollArea className="h-[60vh]">
                      <div className="space-y-6 p-4">
                        {productData.pricePerSqft > 0 && (
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs text-blue-700 font-medium mb-1">Price per Sq Ft</p>
                            <p className="text-2xl font-bold text-blue-600">@ ${productData.pricePerSqft}/SqFt</p>
                          </div>
                        )}

                        {productData.materials && productData.materials.length > 0 && (
                          <div>
                            <h5 className="text-xs font-bold text-gray-700 mb-3">Available Materials</h5>
                            <div className="space-y-2">
                              {productData.materials.map((mat: any, idx: number) => (
                                <div key={idx} className="p-2.5 bg-gray-50 rounded border border-gray-200">
                                  <p className="text-sm font-medium text-gray-800">
                                    {typeof mat === 'string' ? mat : mat.name || mat}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {productData.sizes && productData.sizes.length > 0 && (
                          <div>
                            <h5 className="text-xs font-bold text-gray-700 mb-3">Recommended Sizes</h5>
                            <div className="flex flex-wrap gap-2">
                              {productData.sizes.map((size: any, idx: number) => (
                                <span key={idx} className="px-3 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg">
                                  {typeof size === 'string' ? size : size.label || size}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {productData.description && (
                          <div>
                            <h5 className="text-xs font-bold text-gray-700 mb-2">Description</h5>
                            <p className="text-sm text-gray-700 leading-relaxed">{productData.description}</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </DrawerContent>
                </Drawer>
              )}
            </TabsContent>

            {/* Element Options Tab */}
            <TabsContent value="element" className="space-y-4">
              {selectedObject && (
                <>
                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => duplicateObject(selectedObject.id)}
                    >
                      <Copy className="size-3.5 mr-1.5" /> Duplicate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateObject(selectedObject.id, { locked: !selectedObject.locked })}
                    >
                      {selectedObject.locked ? <Lock className="size-3.5 mr-1.5" /> : <Unlock className="size-3.5 mr-1.5" />}
                      {selectedObject.locked ? 'Unlock' : 'Lock'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteObject(selectedObject.id)}
                    >
                      <Trash2 className="size-3.5 mr-1.5" /> Delete
                    </Button>
                  </div>

                  {/* Layer Controls */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-700">Layer Order</h4>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => moveObjectLayer(selectedObject.id, 'top')} title="Bring to Front">
                        <ChevronsUp className="size-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => moveObjectLayer(selectedObject.id, 'up')} title="Bring Forward">
                        <ChevronUp className="size-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => moveObjectLayer(selectedObject.id, 'down')} title="Send Backward">
                        <ChevronDown className="size-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => moveObjectLayer(selectedObject.id, 'bottom')} title="Send to Back">
                        <ChevronsDown className="size-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Text Controls */}
                  {selectedObject.type === 'text' && (
                    <>
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-700">Text Content</h4>
                        <textarea
                          value={selectedObject.text || ''}
                          onChange={(e) => updateObject(selectedObject.id, { text: e.target.value })}
                          className="w-full min-h-[80px] p-2.5 text-sm border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter text..."
                        />
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-700">Font Family</h4>
                        <select
                          value={selectedObject.fontFamily || 'Arial'}
                          onChange={(e) => updateObject(selectedObject.id, { fontFamily: e.target.value })}
                          className="w-full h-10 px-3 text-sm border rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Arial">Arial</option>
                          <option value="Arial Black">Arial Black</option>
                          {GOOGLE_FONTS.map(font => (
                            <option key={font} value={font} style={{ fontFamily: font }}>
                              {font}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-700">Font Size: {selectedObject.fontSize}px</h4>
                        <Slider
                          value={[selectedObject.fontSize || 32]}
                          onValueChange={([v]) => updateObject(selectedObject.id, { fontSize: v })}
                          min={8}
                          max={120}
                          step={1}
                        />
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-700">Style</h4>
                        <div className="flex gap-1">
                          <Button
                            variant={selectedObject.fontWeight === 'bold' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateObject(selectedObject.id, { 
                              fontWeight: selectedObject.fontWeight === 'bold' ? 'normal' : 'bold' 
                            })}
                          >
                            <Bold className="size-4" />
                          </Button>
                          <Button
                            variant={selectedObject.fontStyle === 'italic' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateObject(selectedObject.id, { 
                              fontStyle: selectedObject.fontStyle === 'italic' ? 'normal' : 'italic' 
                            })}
                          >
                            <Italic className="size-4" />
                          </Button>
                          <Button
                            variant={selectedObject.textDecoration === 'underline' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateObject(selectedObject.id, { 
                              textDecoration: selectedObject.textDecoration === 'underline' ? 'none' : 'underline' 
                            })}
                          >
                            <Underline className="size-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-700">Alignment</h4>
                        <div className="flex gap-1">
                          <Button
                            variant={selectedObject.textAlign === 'left' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateObject(selectedObject.id, { textAlign: 'left' })}
                          >
                            <AlignLeft className="size-4" />
                          </Button>
                          <Button
                            variant={selectedObject.textAlign === 'center' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateObject(selectedObject.id, { textAlign: 'center' })}
                          >
                            <AlignCenter className="size-4" />
                          </Button>
                          <Button
                            variant={selectedObject.textAlign === 'right' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateObject(selectedObject.id, { textAlign: 'right' })}
                          >
                            <AlignRight className="size-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-700">Text Color</h4>
                        <div className="grid grid-cols-6 gap-1.5">
                          {COLORS.map(color => (
                            <button
                              type="button"
                              key={color}
                              onClick={() => updateObject(selectedObject.id, { textColor: color })}
                              className={cn(
                                "aspect-square rounded-md border-2 transition-all",
                                selectedObject.textColor === color ? "border-blue-600 scale-110" : "border-gray-300 hover:border-gray-400"
                              )}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <Input
                          type="color"
                          value={selectedObject.textColor || '#000000'}
                          onChange={(e) => updateObject(selectedObject.id, { textColor: e.target.value })}
                          className="w-full h-8"
                        />
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-700">Background Color</h4>
                        <div className="grid grid-cols-6 gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateObject(selectedObject.id, { backgroundColor: 'transparent' })}
                            className={cn(
                              "aspect-square rounded-md border-2 transition-all bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjUiIGhlaWdodD0iNSIgZmlsbD0iI2NjYyIvPjxyZWN0IHg9IjUiIHk9IjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiIGZpbGw9IiNjY2MiLz48L3N2Zz4=')]",
                              selectedObject.backgroundColor === 'transparent' ? "border-blue-600 scale-110" : "border-gray-300 hover:border-gray-400"
                            )}
                            title="Transparent"
                          />
                          {COLORS.slice(0, 11).map(color => (
                            <button
                              type="button"
                              key={color}
                              onClick={() => updateObject(selectedObject.id, { backgroundColor: color })}
                              className={cn(
                                "aspect-square rounded-md border-2 transition-all",
                                selectedObject.backgroundColor === color ? "border-blue-600 scale-110" : "border-gray-300 hover:border-gray-400"
                              )}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Shape Controls */}
                  {selectedObject.type === 'shape' && (
                    <>
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-700">Fill Color</h4>
                        <div className="grid grid-cols-6 gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateObject(selectedObject.id, { fill: 'transparent' })}
                            className={cn(
                              "aspect-square rounded-md border-2 transition-all bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjUiIGhlaWdodD0iNSIgZmlsbD0iI2NjYyIvPjxyZWN0IHg9IjUiIHk9IjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiIGZpbGw9IiNjY2MiLz48L3N2Zz4=')]",
                              selectedObject.fill === 'transparent' ? "border-blue-600 scale-110" : "border-gray-300 hover:border-gray-400"
                            )}
                            title="No fill"
                          />
                          {COLORS.slice(0, 11).map(color => (
                            <button
                              type="button"
                              key={color}
                              onClick={() => updateObject(selectedObject.id, { fill: color })}
                              className={cn(
                                "aspect-square rounded-md border-2 transition-all",
                                selectedObject.fill === color ? "border-blue-600 scale-110" : "border-gray-300 hover:border-gray-400"
                              )}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <Input
                          type="color"
                          value={selectedObject.fill === 'transparent' ? '#ffffff' : selectedObject.fill || '#3b82f6'}
                          onChange={(e) => updateObject(selectedObject.id, { fill: e.target.value })}
                          className="w-full h-8"
                        />
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-700">Stroke Color</h4>
                        <div className="grid grid-cols-6 gap-1.5">
                          {COLORS.map(color => (
                            <button
                              type="button"
                              key={color}
                              onClick={() => updateObject(selectedObject.id, { stroke: color })}
                              className={cn(
                                "aspect-square rounded-md border-2 transition-all",
                                selectedObject.stroke === color ? "border-blue-600 scale-110" : "border-gray-300 hover:border-gray-400"
                              )}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-700">Stroke Width: {selectedObject.strokeWidth || 0}px</h4>
                        <Slider
                          value={[selectedObject.strokeWidth || 0]}
                          onValueChange={([v]) => updateObject(selectedObject.id, { strokeWidth: v })}
                          min={0}
                          max={20}
                          step={1}
                        />
                      </div>

                      {selectedObject.shapeType === 'rounded-rectangle' && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-gray-700">Corner Radius: {selectedObject.cornerRadius || 0}px</h4>
                          <Slider
                            value={[selectedObject.cornerRadius || 0]}
                            onValueChange={([v]) => updateObject(selectedObject.id, { cornerRadius: v })}
                            min={0}
                            max={50}
                            step={1}
                          />
                        </div>
                      )}

                      {selectedObject.shapeType === 'polygon' && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-gray-700">Sides: {selectedObject.sides || 6}</h4>
                          <Slider
                            value={[selectedObject.sides || 6]}
                            onValueChange={([v]) => updateObject(selectedObject.id, { sides: v })}
                            min={3}
                            max={12}
                            step={1}
                          />
                        </div>
                      )}
                    </>
                  )}

                  {/* Image/Icon Controls */}
                  {(selectedObject.type === 'image' || selectedObject.type === 'icon') && (
                    <>
                      {selectedObject.type === 'icon' && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1">
                            <Palette className="size-3.5" /> Icon Color
                          </h4>
                          <div className="grid grid-cols-6 gap-1.5">
                            {['#000000', '#dc2626', '#ea580c', '#facc15', '#22c55e', '#2563eb', '#7c3aed', '#ffffff'].map(color => (
                              <button
                                type="button"
                                key={color}
                                onClick={() => {
                                  const newColor = color
                                  const iconName = selectedObject.iconName
                                  const newSrc = `https://api.iconify.design/${iconName}.svg?color=${encodeURIComponent(newColor)}`
                                  updateObject(selectedObject.id, { src: newSrc, textColor: newColor })
                                }}
                                className={cn(
                                  "aspect-square rounded-md border-2 transition-all",
                                  selectedObject.textColor === color ? "border-blue-600 scale-110" : "border-gray-300 hover:border-gray-400"
                                )}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <Input
                            type="color"
                            value={selectedObject.textColor || '#000000'}
                            onChange={(e) => {
                              const newColor = e.target.value
                              const iconName = selectedObject.iconName
                              const newSrc = `https://api.iconify.design/${iconName}.svg?color=${encodeURIComponent(newColor)}`
                              updateObject(selectedObject.id, { src: newSrc, textColor: newColor })
                            }}
                            className="w-full h-8"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-700">Flip</h4>
                        <div className="flex gap-1">
                          <Button
                            variant={selectedObject.flipH ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateObject(selectedObject.id, { flipH: !selectedObject.flipH })}
                          >
                            <FlipHorizontal className="size-4 mr-1" /> Horizontal
                          </Button>
                          <Button
                            variant={selectedObject.flipV ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateObject(selectedObject.id, { flipV: !selectedObject.flipV })}
                          >
                            <FlipVertical className="size-4 mr-1" /> Vertical
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Common Controls */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-700">Opacity: {Math.round((selectedObject.opacity || 1) * 100)}%</h4>
                    <Slider
                      value={[(selectedObject.opacity || 1) * 100]}
                      onValueChange={([v]) => updateObject(selectedObject.id, { opacity: v / 100 })}
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-700">Rotation: {Math.round(selectedObject.rotation || 0)}°</h4>
                    <Slider
                      value={[selectedObject.rotation || 0]}
                      onValueChange={([v]) => updateObject(selectedObject.id, { rotation: v })}
                      min={-180}
                      max={180}
                      step={1}
                    />
                    <div className="flex flex-wrap gap-1">
                      {[0, 45, 90, 135, 180, -90, -45].map(angle => (
                        <Button
                          key={angle}
                          variant="outline"
                          size="sm"
                          className="text-xs bg-transparent"
                          onClick={() => updateObject(selectedObject.id, { rotation: angle })}
                        >
                          {angle}°
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-700">Position & Size</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-gray-500">X (inches)</label>
                        <Input
                          type="number"
                          value={selectedObject.x.toFixed(2)}
                          onChange={(e) => updateObject(selectedObject.id, { x: Number(e.target.value) })}
                          step={0.1}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500">Y (inches)</label>
                        <Input
                          type="number"
                          value={selectedObject.y.toFixed(2)}
                          onChange={(e) => updateObject(selectedObject.id, { y: Number(e.target.value) })}
                          step={0.1}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500">Width</label>
                        <Input
                          type="number"
                          value={selectedObject.width.toFixed(2)}
                          onChange={(e) => updateObject(selectedObject.id, { width: Number(e.target.value) })}
                          step={0.1}
                          min={0.1}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500">Height</label>
                        <Input
                          type="number"
                          value={selectedObject.height.toFixed(2)}
                          onChange={(e) => updateObject(selectedObject.id, { height: Number(e.target.value) })}
                          step={0.1}
                          min={0.1}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  )
}
