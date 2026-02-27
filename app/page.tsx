"use client"

import { SignBuilderProvider } from '@/lib/sign-builder-context'
import { LeftSidebar } from '@/components/sign-builder/left-sidebar'
import { TopToolbar } from '@/components/sign-builder/top-toolbar'
import { DesignCanvas } from '@/components/sign-builder/design-canvas'
import { Footer } from '@/components/sign-builder/footer'

export default function SignBuilderPage() {
  return (
    <SignBuilderProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-background pointer-events-auto">
        {/* Top Toolbar */}
        <TopToolbar />
        
        {/* Main Content Area - Fills remaining space */}
        <div className="flex-1 flex w-full overflow-hidden pointer-events-auto">
          {/* Left Sidebar */}
          <LeftSidebar />
          
          {/* Canvas Area - Center */}
          <DesignCanvas />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </SignBuilderProvider>
  )
}
