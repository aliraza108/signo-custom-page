"use client"

import { useEffect, useState } from "react"

type ShopifyPayload = {
  variant?: { id?: number | string | null } | null
  sizes?: unknown
  materials?: unknown
  price_per_sqft?: string | number | null
  metafields?: Record<string, unknown> | null
}

function parseMfJson(v: unknown): any {
  if (!v || v === "null" || v === "") return null
  if (typeof v === "object") return v
  try {
    const first = JSON.parse(String(v))
    if (typeof first === "string") {
      try {
        return JSON.parse(first)
      } catch {
        return first
      }
    }
    return first
  } catch {
    return null
  }
}

export function useShopifyData() {
  const [sizes, setSizes] = useState<string[]>([])
  const [materials, setMaterials] = useState<string[]>([])
  const [pricePerSqft, setPricePerSqft] = useState<number | null>(null)
  const [variantId, setVariantId] = useState<number | null>(null)

  useEffect(() => {
    const applyPayload = (payload?: ShopifyPayload) => {
      if (!payload) return

      const parsedSizes = Array.isArray(payload.sizes)
        ? payload.sizes
        : parseMfJson(payload.sizes ?? payload.metafields?.sizes)
      if (Array.isArray(parsedSizes) && parsedSizes.length > 0) {
        setSizes(parsedSizes.map((v) => String(v)))
      }

      const parsedMaterials = Array.isArray(payload.materials)
        ? payload.materials
        : parseMfJson(payload.materials ?? payload.metafields?.materials)
      if (Array.isArray(parsedMaterials) && parsedMaterials.length > 0) {
        setMaterials(parsedMaterials.map((v) => String(v)))
      }

      const ppsfRaw = payload.price_per_sqft ?? payload.metafields?.price_per_sqft
      if (ppsfRaw != null && ppsfRaw !== "") {
        const parsed = Number.parseFloat(String(ppsfRaw))
        if (Number.isFinite(parsed)) setPricePerSqft(parsed)
      }

      const rawVariantId = payload.variant?.id
      if (rawVariantId != null) {
        const parsedVariantId = Number(rawVariantId)
        if (Number.isFinite(parsedVariantId)) setVariantId(parsedVariantId)
      }
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== "SHOPIFY_PRODUCT_DATA") return
      applyPayload(event.data.payload)
    }

    const handleCustomLoaded = (event: Event) => {
      const customEvent = event as CustomEvent
      applyPayload(customEvent.detail)
    }

    window.addEventListener("message", handleMessage)
    window.addEventListener("shopify-product-loaded", handleCustomLoaded as EventListener)

    const fallbackProduct = (window as any).SHOPIFY_PRODUCT
    if (fallbackProduct) applyPayload(fallbackProduct)
    if (!fallbackProduct?.variant?.id) {
      const sp = new URLSearchParams(window.location.search)
      const qVariant = Number(sp.get('variant'))
      if (Number.isFinite(qVariant) && qVariant > 0) setVariantId(qVariant)
    }

    return () => {
      window.removeEventListener("message", handleMessage)
      window.removeEventListener("shopify-product-loaded", handleCustomLoaded as EventListener)
    }
  }, [])

  return { sizes, materials, pricePerSqft, variantId }
}
