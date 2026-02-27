'use client'

import { useEffect, useRef } from 'react'

export function ResizeIframe() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    // Handle messages from iframe
    const handleMessage = (event: MessageEvent) => {
      // Handle resize messages from iframe
      if (event.data.type === 'RESIZE_IFRAME') {
        iframe.style.height = (event.data.height + 20) + 'px'
      }
    }

    // Handle window resize
    const handleWindowResize = () => {
      const extra = 100
      iframe.style.height = (window.innerHeight + extra) + 'px'
    }

    // Set initial height
    const resizeObserver = new ResizeObserver(() => {
      handleWindowResize()
    })
    resizeObserver.observe(document.body)

    window.addEventListener('message', handleMessage)
    window.addEventListener('resize', handleWindowResize)

    // Set initial size
    handleWindowResize()

    return () => {
      window.removeEventListener('message', handleMessage)
      window.removeEventListener('resize', handleWindowResize)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className="w-full">
      <iframe
        ref={iframeRef}
        id="designer-iframe"
        src="https://customsigns.vercel.app"
        title="Sign Builder Designer"
        style={{
          width: '100%',
          minHeight: '100vh',
          border: 'none',
          display: 'block',
        }}
      />
    </div>
  )
}
