"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { CanvasObject } from './sign-builder-types'
import { calculatePrice } from './sign-builder-types'

interface SignBuilderState {
  // Canvas state
  objects: CanvasObject[]
  selectedObjectId: string | null
  canvasWidth: number
  canvasHeight: number
  zoom: number
  showGrid: boolean
  showRulers: boolean
  
  // Product options
  quantity: number
  sides: 1 | 2
  holeOption: 'none' | '2-top' | '4-corner' | 'custom'
  material: 'aluminum' | 'acrylic' | 'pvc' | 'coroplast'
  
  // UI state
  activePanel: string
  activeSide: 'front' | 'back'
  backObjects: CanvasObject[]
  
  // History
  history: CanvasObject[][]
  historyIndex: number
  
  // Price
  price: number
}

interface SignBuilderContextValue extends SignBuilderState {
  // Object operations
  addObject: (obj: Omit<CanvasObject, 'id' | 'zIndex'>) => void
  updateObject: (id: string, updates: Partial<CanvasObject>) => void
  deleteObject: (id: string) => void
  duplicateObject: (id: string) => void
  selectObject: (id: string | null) => void
  moveObjectLayer: (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => void
  clearCanvas: () => void
  
  // Canvas operations
  setCanvasSize: (width: number, height: number) => void
  setZoom: (zoom: number) => void
  toggleGrid: () => void
  toggleRulers: () => void
  
  // Product operations
  setQuantity: (qty: number) => void
  setSides: (sides: 1 | 2) => void
  setHoleOption: (option: 'none' | '2-top' | '4-corner' | 'custom') => void
  setMaterial: (material: 'aluminum' | 'acrylic' | 'pvc' | 'coroplast') => void
  
  // UI operations
  setActivePanel: (panel: string) => void
  setActiveSide: (side: 'front' | 'back') => void
  
  // History
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  
  // Template
  applyTemplate: (objects: CanvasObject[], width: number, height: number) => void
  
  // Export
  getDesignData: () => { front: CanvasObject[], back: CanvasObject[], width: number, height: number }
}

const SignBuilderContext = createContext<SignBuilderContextValue | null>(null)

export function SignBuilderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SignBuilderState>({
    objects: [],
    selectedObjectId: null,
    canvasWidth: 24,
    canvasHeight: 18,
    zoom: 1,
    showGrid: false,
    showRulers: false,
    quantity: 1,
    sides: 1,
    holeOption: 'none',
    material: 'aluminum',
    activePanel: 'product',
    activeSide: 'front',
    backObjects: [],
    history: [[]],
    historyIndex: 0,
    price: calculatePrice(24, 18, 1),
  })

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const saveToHistory = useCallback((newObjects: CanvasObject[]) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1)
      newHistory.push([...newObjects])
      return {
        ...prev,
        history: newHistory.slice(-50), // Keep last 50 states
        historyIndex: Math.min(newHistory.length - 1, 49),
      }
    })
  }, [])

  const addObject = useCallback((obj: Omit<CanvasObject, 'id' | 'zIndex'>) => {
    setState(prev => {
      const currentObjects = prev.activeSide === 'front' ? prev.objects : prev.backObjects
      const newObject: CanvasObject = {
        ...obj,
        id: generateId(),
        zIndex: currentObjects.length,
      }
      const newObjects = [...currentObjects, newObject]
      
      if (prev.activeSide === 'front') {
        saveToHistory(newObjects)
        return { ...prev, objects: newObjects, selectedObjectId: newObject.id }
      } else {
        return { ...prev, backObjects: newObjects, selectedObjectId: newObject.id }
      }
    })
  }, [saveToHistory])

  const updateObject = useCallback((id: string, updates: Partial<CanvasObject>) => {
    setState(prev => {
      const currentObjects = prev.activeSide === 'front' ? prev.objects : prev.backObjects
      const newObjects = currentObjects.map(obj =>
        obj.id === id ? { ...obj, ...updates } : obj
      )
      
      if (prev.activeSide === 'front') {
        return { ...prev, objects: newObjects }
      } else {
        return { ...prev, backObjects: newObjects }
      }
    })
  }, [])

  const deleteObject = useCallback((id: string) => {
    setState(prev => {
      const currentObjects = prev.activeSide === 'front' ? prev.objects : prev.backObjects
      const newObjects = currentObjects.filter(obj => obj.id !== id)
      
      if (prev.activeSide === 'front') {
        saveToHistory(newObjects)
        return { ...prev, objects: newObjects, selectedObjectId: null }
      } else {
        return { ...prev, backObjects: newObjects, selectedObjectId: null }
      }
    })
  }, [saveToHistory])

  const duplicateObject = useCallback((id: string) => {
    setState(prev => {
      const currentObjects = prev.activeSide === 'front' ? prev.objects : prev.backObjects
      const obj = currentObjects.find(o => o.id === id)
      if (!obj) return prev
      
      const newObject: CanvasObject = {
        ...obj,
        id: generateId(),
        x: obj.x + 1,
        y: obj.y + 1,
        zIndex: currentObjects.length,
      }
      const newObjects = [...currentObjects, newObject]
      
      if (prev.activeSide === 'front') {
        saveToHistory(newObjects)
        return { ...prev, objects: newObjects, selectedObjectId: newObject.id }
      } else {
        return { ...prev, backObjects: newObjects, selectedObjectId: newObject.id }
      }
    })
  }, [saveToHistory])

  const selectObject = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedObjectId: id }))
  }, [])

  const moveObjectLayer = useCallback((id: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
    setState(prev => {
      const currentObjects = prev.activeSide === 'front' ? prev.objects : prev.backObjects
      const sorted = [...currentObjects].sort((a, b) => a.zIndex - b.zIndex)
      const index = sorted.findIndex(o => o.id === id)
      if (index === -1) return prev

      let newIndex = index
      if (direction === 'up' && index < sorted.length - 1) newIndex = index + 1
      if (direction === 'down' && index > 0) newIndex = index - 1
      if (direction === 'top') newIndex = sorted.length - 1
      if (direction === 'bottom') newIndex = 0

      const item = sorted.splice(index, 1)[0]
      sorted.splice(newIndex, 0, item)
      
      const newObjects = sorted.map((obj, i) => ({ ...obj, zIndex: i }))
      
      if (prev.activeSide === 'front') {
        return { ...prev, objects: newObjects }
      } else {
        return { ...prev, backObjects: newObjects }
      }
    })
  }, [])

  const clearCanvas = useCallback(() => {
    setState(prev => {
      if (prev.activeSide === 'front') {
        saveToHistory([])
        return { ...prev, objects: [], selectedObjectId: null }
      } else {
        return { ...prev, backObjects: [], selectedObjectId: null }
      }
    })
  }, [saveToHistory])

  const scaleObjectsForCanvas = useCallback((objs: CanvasObject[], scaleX: number, scaleY: number) => {
    const scale = (scaleX + scaleY) / 2
    return objs.map(obj => ({
      ...obj,
      x: obj.x * scaleX,
      y: obj.y * scaleY,
      width: obj.width * scaleX,
      height: obj.height * scaleY,
      fontSize: obj.fontSize != null ? obj.fontSize * scale : obj.fontSize,
      letterSpacing: obj.letterSpacing != null ? obj.letterSpacing * scale : obj.letterSpacing,
      strokeWidth: obj.strokeWidth != null ? obj.strokeWidth * scale : obj.strokeWidth,
      cornerRadius: obj.cornerRadius != null ? obj.cornerRadius * scale : obj.cornerRadius,
      borderRadius: obj.borderRadius != null ? obj.borderRadius * scale : obj.borderRadius,
      cellPadding: obj.cellPadding != null ? obj.cellPadding * scale : obj.cellPadding,
    }))
  }, [])

  const setCanvasSize = useCallback((width: number, height: number) => {
    setState(prev => {
      const safePrevWidth = Math.max(0.01, prev.canvasWidth)
      const safePrevHeight = Math.max(0.01, prev.canvasHeight)
      const scaleX = width / safePrevWidth
      const scaleY = height / safePrevHeight
      return {
        ...prev,
        canvasWidth: width,
        canvasHeight: height,
        objects: scaleObjectsForCanvas(prev.objects, scaleX, scaleY),
        backObjects: scaleObjectsForCanvas(prev.backObjects, scaleX, scaleY),
        price: calculatePrice(width, height, prev.quantity),
      }
    })
  }, [scaleObjectsForCanvas])

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom: Math.max(0.25, Math.min(3, zoom)) }))
  }, [])

  const toggleGrid = useCallback(() => {
    setState(prev => ({ ...prev, showGrid: !prev.showGrid }))
  }, [])

  const toggleRulers = useCallback(() => {
    setState(prev => ({ ...prev, showRulers: !prev.showRulers }))
  }, [])

  const setQuantity = useCallback((qty: number) => {
    setState(prev => ({
      ...prev,
      quantity: Math.max(1, qty),
      price: calculatePrice(prev.canvasWidth, prev.canvasHeight, Math.max(1, qty)),
    }))
  }, [])

  const setSides = useCallback((sides: 1 | 2) => {
    setState(prev => ({ ...prev, sides }))
  }, [])

  const setHoleOption = useCallback((option: 'none' | '2-top' | '4-corner' | 'custom') => {
    setState(prev => ({ ...prev, holeOption: option }))
  }, [])

  const setMaterial = useCallback((material: 'aluminum' | 'acrylic' | 'pvc' | 'coroplast') => {
    setState(prev => ({ ...prev, material }))
  }, [])

  const setActivePanel = useCallback((panel: string) => {
    setState(prev => ({ ...prev, activePanel: panel }))
  }, [])

  const setActiveSide = useCallback((side: 'front' | 'back') => {
    setState(prev => ({ ...prev, activeSide: side, selectedObjectId: null }))
  }, [])

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex <= 0) return prev
      const newIndex = prev.historyIndex - 1
      return {
        ...prev,
        objects: [...prev.history[newIndex]],
        historyIndex: newIndex,
        selectedObjectId: null,
      }
    })
  }, [])

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex >= prev.history.length - 1) return prev
      const newIndex = prev.historyIndex + 1
      return {
        ...prev,
        objects: [...prev.history[newIndex]],
        historyIndex: newIndex,
        selectedObjectId: null,
      }
    })
  }, [])

  const applyTemplate = useCallback((objects: CanvasObject[], width: number, height: number) => {
    const newObjects = objects.map(obj => ({ ...obj, id: generateId() }))
    setState(prev => ({
      ...prev,
      objects: newObjects,
      canvasWidth: width,
      canvasHeight: height,
      selectedObjectId: null,
      price: calculatePrice(width, height, prev.quantity),
    }))
    saveToHistory(newObjects)
  }, [saveToHistory])

  const getDesignData = useCallback(() => ({
    front: state.objects,
    back: state.backObjects,
    width: state.canvasWidth,
    height: state.canvasHeight,
  }), [state.objects, state.backObjects, state.canvasWidth, state.canvasHeight])

  const value: SignBuilderContextValue = {
    ...state,
    addObject,
    updateObject,
    deleteObject,
    duplicateObject,
    selectObject,
    moveObjectLayer,
    clearCanvas,
    setCanvasSize,
    setZoom,
    toggleGrid,
    toggleRulers,
    setQuantity,
    setSides,
    setHoleOption,
    setMaterial,
    setActivePanel,
    setActiveSide,
    undo,
    redo,
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
    applyTemplate,
    getDesignData,
  }

  return (
    <SignBuilderContext.Provider value={value}>
      {children}
    </SignBuilderContext.Provider>
  )
}

export function useSignBuilder() {
  const context = useContext(SignBuilderContext)
  if (!context) {
    throw new Error('useSignBuilder must be used within SignBuilderProvider')
  }
  return context
}
