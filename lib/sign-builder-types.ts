export interface CanvasObject {
  id: string
  type: 'text' | 'image' | 'shape' | 'qrcode' | 'table' | 'icon'
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  locked: boolean
  zIndex: number
  // Text properties
  text?: string
  fontFamily?: string
  fontSize?: number
  fontWeight?: string
  fontStyle?: string
  textDecoration?: string
  textAlign?: 'left' | 'center' | 'right'
  verticalAlign?: 'top' | 'middle' | 'bottom'
  textColor?: string
  backgroundColor?: string
  letterSpacing?: number
  lineHeight?: number
  // Image properties
  src?: string
  flipH?: boolean
  flipV?: boolean
  borderRadius?: number
  shadow?: boolean
  iconName?: string
  // Shape properties
  shapeType?: 'rectangle' | 'circle' | 'triangle' | 'line' | 'arrow' | 'star' | 'polygon' | 'rounded-rectangle' | 'prohibition' | 'warning-triangle'
  fill?: string
  stroke?: string
  strokeWidth?: number
  sides?: number
  cornerRadius?: number
  // QR Code properties
  qrData?: string
  // Table properties
  rows?: number
  cols?: number
  cellData?: string[][]
  cellPadding?: number
  borderColor?: string
}

export interface Template {
  id: string
  name: string
  category: string
  thumbnail: string
  objects: CanvasObject[]
  canvasWidth: number
  canvasHeight: number
}

export interface PricingTier {
  minArea: number
  maxArea: number
  pricePerSqInch: number
}

export const PRICING_TIERS: PricingTier[] = [
  { minArea: 0, maxArea: 100, pricePerSqInch: 0.15 },
  { minArea: 100, maxArea: 500, pricePerSqInch: 0.12 },
  { minArea: 500, maxArea: 1000, pricePerSqInch: 0.10 },
  { minArea: 1000, maxArea: 5000, pricePerSqInch: 0.08 },
  { minArea: 5000, maxArea: Infinity, pricePerSqInch: 0.06 },
]

export const BASE_PRICE = 9.99

export function calculatePrice(width: number, height: number, quantity: number): number {
  const area = width * height
  const tier = PRICING_TIERS.find(t => area >= t.minArea && area < t.maxArea) || PRICING_TIERS[PRICING_TIERS.length - 1]
  const baseSignPrice = BASE_PRICE + (area * tier.pricePerSqInch)
  // Volume discount
  let discount = 1
  if (quantity >= 10) discount = 0.9
  if (quantity >= 25) discount = 0.85
  if (quantity >= 50) discount = 0.8
  if (quantity >= 100) discount = 0.75
  return Math.round(baseSignPrice * quantity * discount * 100) / 100
}

export const GOOGLE_FONTS = [
  'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Raleway', 
  'Poppins', 'Playfair Display', 'Merriweather', 'Ubuntu', 'Nunito',
  'Inter', 'Work Sans', 'Quicksand', 'Bebas Neue', 'Anton', 'Lobster',
  'Pacifico', 'Dancing Script', 'Satisfy', 'Great Vibes', 'Permanent Marker',
  'Bangers', 'Righteous', 'Russo One', 'Archivo Black', 'Black Ops One'
]

export const ICON_CATEGORIES = [
  { id: 'arrows', name: 'Arrows', prefix: 'arrow' },
  { id: 'business', name: 'Business', prefix: 'briefcase' },
  { id: 'communication', name: 'Communication', prefix: 'message' },
  { id: 'design', name: 'Design', prefix: 'palette' },
  { id: 'devices', name: 'Devices', prefix: 'monitor' },
  { id: 'files', name: 'Files', prefix: 'file' },
  { id: 'food', name: 'Food', prefix: 'utensils' },
  { id: 'health', name: 'Health', prefix: 'heart' },
  { id: 'home', name: 'Home', prefix: 'home' },
  { id: 'media', name: 'Media', prefix: 'play' },
  { id: 'nature', name: 'Nature', prefix: 'leaf' },
  { id: 'people', name: 'People', prefix: 'user' },
  { id: 'shopping', name: 'Shopping', prefix: 'shopping' },
  { id: 'social', name: 'Social', prefix: 'share' },
  { id: 'sports', name: 'Sports', prefix: 'trophy' },
  { id: 'transport', name: 'Transport', prefix: 'car' },
  { id: 'weather', name: 'Weather', prefix: 'sun' },
  { id: 'symbols', name: 'Symbols', prefix: 'star' },
]
