"use client"

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useSignBuilder } from '@/lib/sign-builder-context'
import { cn } from '@/lib/utils'

const PIXELS_PER_INCH = 25 // Better resolution

interface DragState {
  isDragging: boolean
  isResizing: boolean
  isRotating: boolean
  handle: string | null
  startX: number
  startY: number
  objStartX: number
  objStartY: number
  objStartWidth: number
  objStartHeight: number
  objStartRotation: number
}

export function DesignCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const {
    objects,
    selectedObjectId,
    canvasWidth,
    canvasHeight,
    zoom,
    showGrid,
    showRulers,
    selectObject,
    updateObject,
    deleteObject,
    sides,
    activeSide,
    setActiveSide,
    setCanvasSize, // Declare setCanvasSize here
  } = useSignBuilder()

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    isResizing: false,
    isRotating: false,
    handle: null,
    startX: 0,
    startY: 0,
    objStartX: 0,
    objStartY: 0,
    objStartWidth: 0,
    objStartHeight: 0,
    objStartRotation: 0,
  })

  const [editingTextId, setEditingTextId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [snapLines, setSnapLines] = useState<{ x: number[], y: number[] }>({ x: [], y: [] })

  const canvasPixelWidth = canvasWidth * PIXELS_PER_INCH * zoom
  const canvasPixelHeight = canvasHeight * PIXELS_PER_INCH * zoom

  const sortedObjects = [...objects].sort((a, b) => a.zIndex - b.zIndex)

  // Snapping logic
  const findSnapPoints = useCallback((objId: string, newX: number, newY: number) => {
    const SNAP_THRESHOLD = 0.5
    const snapX: number[] = []
    const snapY: number[] = []
    let snappedX = newX
    let snappedY = newY

    // Canvas center and edges
    const guides = {
      x: [0, canvasWidth / 2, canvasWidth],
      y: [0, canvasHeight / 2, canvasHeight],
    }

    // Other objects centers
    objects.forEach(obj => {
      if (obj.id !== objId) {
        guides.x.push(obj.x)
        guides.y.push(obj.y)
      }
    })

    guides.x.forEach(gx => {
      if (Math.abs(newX - gx) < SNAP_THRESHOLD) {
        snappedX = gx
        snapX.push(gx)
      }
    })

    guides.y.forEach(gy => {
      if (Math.abs(newY - gy) < SNAP_THRESHOLD) {
        snappedY = gy
        snapY.push(gy)
      }
    })

    return { snappedX, snappedY, snapX, snapY }
  }, [objects, canvasWidth, canvasHeight])

  const handleMouseDown = useCallback((e: React.MouseEvent, objectId: string, handle?: string) => {
    e.stopPropagation()
    e.preventDefault()
    const obj = objects.find(o => o.id === objectId)
    if (!obj || obj.locked) return

    selectObject(objectId)

    if (handle === 'rotate') {
      setDragState({
        isDragging: false,
        isResizing: false,
        isRotating: true,
        handle: 'rotate',
        startX: e.clientX,
        startY: e.clientY,
        objStartX: obj.x,
        objStartY: obj.y,
        objStartWidth: obj.width,
        objStartHeight: obj.height,
        objStartRotation: obj.rotation,
      })
    } else if (handle) {
      setDragState({
        isDragging: false,
        isResizing: true,
        isRotating: false,
        handle,
        startX: e.clientX,
        startY: e.clientY,
        objStartX: obj.x,
        objStartY: obj.y,
        objStartWidth: obj.width,
        objStartHeight: obj.height,
        objStartRotation: obj.rotation,
      })
    } else {
      setDragState({
        isDragging: true,
        isResizing: false,
        isRotating: false,
        handle: null,
        startX: e.clientX,
        startY: e.clientY,
        objStartX: obj.x,
        objStartY: obj.y,
        objStartWidth: obj.width,
        objStartHeight: obj.height,
        objStartRotation: obj.rotation,
      })
    }
  }, [objects, selectObject])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!selectedObjectId) return
    if (!dragState.isDragging && !dragState.isResizing && !dragState.isRotating) return

    const deltaX = (e.clientX - dragState.startX) / (PIXELS_PER_INCH * zoom)
    const deltaY = (e.clientY - dragState.startY) / (PIXELS_PER_INCH * zoom)

    if (dragState.isDragging) {
      const newX = dragState.objStartX + deltaX
      const newY = dragState.objStartY + deltaY
      const { snappedX, snappedY, snapX, snapY } = findSnapPoints(selectedObjectId, newX, newY)
      
      setSnapLines({ x: snapX, y: snapY })
      updateObject(selectedObjectId, {
        x: snappedX,
        y: snappedY,
      })
    } else if (dragState.isRotating && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const obj = objects.find(o => o.id === selectedObjectId)
      if (!obj) return

      const centerX = rect.left + (obj.x * PIXELS_PER_INCH * zoom)
      const centerY = rect.top + (obj.y * PIXELS_PER_INCH * zoom)
      
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 90
      
      // Snap to 15 degree increments when shift is held
      const snappedAngle = e.shiftKey ? Math.round(angle / 15) * 15 : angle
      
      updateObject(selectedObjectId, {
        rotation: snappedAngle,
      })
    } else if (dragState.isResizing && dragState.handle) {
      let newWidth = dragState.objStartWidth
      let newHeight = dragState.objStartHeight
      let newX = dragState.objStartX
      let newY = dragState.objStartY

      const handle = dragState.handle

      if (handle.includes('e')) {
        newWidth = Math.max(0.5, dragState.objStartWidth + deltaX)
      }
      if (handle.includes('w')) {
        const widthChange = deltaX
        newWidth = Math.max(0.5, dragState.objStartWidth - widthChange)
        newX = dragState.objStartX + widthChange / 2
      }
      if (handle.includes('s')) {
        newHeight = Math.max(0.5, dragState.objStartHeight + deltaY)
      }
      if (handle.includes('n')) {
        const heightChange = deltaY
        newHeight = Math.max(0.5, dragState.objStartHeight - heightChange)
        newY = dragState.objStartY + heightChange / 2
      }

      // Maintain aspect ratio when shift is held
      if (e.shiftKey && (handle === 'nw' || handle === 'ne' || handle === 'sw' || handle === 'se')) {
        const aspectRatio = dragState.objStartWidth / dragState.objStartHeight
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          newHeight = newWidth / aspectRatio
        } else {
          newWidth = newHeight * aspectRatio
        }
      }

      updateObject(selectedObjectId, {
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY,
      })
    }
  }, [selectedObjectId, dragState, zoom, updateObject, findSnapPoints, objects])

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      isResizing: false,
      isRotating: false,
      handle: null,
      startX: 0,
      startY: 0,
      objStartX: 0,
      objStartY: 0,
      objStartWidth: 0,
      objStartHeight: 0,
      objStartRotation: 0,
    })
    setSnapLines({ x: [], y: [] })
  }, [])

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectObject(null)
      setEditingTextId(null)
    }
  }, [selectObject])

  const handleDoubleClick = useCallback((e: React.MouseEvent, objectId: string) => {
    e.stopPropagation()
    const obj = objects.find(o => o.id === objectId)
    if (obj?.type === 'text' && !obj.locked) {
      setEditingTextId(objectId)
      setEditingText(obj.text || '')
    }
  }, [objects])

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingText(e.target.value)
    if (editingTextId) {
      updateObject(editingTextId, { text: e.target.value })
    }
  }, [editingTextId, updateObject])

  const handleTextBlur = useCallback(() => {
    setEditingTextId(null)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingTextId) return // Don't handle shortcuts while editing text
      
      if (!selectedObjectId) return
      const obj = objects.find(o => o.id === selectedObjectId)
      if (!obj || obj.locked) return

      const step = e.shiftKey ? 1 : 0.1
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          updateObject(selectedObjectId, { y: obj.y - step })
          break
        case 'ArrowDown':
          e.preventDefault()
          updateObject(selectedObjectId, { y: obj.y + step })
          break
        case 'ArrowLeft':
          e.preventDefault()
          updateObject(selectedObjectId, { x: obj.x - step })
          break
        case 'ArrowRight':
          e.preventDefault()
          updateObject(selectedObjectId, { x: obj.x + step })
          break
        case 'Delete':
        case 'Backspace':
          if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
            e.preventDefault()
            deleteObject(selectedObjectId)
          }
          break
        case 'Escape':
          selectObject(null)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedObjectId, objects, updateObject, deleteObject, selectObject, editingTextId])

  const renderObject = (obj: typeof objects[0]) => {
    const pixelX = obj.x * PIXELS_PER_INCH * zoom
    const pixelY = obj.y * PIXELS_PER_INCH * zoom
    const pixelWidth = obj.width * PIXELS_PER_INCH * zoom
    const pixelHeight = obj.height * PIXELS_PER_INCH * zoom
    const isSelected = selectedObjectId === obj.id
    const isEditing = editingTextId === obj.id

    const commonStyle: React.CSSProperties = {
      position: 'absolute',
      left: pixelX - pixelWidth / 2,
      top: pixelY - pixelHeight / 2,
      width: pixelWidth,
      height: pixelHeight,
      transform: `rotate(${obj.rotation}deg)${obj.flipH ? ' scaleX(-1)' : ''}${obj.flipV ? ' scaleY(-1)' : ''}`,
      opacity: obj.opacity,
      cursor: obj.locked ? 'not-allowed' : isEditing ? 'text' : 'move',
      borderRadius: obj.borderRadius ? `${obj.borderRadius * zoom}px` : undefined,
      boxShadow: obj.shadow ? `0 ${4 * zoom}px ${12 * zoom}px rgba(0,0,0,0.3)` : undefined,
      transformOrigin: 'center center',
    }

    const renderContent = () => {
      switch (obj.type) {
        case 'text':
          return (
            <div
              style={{
                ...commonStyle,
                fontFamily: obj.fontFamily,
                fontSize: `${(obj.fontSize || 32) * zoom}px`,
                fontWeight: obj.fontWeight,
                fontStyle: obj.fontStyle,
                textDecoration: obj.textDecoration,
                textAlign: obj.textAlign as React.CSSProperties['textAlign'],
                color: obj.textColor,
                backgroundColor: obj.backgroundColor === 'transparent' ? undefined : obj.backgroundColor,
                letterSpacing: `${(obj.letterSpacing || 0) * zoom}px`,
                lineHeight: obj.lineHeight || 1.2,
                display: 'flex',
                alignItems: obj.verticalAlign === 'top' ? 'flex-start' : obj.verticalAlign === 'bottom' ? 'flex-end' : 'center',
                justifyContent: obj.textAlign === 'left' ? 'flex-start' : obj.textAlign === 'right' ? 'flex-end' : 'center',
                padding: `${4 * zoom}px`,
                overflow: 'hidden',
                userSelect: 'none',
                WebkitUserSelect: 'none',
              }}
              onMouseDown={(e) => !isEditing && handleMouseDown(e, obj.id)}
              onDoubleClick={(e) => handleDoubleClick(e, obj.id)}
            >
              {isEditing ? (
                <textarea
                  value={editingText}
                  onChange={handleTextChange}
                  onBlur={handleTextBlur}
                  autoFocus
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                    color: 'inherit',
                    textAlign: 'inherit',
                    lineHeight: 'inherit',
                    letterSpacing: 'inherit',
                  }}
                />
              ) : (
                <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {obj.text}
                </span>
              )}
            </div>
          )

        case 'shape':
          if (obj.shapeType === 'circle') {
            return (
              <div
                style={{
                  ...commonStyle,
                  borderRadius: '50%',
                  backgroundColor: obj.fill === 'transparent' ? undefined : obj.fill,
                  border: obj.strokeWidth ? `${obj.strokeWidth * zoom}px solid ${obj.stroke}` : undefined,
                }}
                onMouseDown={(e) => handleMouseDown(e, obj.id)}
              />
            )
          }
          if (obj.shapeType === 'triangle') {
            return (
              <svg
                style={commonStyle}
                viewBox="0 0 100 100"
                onMouseDown={(e) => handleMouseDown(e, obj.id)}
              >
                <polygon
                  points="50,5 95,95 5,95"
                  fill={obj.fill === 'transparent' ? 'none' : obj.fill}
                  stroke={obj.stroke}
                  strokeWidth={obj.strokeWidth}
                />
              </svg>
            )
          }
          if (obj.shapeType === 'line') {
            return (
              <svg
                style={commonStyle}
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
                onMouseDown={(e) => handleMouseDown(e, obj.id)}
              >
                <line
                  x1="0"
                  y1="5"
                  x2="100"
                  y2="5"
                  stroke={obj.stroke || obj.fill || '#000'}
                  strokeWidth={Math.max(2, (obj.strokeWidth || 2))}
                  strokeLinecap="round"
                />
              </svg>
            )
          }
          if (obj.shapeType === 'arrow') {
            return (
              <svg
                style={commonStyle}
                viewBox="0 0 100 30"
                preserveAspectRatio="none"
                onMouseDown={(e) => handleMouseDown(e, obj.id)}
              >
                <defs>
                  <marker
                    id={`arrowhead-${obj.id}`}
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill={obj.fill || obj.stroke || '#000'}
                    />
                  </marker>
                </defs>
                <line
                  x1="5"
                  y1="15"
                  x2="85"
                  y2="15"
                  stroke={obj.fill || obj.stroke || '#000'}
                  strokeWidth={Math.max(3, (obj.strokeWidth || 3))}
                  markerEnd={`url(#arrowhead-${obj.id})`}
                />
              </svg>
            )
          }
          if (obj.shapeType === 'star') {
            return (
              <svg
                style={commonStyle}
                viewBox="0 0 100 100"
                onMouseDown={(e) => handleMouseDown(e, obj.id)}
              >
                <polygon
                  points="50,5 61,39 97,39 68,61 79,95 50,73 21,95 32,61 3,39 39,39"
                  fill={obj.fill === 'transparent' ? 'none' : obj.fill}
                  stroke={obj.stroke}
                  strokeWidth={obj.strokeWidth}
                />
              </svg>
            )
          }
          if (obj.shapeType === 'polygon') {
            const numSides = obj.sides || 6
            const points = Array.from({ length: numSides }, (_, i) => {
              const angle = (i * 2 * Math.PI) / numSides - Math.PI / 2
              const x = 50 + 45 * Math.cos(angle)
              const y = 50 + 45 * Math.sin(angle)
              return `${x},${y}`
            }).join(' ')
            return (
              <svg
                style={commonStyle}
                viewBox="0 0 100 100"
                onMouseDown={(e) => handleMouseDown(e, obj.id)}
              >
                <polygon
                  points={points}
                  fill={obj.fill === 'transparent' ? 'none' : obj.fill}
                  stroke={obj.stroke}
                  strokeWidth={obj.strokeWidth}
                />
              </svg>
            )
          }
          if (obj.shapeType === 'rounded-rectangle') {
            return (
              <div
                style={{
                  ...commonStyle,
                  backgroundColor: obj.fill === 'transparent' ? undefined : obj.fill,
                  border: obj.strokeWidth ? `${obj.strokeWidth * zoom}px solid ${obj.stroke}` : undefined,
                  borderRadius: `${(obj.cornerRadius || 8) * zoom}px`,
                }}
                onMouseDown={(e) => handleMouseDown(e, obj.id)}
              />
            )
          }
          if (obj.shapeType === 'prohibition') {
            return (
              <svg
                style={commonStyle}
                viewBox="0 0 100 100"
                onMouseDown={(e) => handleMouseDown(e, obj.id)}
              >
                <circle cx="50" cy="50" r="45" fill="none" stroke={obj.stroke || '#dc2626'} strokeWidth={obj.strokeWidth || 6} />
                <line x1="20" y1="80" x2="80" y2="20" stroke={obj.stroke || '#dc2626'} strokeWidth={obj.strokeWidth || 6} />
              </svg>
            )
          }
          if (obj.shapeType === 'warning-triangle') {
            return (
              <svg
                style={commonStyle}
                viewBox="0 0 100 90"
                onMouseDown={(e) => handleMouseDown(e, obj.id)}
              >
                <polygon
                  points="50,5 95,85 5,85"
                  fill={obj.fill || '#facc15'}
                  stroke={obj.stroke || '#000'}
                  strokeWidth={obj.strokeWidth || 3}
                />
                <text x="50" y="70" textAnchor="middle" fontSize="50" fontWeight="bold" fill="#000">!</text>
              </svg>
            )
          }
          // Default rectangle
          return (
            <div
              style={{
                ...commonStyle,
                backgroundColor: obj.fill === 'transparent' ? undefined : obj.fill,
                border: obj.strokeWidth ? `${obj.strokeWidth * zoom}px solid ${obj.stroke}` : undefined,
              }}
              onMouseDown={(e) => handleMouseDown(e, obj.id)}
            />
          )

        case 'image':
        case 'icon':
          return (
            <img
              src={obj.src || "/placeholder.svg"}
              alt=""
              style={{
                ...commonStyle,
                objectFit: 'contain',
              }}
              onMouseDown={(e) => handleMouseDown(e, obj.id)}
              draggable={false}
              crossOrigin="anonymous"
            />
          )

        case 'qrcode':
          return (
            <img
              src={obj.src || "/placeholder.svg"}
              alt="QR Code"
              style={{
                ...commonStyle,
                objectFit: 'contain',
                background: '#fff',
                padding: `${4 * zoom}px`,
              }}
              onMouseDown={(e) => handleMouseDown(e, obj.id)}
              draggable={false}
              crossOrigin="anonymous"
            />
          )

        case 'table':
          const rows = obj.rows || 3
          const cols = obj.cols || 3
          return (
            <div
              style={{
                ...commonStyle,
                backgroundColor: obj.fill || '#ffffff',
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                border: `${(obj.strokeWidth || 1) * zoom}px solid ${obj.borderColor || '#000'}`,
                overflow: 'hidden',
              }}
              onMouseDown={(e) => handleMouseDown(e, obj.id)}
            >
              {obj.cellData?.flat().map((cell, i) => (
                <div
                  key={i}
                  style={{
                    borderRight: i % cols < cols - 1 ? `${(obj.strokeWidth || 1) * zoom}px solid ${obj.borderColor || '#000'}` : undefined,
                    borderBottom: Math.floor(i / cols) < rows - 1 ? `${(obj.strokeWidth || 1) * zoom}px solid ${obj.borderColor || '#000'}` : undefined,
                    padding: `${(obj.cellPadding || 4) * zoom}px`,
                    fontSize: `${14 * zoom}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cell}
                </div>
              ))}
            </div>
          )

        default:
          return null
      }
    }

    return (
      <React.Fragment key={obj.id}>
        {renderContent()}
        {isSelected && !obj.locked && !isEditing && (
          <>
            {/* Selection border */}
            <div
              style={{
                position: 'absolute',
                left: pixelX - pixelWidth / 2 - 1,
                top: pixelY - pixelHeight / 2 - 1,
                width: pixelWidth + 2,
                height: pixelHeight + 2,
                border: '2px solid #2563eb',
                pointerEvents: 'none',
                transform: `rotate(${obj.rotation}deg)`,
                transformOrigin: 'center center',
              }}
              data-capture-ignore="true"
            />
            {/* Corner resize handles */}
            {['nw', 'ne', 'se', 'sw'].map(handle => {
              let left = pixelX - pixelWidth / 2
              let top = pixelY - pixelHeight / 2

              if (handle.includes('e')) left += pixelWidth
              if (handle.includes('s')) top += pixelHeight

              const cos = Math.cos(obj.rotation * Math.PI / 180)
              const sin = Math.sin(obj.rotation * Math.PI / 180)
              const cx = pixelX
              const cy = pixelY
              const dx = left - cx
              const dy = top - cy
              const rotatedLeft = cx + dx * cos - dy * sin
              const rotatedTop = cy + dx * sin + dy * cos

              return (
                <div
                  key={handle}
                  style={{
                    position: 'absolute',
                    left: rotatedLeft - 5,
                    top: rotatedTop - 5,
                    width: 10,
                    height: 10,
                    backgroundColor: '#2563eb',
                    border: '2px solid white',
                    cursor: `${handle}-resize`,
                    borderRadius: '2px',
                    zIndex: 1000,
                  }}
                  data-capture-ignore="true"
                  onMouseDown={(e) => handleMouseDown(e, obj.id, handle)}
                />
              )
            })}
            {/* Edge resize handles */}
            {['n', 'e', 's', 'w'].map(handle => {
              let left = pixelX - pixelWidth / 2
              let top = pixelY - pixelHeight / 2

              if (handle === 'e') { left += pixelWidth; top += pixelHeight / 2 }
              if (handle === 'w') { top += pixelHeight / 2 }
              if (handle === 's') { left += pixelWidth / 2; top += pixelHeight }
              if (handle === 'n') { left += pixelWidth / 2 }

              const cos = Math.cos(obj.rotation * Math.PI / 180)
              const sin = Math.sin(obj.rotation * Math.PI / 180)
              const cx = pixelX
              const cy = pixelY
              const dx = left - cx
              const dy = top - cy
              const rotatedLeft = cx + dx * cos - dy * sin
              const rotatedTop = cy + dx * sin + dy * cos

              return (
                <div
                  key={handle}
                  style={{
                    position: 'absolute',
                    left: rotatedLeft - 4,
                    top: rotatedTop - 4,
                    width: 8,
                    height: 8,
                    backgroundColor: 'white',
                    border: '2px solid #2563eb',
                    cursor: handle === 'n' || handle === 's' ? 'ns-resize' : 'ew-resize',
                    borderRadius: '2px',
                    zIndex: 1000,
                  }}
                  data-capture-ignore="true"
                  onMouseDown={(e) => handleMouseDown(e, obj.id, handle)}
                />
              )
            })}
            {/* Rotation handle */}
            <div
              style={{
                position: 'absolute',
                left: pixelX - 6,
                top: pixelY - pixelHeight / 2 - 30,
                width: 12,
                height: 12,
                backgroundColor: '#10b981',
                border: '2px solid white',
                cursor: 'crosshair',
                borderRadius: '50%',
                zIndex: 1000,
                transform: `rotate(${obj.rotation}deg)`,
                transformOrigin: `6px ${pixelHeight / 2 + 30}px`,
              }}
              data-capture-ignore="true"
              onMouseDown={(e) => handleMouseDown(e, obj.id, 'rotate')}
            />
            {/* Rotation line */}
            <div
              style={{
                position: 'absolute',
                left: pixelX - 0.5,
                top: pixelY - pixelHeight / 2 - 24,
                width: 1,
                height: 24,
                backgroundColor: '#10b981',
                pointerEvents: 'none',
                transform: `rotate(${obj.rotation}deg)`,
                transformOrigin: `0.5px ${pixelHeight / 2 + 24}px`,
              }}
              data-capture-ignore="true"
            />
          </>
        )}
      </React.Fragment>
    )
  }

  return (
    <div className="flex-1 bg-gray-200 overflow-hidden flex flex-col min-h-0">
      {/* Side tabs for double-sided */}
      {sides === 2 && (
        <div className="flex-shrink-0 flex justify-center gap-2 py-3 bg-white border-b border-gray-300">
          <button
            type="button"
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
              activeSide === 'front' ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
            onClick={() => setActiveSide('front')}
          >
            Front Side
          </button>
          <button
            type="button"
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
              activeSide === 'back' ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
            onClick={() => setActiveSide('back')}
          >
            Back Side
          </button>
        </div>
      )}

      <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-gray-200 min-h-0">
        <div className="relative">
          {/* Rulers */}
          {showRulers && (
            <>
              {/* Horizontal ruler */}
              <div
                className="absolute -top-6 left-0 h-5 bg-white border-b flex items-end overflow-hidden"
                style={{ width: canvasPixelWidth }}
              >
                {Array.from({ length: Math.ceil(canvasWidth) + 1 }, (_, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 relative"
                    style={{ width: PIXELS_PER_INCH * zoom }}
                  >
                    <div className="absolute bottom-0 left-0 w-px h-3 bg-neutral-400" />
                    <span className="absolute bottom-1 left-1 text-[9px] text-neutral-600 font-medium">
                      {i}"
                    </span>
                  </div>
                ))}
              </div>
              {/* Vertical ruler */}
              <div
                className="absolute top-0 -left-6 w-5 bg-white border-r flex flex-col overflow-hidden"
                style={{ height: canvasPixelHeight }}
              >
                {Array.from({ length: Math.ceil(canvasHeight) + 1 }, (_, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 relative"
                    style={{ height: PIXELS_PER_INCH * zoom }}
                  >
                    <div className="absolute top-0 right-0 h-px w-3 bg-neutral-400" />
                    <span className="absolute top-1 right-1.5 text-[9px] text-neutral-600 font-medium">
                      {i}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Snap lines */}
          {snapLines.x.map((x, i) => (
            <div
              key={`snap-x-${i}`}
              className="absolute top-0 w-px bg-blue-500 pointer-events-none"
              style={{
                left: x * PIXELS_PER_INCH * zoom,
                height: canvasPixelHeight,
              }}
            />
          ))}
          {snapLines.y.map((y, i) => (
            <div
              key={`snap-y-${i}`}
              className="absolute left-0 h-px bg-blue-500 pointer-events-none"
              style={{
                top: y * PIXELS_PER_INCH * zoom,
                width: canvasPixelWidth,
              }}
            />
          ))}

          {/* Canvas */}
          <div
            ref={canvasRef}
            data-design-canvas
            className="relative bg-white group"
            style={{
              width: canvasPixelWidth,
              height: canvasPixelHeight,
              backgroundImage: showGrid
                ? `linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)`
                : undefined,
              backgroundSize: showGrid ? `${PIXELS_PER_INCH * zoom}px ${PIXELS_PER_INCH * zoom}px` : undefined,
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
            }}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Mounting holes preview */}
            {sortedObjects.map(renderObject)}
            
            {/* Resize handles on canvas frame */}
            <div
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 rounded-full cursor-se-resize hover:bg-blue-700 transition-colors"
              onMouseDown={(e) => {
                e.stopPropagation()
                const startX = e.clientX
                const startY = e.clientY
                const startWidth = canvasWidth
                const startHeight = canvasHeight

                const handleResize = (e: MouseEvent) => {
                  const deltaX = (e.clientX - startX) / (PIXELS_PER_INCH * zoom)
                  const deltaY = (e.clientY - startY) / (PIXELS_PER_INCH * zoom)
                  
                  const newWidth = Math.max(2, Math.round((startWidth + deltaX) * 2) / 2)
                  const newHeight = Math.max(2, Math.round((startHeight + deltaY) * 2) / 2)
                  
                  setCanvasSize(newWidth, newHeight)
                }

                const handleEnd = () => {
                  document.removeEventListener('mousemove', handleResize)
                  document.removeEventListener('mouseup', handleEnd)
                }

                document.addEventListener('mousemove', handleResize)
                document.addEventListener('mouseup', handleEnd)
              }}
              title="Drag to resize canvas"
              data-capture-ignore="true"
            />
          </div>

          {/* Canvas size indicator */}
          <div className="absolute -bottom-8 left-0 right-0 text-center text-xs text-gray-400 font-medium">
            {canvasWidth}" x {canvasHeight}" • {(canvasWidth * canvasHeight).toLocaleString()} sq in • {Math.round(zoom * 100)}%
          </div>
        </div>
      </div>
    </div>
  )
}
