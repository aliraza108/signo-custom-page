'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Home, Package, Phone } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="h-14 w-full border-b bg-white shadow-sm flex-shrink-0 relative">
      <div className="h-full flex items-center justify-between px-4 max-w-full pointer-events-auto">
        {/* Logo/Brand */}
        <Link href="https://signografx.com" target="_blank" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center text-sm font-semibold">SG</div>
          <span className="hidden sm:inline text-gray-900">SignoGrafx</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2 pointer-events-auto">
          <Button variant="ghost" size="sm" asChild className="h-9">
            <Link href="https://signografx.com" target="_blank" className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Home</span>
            </Link>
          </Button>

          <Button variant="ghost" size="sm" asChild className="h-9">
            <Link href="https://signografx.com/products" target="_blank" className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Products</span>
            </Link>
          </Button>

          <Button variant="ghost" size="sm" asChild className="h-9">
            <Link href="https://signografx.com/pages/contact" target="_blank" className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Contact</span>
            </Link>
          </Button>

          <Button variant="default" size="sm" asChild className="h-9 bg-blue-600 hover:bg-blue-700">
            <Link href="https://signografx.com/cart" target="_blank" className="flex items-center gap-1">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Cart</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
