import React from 'react'
import { SignBuilderProvider } from '@/lib/sign-builder-context'
import { LeftSidebar } from '@/components/sign-builder/left-sidebar'
import { RightSidebar } from '@/components/sign-builder/right-sidebar'
import { TopToolbar } from '@/components/sign-builder/top-toolbar'
import { DesignCanvas } from '@/components/sign-builder/design-canvas'

// Shopify Sign Builder Component - Optimized for iframe
export function SignBuilderApp() {
  return (
    <SignBuilderProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-white fixed inset-0">
        {/* Compact Top Toolbar */}
        <div className="flex-shrink-0 h-12">
          <TopToolbar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Left Sidebar - Compact */}
          <div className="flex-shrink-0 overflow-y-auto">
            <LeftSidebar />
          </div>
          
          {/* Canvas Area */}
          <div className="flex-1 overflow-auto min-w-0">
            <DesignCanvas />
          </div>
          
          {/* Right Sidebar - Compact */}
          <div className="flex-shrink-0 overflow-y-auto">
            <RightSidebar />
          </div>
        </div>
      </div>
    </SignBuilderProvider>
  )
}

export default SignBuilderApp
