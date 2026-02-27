import type { Template } from './sign-builder-types'

export const SIGN_TEMPLATES: Template[] = [
  // CAUTION Signs
  {
    id: 'caution-do-not-step',
    name: 'Caution Do Not Step',
    category: 'Caution',
    thumbnail: '',
    canvasWidth: 18,
    canvasHeight: 24,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 9, y: 12, width: 18, height: 24, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#ffffff', stroke: '#000000', strokeWidth: 2 },
      { id: '2', type: 'shape', shapeType: 'rectangle', x: 9, y: 3, width: 16, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 1, fill: '#facc15', stroke: '#000000', strokeWidth: 1 },
      { id: '3', type: 'shape', shapeType: 'warning-triangle', x: 2.5, y: 3, width: 2.5, height: 2.5, rotation: 0, opacity: 1, locked: false, zIndex: 2, fill: '#facc15', stroke: '#000000', strokeWidth: 1 },
      { id: '4', type: 'text', text: 'CAUTION', x: 10, y: 3, width: 12, height: 3, rotation: 0, opacity: 1, locked: false, zIndex: 3, fontFamily: 'Arial Black', fontSize: 36, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle' },
      { id: '5', type: 'text', text: 'DO NOT STEP\nOR STAND ON\nTHIS SURFACE', x: 9, y: 11, width: 14, height: 6, rotation: 0, opacity: 1, locked: false, zIndex: 4, fontFamily: 'Arial', fontSize: 22, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.3 },
      { id: '6', type: 'shape', shapeType: 'prohibition', x: 13.5, y: 11, width: 5, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 5, fill: 'transparent', stroke: '#dc2626', strokeWidth: 3 },
    ]
  },
  {
    id: 'caution-wet-floor',
    name: 'Caution Wet Floor',
    category: 'Caution',
    thumbnail: '',
    canvasWidth: 24,
    canvasHeight: 18,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 12, y: 9, width: 24, height: 18, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#facc15', stroke: '#000000', strokeWidth: 3 },
      { id: '2', type: 'text', text: 'CAUTION', x: 12, y: 4, width: 20, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 1, fontFamily: 'Arial Black', fontSize: 48, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle' },
      { id: '3', type: 'text', text: 'WET FLOOR', x: 12, y: 12, width: 20, height: 6, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 42, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle' },
    ]
  },
  {
    id: 'caution-dust-mask',
    name: 'Caution Dust Mask Required',
    category: 'Caution',
    thumbnail: '',
    canvasWidth: 24,
    canvasHeight: 18,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 12, y: 9, width: 24, height: 18, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#dc2626', stroke: '#000000', strokeWidth: 0 },
      { id: '2', type: 'shape', shapeType: 'rectangle', x: 12, y: 12, width: 22, height: 10, rotation: 0, opacity: 1, locked: false, zIndex: 1, fill: '#facc15', stroke: '#000000', strokeWidth: 0 },
      { id: '3', type: 'text', text: 'CAUTION', x: 12, y: 3, width: 20, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 42, fontWeight: 'bold', textColor: '#ffffff', textAlign: 'center', verticalAlign: 'middle' },
      { id: '4', type: 'text', text: 'DUST MASK\nREQUIRED', x: 12, y: 12, width: 18, height: 8, rotation: 0, opacity: 1, locked: false, zIndex: 3, fontFamily: 'Arial Black', fontSize: 36, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.2 },
    ]
  },
  {
    id: 'caution-uv-light',
    name: 'Caution UV Light',
    category: 'Caution',
    thumbnail: '',
    canvasWidth: 24,
    canvasHeight: 18,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 12, y: 9, width: 24, height: 18, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#facc15', stroke: '#000000', strokeWidth: 0 },
      { id: '2', type: 'shape', shapeType: 'rectangle', x: 12, y: 4, width: 22, height: 6, rotation: 0, opacity: 1, locked: false, zIndex: 1, fill: '#dc2626', stroke: '#000000', strokeWidth: 0 },
      { id: '3', type: 'text', text: 'CAUTION', x: 12, y: 4, width: 20, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 42, fontWeight: 'bold', textColor: '#ffffff', textAlign: 'center', verticalAlign: 'middle' },
      { id: '4', type: 'text', text: 'UV LIGHT', x: 12, y: 10, width: 18, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 3, fontFamily: 'Arial Black', fontSize: 48, fontWeight: 'bold', textColor: '#dc2626', textAlign: 'center', verticalAlign: 'middle' },
      { id: '5', type: 'text', text: 'DO NOT LOOK\nDIRECTLY AT LIGHT', x: 12, y: 15, width: 18, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 4, fontFamily: 'Arial', fontSize: 18, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.2 },
    ]
  },
  {
    id: 'caution-non-potable',
    name: 'Caution Non-Potable Water',
    category: 'Caution',
    thumbnail: '',
    canvasWidth: 18,
    canvasHeight: 24,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 9, y: 12, width: 18, height: 24, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#ffffff', stroke: '#dc2626', strokeWidth: 4 },
      { id: '2', type: 'shape', shapeType: 'rectangle', x: 9, y: 3.5, width: 16, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 1, fill: '#dc2626', stroke: '', strokeWidth: 0 },
      { id: '3', type: 'shape', shapeType: 'warning-triangle', x: 2.5, y: 3.5, width: 2.5, height: 2.5, rotation: 0, opacity: 1, locked: false, zIndex: 2, fill: '#facc15', stroke: '#000000', strokeWidth: 1 },
      { id: '4', type: 'text', text: 'CAUTION', x: 10.5, y: 3.5, width: 11, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 3, fontFamily: 'Arial Black', fontSize: 32, fontWeight: 'bold', textColor: '#ffffff', textAlign: 'center', verticalAlign: 'middle' },
      { id: '5', type: 'text', text: 'NON-POTABLE\nWATER DO NOT\nDRINK', x: 9, y: 13, width: 14, height: 6, rotation: 0, opacity: 1, locked: false, zIndex: 4, fontFamily: 'Arial', fontSize: 20, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.3 },
      { id: '6', type: 'shape', shapeType: 'prohibition', x: 9, y: 18, width: 5, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 5, fill: 'transparent', stroke: '#dc2626', strokeWidth: 3 },
    ]
  },
  {
    id: 'caution-use-at-risk',
    name: 'Caution Use At Own Risk',
    category: 'Caution',
    thumbnail: '',
    canvasWidth: 24,
    canvasHeight: 18,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 12, y: 9, width: 24, height: 18, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#000000', stroke: '', strokeWidth: 0 },
      { id: '2', type: 'shape', shapeType: 'rectangle', x: 12, y: 9, width: 22, height: 16, rotation: 0, opacity: 1, locked: false, zIndex: 1, fill: '#facc15', stroke: '', strokeWidth: 0 },
      { id: '3', type: 'text', text: 'CAUTION', x: 12, y: 5, width: 18, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 48, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle' },
      { id: '4', type: 'text', text: 'USE AT YOUR\nOWN RISK', x: 12, y: 12, width: 18, height: 6, rotation: 0, opacity: 1, locked: false, zIndex: 3, fontFamily: 'Arial Black', fontSize: 36, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.2 },
    ]
  },

  // WARNING Signs
  {
    id: 'warning-barbed-wire',
    name: 'Warning Barbed Wire',
    category: 'Warning',
    thumbnail: '',
    canvasWidth: 18,
    canvasHeight: 24,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 9, y: 12, width: 18, height: 24, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#ffffff', stroke: '#dc2626', strokeWidth: 4 },
      { id: '2', type: 'shape', shapeType: 'rectangle', x: 9, y: 3.5, width: 16, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 1, fill: '#dc2626', stroke: '', strokeWidth: 0 },
      { id: '3', type: 'text', text: 'WARNING', x: 9, y: 3.5, width: 14, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 32, fontWeight: 'bold', textColor: '#ffffff', textAlign: 'center', verticalAlign: 'middle' },
      { id: '4', type: 'shape', shapeType: 'warning-triangle', x: 9, y: 13, width: 8, height: 8, rotation: 0, opacity: 1, locked: false, zIndex: 3, fill: '#facc15', stroke: '#000000', strokeWidth: 2 },
      { id: '5', type: 'text', text: 'BARBED\nWIRE', x: 9, y: 20, width: 14, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 4, fontFamily: 'Arial Black', fontSize: 24, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.2 },
    ]
  },
  {
    id: 'warning-safety-vest',
    name: 'Warning Safety Vest Required',
    category: 'Warning',
    thumbnail: '',
    canvasWidth: 24,
    canvasHeight: 18,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 12, y: 9, width: 24, height: 18, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#ffffff', stroke: '#000000', strokeWidth: 2 },
      { id: '2', type: 'shape', shapeType: 'rectangle', x: 12, y: 3.5, width: 22, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 1, fill: '#facc15', stroke: '#000000', strokeWidth: 0 },
      { id: '3', type: 'shape', shapeType: 'warning-triangle', x: 2.5, y: 3.5, width: 3, height: 3, rotation: 0, opacity: 1, locked: false, zIndex: 2, fill: '#facc15', stroke: '#000000', strokeWidth: 1 },
      { id: '4', type: 'text', text: 'WARNING', x: 13, y: 3.5, width: 16, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 3, fontFamily: 'Arial Black', fontSize: 36, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle' },
      { id: '5', type: 'text', text: 'REFLECTIVE\nSAFETY VEST\nREQUIRED', x: 9, y: 12, width: 12, height: 8, rotation: 0, opacity: 1, locked: false, zIndex: 4, fontFamily: 'Arial', fontSize: 20, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.3 },
    ]
  },

  // NOTICE Signs
  {
    id: 'notice-safety-glasses',
    name: 'Notice Safety Glasses Required',
    category: 'Notice',
    thumbnail: '',
    canvasWidth: 24,
    canvasHeight: 18,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 12, y: 9, width: 24, height: 18, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#ffffff', stroke: '#000000', strokeWidth: 2 },
      { id: '2', type: 'shape', shapeType: 'rectangle', x: 12, y: 3.5, width: 22, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 1, fill: '#2563eb', stroke: '', strokeWidth: 0 },
      { id: '3', type: 'text', text: 'NOTICE', x: 12, y: 3.5, width: 18, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 36, fontWeight: 'bold', textColor: '#ffffff', textAlign: 'center', verticalAlign: 'middle' },
      { id: '4', type: 'text', text: 'SAFETY GLASSES,\nVEST & HARD HAT\nREQUIRED', x: 12, y: 12, width: 20, height: 8, rotation: 0, opacity: 1, locked: false, zIndex: 3, fontFamily: 'Arial', fontSize: 20, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.3 },
    ]
  },
  {
    id: 'notice-security-cameras',
    name: 'Notice Security Cameras',
    category: 'Notice',
    thumbnail: '',
    canvasWidth: 18,
    canvasHeight: 24,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 9, y: 12, width: 18, height: 24, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#ffffff', stroke: '#dc2626', strokeWidth: 4 },
      { id: '2', type: 'shape', shapeType: 'rectangle', x: 9, y: 3.5, width: 16, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 1, fill: '#dc2626', stroke: '', strokeWidth: 0 },
      { id: '3', type: 'text', text: 'NOTICE', x: 9, y: 3.5, width: 14, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 32, fontWeight: 'bold', textColor: '#ffffff', textAlign: 'center', verticalAlign: 'middle' },
      { id: '4', type: 'text', text: 'SECURITY\nCAMERAS\nIN USE', x: 9, y: 15, width: 14, height: 8, rotation: 0, opacity: 1, locked: false, zIndex: 3, fontFamily: 'Arial Black', fontSize: 24, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.2 },
    ]
  },

  // EMERGENCY Signs
  {
    id: 'emergency-exit',
    name: 'Emergency Exit',
    category: 'Emergency',
    thumbnail: '',
    canvasWidth: 24,
    canvasHeight: 18,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rounded-rectangle', x: 12, y: 9, width: 24, height: 18, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#7f1d1d', stroke: '#ffffff', strokeWidth: 2, cornerRadius: 8 },
      { id: '2', type: 'text', text: 'EXIT', x: 12, y: 9, width: 20, height: 12, rotation: 0, opacity: 1, locked: false, zIndex: 1, fontFamily: 'Arial Black', fontSize: 72, fontWeight: 'bold', textColor: '#ffffff', textAlign: 'center', verticalAlign: 'middle' },
      { id: '3', type: 'shape', shapeType: 'arrow', x: 18, y: 9, width: 5, height: 2, rotation: 0, opacity: 1, locked: false, zIndex: 2, fill: '#fbbf24', stroke: '#fbbf24', strokeWidth: 3 },
    ]
  },
  {
    id: 'emergency-oxygen',
    name: 'Emergency Oxygen',
    category: 'Emergency',
    thumbnail: '',
    canvasWidth: 24,
    canvasHeight: 18,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 12, y: 9, width: 24, height: 18, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#facc15', stroke: '', strokeWidth: 0 },
      { id: '2', type: 'shape', shapeType: 'rectangle', x: 12, y: 4, width: 22, height: 6, rotation: 0, opacity: 1, locked: false, zIndex: 1, fill: '#dc2626', stroke: '', strokeWidth: 0 },
      { id: '3', type: 'text', text: 'EMERGENCY', x: 12, y: 4, width: 20, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 36, fontWeight: 'bold', textColor: '#ffffff', textAlign: 'center', verticalAlign: 'middle' },
      { id: '4', type: 'text', text: 'EMERGENCY\nOXYGEN', x: 12, y: 13, width: 18, height: 6, rotation: 0, opacity: 1, locked: false, zIndex: 3, fontFamily: 'Arial Black', fontSize: 28, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.2 },
    ]
  },
  {
    id: 'emergency-shut-off',
    name: 'Emergency Shut Off Switch',
    category: 'Emergency',
    thumbnail: '',
    canvasWidth: 24,
    canvasHeight: 18,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rounded-rectangle', x: 12, y: 9, width: 24, height: 18, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#ffffff', stroke: '#000000', strokeWidth: 2, cornerRadius: 8 },
      { id: '2', type: 'text', text: 'EMERGENCY', x: 12, y: 4, width: 20, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 1, fontFamily: 'Arial Black', fontSize: 36, fontWeight: 'bold', textColor: '#dc2626', textAlign: 'center', verticalAlign: 'middle' },
      { id: '3', type: 'text', text: 'SHUT OFF SWITCH', x: 12, y: 10, width: 20, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 26, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle' },
      { id: '4', type: 'shape', shapeType: 'arrow', x: 12, y: 15, width: 8, height: 2, rotation: 90, opacity: 1, locked: false, zIndex: 3, fill: '#dc2626', stroke: '#dc2626', strokeWidth: 3 },
    ]
  },
  {
    id: 'emergency-use-only',
    name: 'For Emergency Use Only',
    category: 'Emergency',
    thumbnail: '',
    canvasWidth: 24,
    canvasHeight: 18,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rounded-rectangle', x: 12, y: 9, width: 24, height: 18, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#ffffff', stroke: '#000000', strokeWidth: 3, cornerRadius: 12 },
      { id: '2', type: 'text', text: 'FOR', x: 12, y: 4, width: 18, height: 3, rotation: 0, opacity: 1, locked: false, zIndex: 1, fontFamily: 'Arial Black', fontSize: 32, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle' },
      { id: '3', type: 'text', text: 'EMERGENCY', x: 12, y: 9, width: 20, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 48, fontWeight: 'bold', textColor: '#dc2626', textAlign: 'center', verticalAlign: 'middle' },
      { id: '4', type: 'text', text: 'USE ONLY', x: 12, y: 14, width: 18, height: 3, rotation: 0, opacity: 1, locked: false, zIndex: 3, fontFamily: 'Arial Black', fontSize: 32, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle' },
    ]
  },

  // FIRE EXIT Signs
  {
    id: 'fire-exit-do-not-block',
    name: 'Fire Exit Do Not Block',
    category: 'Fire Safety',
    thumbnail: '',
    canvasWidth: 18,
    canvasHeight: 24,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 9, y: 12, width: 18, height: 24, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#ffffff', stroke: '#dc2626', strokeWidth: 4 },
      { id: '2', type: 'shape', shapeType: 'rectangle', x: 9, y: 3.5, width: 16, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 1, fill: '#dc2626', stroke: '', strokeWidth: 0 },
      { id: '3', type: 'text', text: 'FIRE EXIT', x: 9, y: 3.5, width: 14, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 28, fontWeight: 'bold', textColor: '#ffffff', textAlign: 'center', verticalAlign: 'middle' },
      { id: '4', type: 'shape', shapeType: 'polygon', sides: 8, x: 9, y: 11, width: 8, height: 8, rotation: 22.5, opacity: 1, locked: false, zIndex: 3, fill: '#dc2626', stroke: '', strokeWidth: 0 },
      { id: '5', type: 'text', text: 'DO NOT\nBLOCK', x: 9, y: 11, width: 7, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 4, fontFamily: 'Arial Black', fontSize: 14, fontWeight: 'bold', textColor: '#ffffff', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.1 },
      { id: '6', type: 'text', text: 'KEEP CLEAR\nAT ALL TIMES', x: 9, y: 19, width: 14, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 5, fontFamily: 'Arial', fontSize: 16, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.2 },
    ]
  },
  {
    id: 'fire-assembly-point',
    name: 'Fire Assembly Point',
    category: 'Fire Safety',
    thumbnail: '',
    canvasWidth: 24,
    canvasHeight: 18,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rounded-rectangle', x: 12, y: 9, width: 24, height: 18, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#ffffff', stroke: '#000000', strokeWidth: 2, cornerRadius: 8 },
      { id: '2', type: 'text', text: 'FIRE ASSEMBLY', x: 12, y: 4, width: 20, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 1, fontFamily: 'Arial Black', fontSize: 28, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle' },
      { id: '3', type: 'text', text: 'POINT', x: 12, y: 10, width: 18, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 42, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle' },
      { id: '4', type: 'shape', shapeType: 'arrow', x: 6, y: 15, width: 6, height: 2, rotation: 180, opacity: 1, locked: false, zIndex: 3, fill: '#dc2626', stroke: '#dc2626', strokeWidth: 3 },
      { id: '5', type: 'shape', shapeType: 'arrow', x: 18, y: 15, width: 6, height: 2, rotation: 0, opacity: 1, locked: false, zIndex: 4, fill: '#dc2626', stroke: '#dc2626', strokeWidth: 3 },
    ]
  },

  // ATTENTION Signs
  {
    id: 'attention-no-children',
    name: 'Attention No Children',
    category: 'Attention',
    thumbnail: '',
    canvasWidth: 18,
    canvasHeight: 24,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rounded-rectangle', x: 9, y: 12, width: 18, height: 24, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#f59e0b', stroke: '#000000', strokeWidth: 0, cornerRadius: 8 },
      { id: '2', type: 'shape', shapeType: 'rectangle', x: 9, y: 3.5, width: 16, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 1, fill: '#dc2626', stroke: '', strokeWidth: 0 },
      { id: '3', type: 'text', text: 'ATTENTION', x: 9, y: 3.5, width: 14, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 24, fontWeight: 'bold', textColor: '#ffffff', textAlign: 'center', verticalAlign: 'middle' },
      { id: '4', type: 'shape', shapeType: 'prohibition', x: 9, y: 12, width: 8, height: 8, rotation: 0, opacity: 1, locked: false, zIndex: 3, fill: 'transparent', stroke: '#dc2626', strokeWidth: 4 },
      { id: '5', type: 'text', text: 'NO\nCHILDREN', x: 9, y: 20, width: 14, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 4, fontFamily: 'Arial Black', fontSize: 22, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.1 },
    ]
  },
  {
    id: 'attention-school-bus',
    name: 'Attention School Bus Stop',
    category: 'Attention',
    thumbnail: '',
    canvasWidth: 24,
    canvasHeight: 18,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 12, y: 9, width: 24, height: 18, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#ffffff', stroke: '#2563eb', strokeWidth: 4 },
      { id: '2', type: 'shape', shapeType: 'rectangle', x: 12, y: 4, width: 22, height: 6, rotation: 0, opacity: 1, locked: false, zIndex: 1, fill: '#dc2626', stroke: '', strokeWidth: 0 },
      { id: '3', type: 'text', text: 'ATTENTION', x: 12, y: 4, width: 20, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 36, fontWeight: 'bold', textColor: '#ffffff', textAlign: 'center', verticalAlign: 'middle' },
      { id: '4', type: 'text', text: 'SCHOOL BUS\nSTOP AHEAD', x: 12, y: 13, width: 20, height: 6, rotation: 0, opacity: 1, locked: false, zIndex: 3, fontFamily: 'Arial Black', fontSize: 28, fontWeight: 'bold', textColor: '#2563eb', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.2 },
    ]
  },
  {
    id: 'attention-stay-off-fields',
    name: 'Attention Stay Off Fields',
    category: 'Attention',
    thumbnail: '',
    canvasWidth: 18,
    canvasHeight: 24,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 9, y: 12, width: 18, height: 24, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#ffffff', stroke: '#dc2626', strokeWidth: 4 },
      { id: '2', type: 'shape', shapeType: 'rectangle', x: 9, y: 3.5, width: 16, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 1, fill: '#dc2626', stroke: '', strokeWidth: 0 },
      { id: '3', type: 'text', text: 'ATTENTION', x: 9, y: 3.5, width: 14, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 24, fontWeight: 'bold', textColor: '#ffffff', textAlign: 'center', verticalAlign: 'middle' },
      { id: '4', type: 'shape', shapeType: 'rectangle', x: 9, y: 10, width: 14, height: 6, rotation: 0, opacity: 1, locked: false, zIndex: 3, fill: '#facc15', stroke: '', strokeWidth: 0 },
      { id: '5', type: 'text', text: 'PLEASE STAY OFF\nOF THE FIELDS', x: 9, y: 10, width: 13, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 4, fontFamily: 'Arial Black', fontSize: 16, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.2 },
      { id: '6', type: 'text', text: 'RESERVED FOR SCHOOL\nACTIVITIES ONLY', x: 9, y: 18, width: 14, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 5, fontFamily: 'Arial', fontSize: 14, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.2 },
    ]
  },

  // KEEP CLEAR Signs
  {
    id: 'keep-clear-do-not-block',
    name: 'Keep Clear Do Not Block',
    category: 'Safety',
    thumbnail: '',
    canvasWidth: 18,
    canvasHeight: 24,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 9, y: 12, width: 18, height: 24, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#facc15', stroke: '#000000', strokeWidth: 2 },
      { id: '2', type: 'text', text: 'KEEP CLEAR', x: 9, y: 3, width: 16, height: 3, rotation: 0, opacity: 1, locked: false, zIndex: 1, fontFamily: 'Arial Black', fontSize: 26, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle' },
      { id: '3', type: 'shape', shapeType: 'polygon', sides: 8, x: 9, y: 10, width: 9, height: 9, rotation: 22.5, opacity: 1, locked: false, zIndex: 2, fill: '#dc2626', stroke: '', strokeWidth: 0 },
      { id: '4', type: 'text', text: 'DO NOT\nBLOCK', x: 9, y: 10, width: 8, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 3, fontFamily: 'Arial Black', fontSize: 14, fontWeight: 'bold', textColor: '#ffffff', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.1 },
      { id: '5', type: 'text', text: 'EMERGENCY\nEQUIPMENT', x: 9, y: 19, width: 14, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 4, fontFamily: 'Arial Black', fontSize: 18, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.2 },
    ]
  },

  // RESTRICTED Signs
  {
    id: 'restricted-do-not-enter',
    name: 'Restricted Do Not Enter',
    category: 'Restricted',
    thumbnail: '',
    canvasWidth: 18,
    canvasHeight: 24,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 9, y: 5, width: 16, height: 8, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#dc2626', stroke: '', strokeWidth: 0 },
      { id: '2', type: 'shape', shapeType: 'rectangle', x: 9, y: 16, width: 16, height: 14, rotation: 0, opacity: 1, locked: false, zIndex: 1, fill: '#facc15', stroke: '', strokeWidth: 0 },
      { id: '3', type: 'text', text: 'RESTRICTED\nAREA', x: 9, y: 5, width: 14, height: 6, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 22, fontWeight: 'bold', textColor: '#ffffff', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.1 },
      { id: '4', type: 'text', text: 'DO\nNOT\nENTER', x: 9, y: 16, width: 14, height: 10, rotation: 0, opacity: 1, locked: false, zIndex: 3, fontFamily: 'Arial Black', fontSize: 32, fontWeight: 'bold', textColor: '#dc2626', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.1 },
    ]
  },

  // NO Signs
  {
    id: 'no-photography',
    name: 'No Photography',
    category: 'Prohibition',
    thumbnail: '',
    canvasWidth: 18,
    canvasHeight: 24,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 9, y: 12, width: 18, height: 24, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#facc15', stroke: '#000000', strokeWidth: 0 },
      { id: '2', type: 'shape', shapeType: 'prohibition', x: 9, y: 8, width: 10, height: 10, rotation: 0, opacity: 1, locked: false, zIndex: 1, fill: 'transparent', stroke: '#dc2626', strokeWidth: 4 },
      { id: '3', type: 'text', text: 'NO', x: 9, y: 17, width: 14, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 48, fontWeight: 'bold', textColor: '#dc2626', textAlign: 'center', verticalAlign: 'middle' },
      { id: '4', type: 'text', text: 'PHOTOGRAPHY\nNO VIDEO\nRECORDING', x: 9, y: 22, width: 14, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 3, fontFamily: 'Arial Black', fontSize: 12, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.1 },
    ]
  },
  {
    id: 'no-outside-food',
    name: 'No Outside Food or Drink',
    category: 'Prohibition',
    thumbnail: '',
    canvasWidth: 18,
    canvasHeight: 24,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 9, y: 6, width: 18, height: 12, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#22c55e', stroke: '', strokeWidth: 0 },
      { id: '2', type: 'shape', shapeType: 'rectangle', x: 9, y: 18, width: 18, height: 12, rotation: 0, opacity: 1, locked: false, zIndex: 1, fill: '#ffffff', stroke: '', strokeWidth: 0 },
      { id: '3', type: 'shape', shapeType: 'prohibition', x: 9, y: 6, width: 8, height: 8, rotation: 0, opacity: 1, locked: false, zIndex: 2, fill: 'transparent', stroke: '#dc2626', strokeWidth: 4 },
      { id: '4', type: 'text', text: 'NO', x: 9, y: 15, width: 14, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 3, fontFamily: 'Arial Black', fontSize: 48, fontWeight: 'bold', textColor: '#dc2626', textAlign: 'center', verticalAlign: 'middle' },
      { id: '5', type: 'text', text: 'OUTSIDE\nFOOD OR DRINK', x: 9, y: 21, width: 14, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 4, fontFamily: 'Arial Black', fontSize: 16, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.1 },
    ]
  },

  // VISITORS Signs
  {
    id: 'visitors-register',
    name: 'Visitors Please Register',
    category: 'Informational',
    thumbnail: '',
    canvasWidth: 18,
    canvasHeight: 24,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 9, y: 5, width: 18, height: 10, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#2563eb', stroke: '', strokeWidth: 0 },
      { id: '2', type: 'shape', shapeType: 'rectangle', x: 9, y: 17, width: 18, height: 14, rotation: 0, opacity: 1, locked: false, zIndex: 1, fill: '#ffffff', stroke: '', strokeWidth: 0 },
      { id: '3', type: 'text', text: 'VISITORS', x: 9, y: 5, width: 16, height: 8, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 36, fontWeight: 'bold', textColor: '#ffffff', textAlign: 'center', verticalAlign: 'middle' },
      { id: '4', type: 'text', text: 'PLEASE\nREGISTER\nAT OFFICE', x: 9, y: 17, width: 14, height: 10, rotation: 0, opacity: 1, locked: false, zIndex: 3, fontFamily: 'Arial Black', fontSize: 22, fontWeight: 'bold', textColor: '#2563eb', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.2 },
    ]
  },

  // PLEASE Signs
  {
    id: 'please-no-pets',
    name: 'Please No Pets',
    category: 'Informational',
    thumbnail: '',
    canvasWidth: 18,
    canvasHeight: 24,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 9, y: 4, width: 18, height: 6, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#000000', stroke: '', strokeWidth: 0 },
      { id: '2', type: 'shape', shapeType: 'rectangle', x: 9, y: 16, width: 18, height: 18, rotation: 0, opacity: 1, locked: false, zIndex: 1, fill: '#facc15', stroke: '', strokeWidth: 0 },
      { id: '3', type: 'text', text: 'PLEASE', x: 9, y: 4, width: 16, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 36, fontWeight: 'bold', textColor: '#ffffff', textAlign: 'center', verticalAlign: 'middle' },
      { id: '4', type: 'text', text: 'PETS ARE NOT\nALLOWED IN\nTHE OFFICE', x: 9, y: 14, width: 14, height: 8, rotation: 0, opacity: 1, locked: false, zIndex: 3, fontFamily: 'Arial Black', fontSize: 18, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.2 },
    ]
  },

  // HEARING PROTECTION Signs
  {
    id: 'hearing-protection',
    name: 'Hearing Protection Required',
    category: 'Safety',
    thumbnail: '',
    canvasWidth: 18,
    canvasHeight: 24,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 9, y: 12, width: 18, height: 24, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#ffffff', stroke: '#dc2626', strokeWidth: 4 },
      { id: '2', type: 'shape', shapeType: 'rectangle', x: 9, y: 3.5, width: 16, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 1, fill: '#dc2626', stroke: '', strokeWidth: 0 },
      { id: '3', type: 'shape', shapeType: 'warning-triangle', x: 2.5, y: 3.5, width: 2.5, height: 2.5, rotation: 0, opacity: 1, locked: false, zIndex: 2, fill: '#facc15', stroke: '#000000', strokeWidth: 1 },
      { id: '4', type: 'text', text: 'CAUTION', x: 10.5, y: 3.5, width: 11, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 3, fontFamily: 'Arial Black', fontSize: 28, fontWeight: 'bold', textColor: '#ffffff', textAlign: 'center', verticalAlign: 'middle' },
      { id: '5', type: 'text', text: 'HEARIN\nPROTECTION\nREQUIRED', x: 9, y: 16, width: 14, height: 10, rotation: 0, opacity: 1, locked: false, zIndex: 4, fontFamily: 'Arial Black', fontSize: 20, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.2 },
    ]
  },

  // CHILD CARE Signs
  {
    id: 'child-care-24hr',
    name: '24 Hour Child Care',
    category: 'Business',
    thumbnail: '',
    canvasWidth: 18,
    canvasHeight: 24,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rounded-rectangle', x: 9, y: 12, width: 18, height: 24, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#facc15', stroke: '#000000', strokeWidth: 3, cornerRadius: 8 },
      { id: '2', type: 'text', text: '24 HOUR', x: 9, y: 5, width: 14, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 1, fontFamily: 'Arial Black', fontSize: 36, fontWeight: 'bold', textColor: '#1e3a8a', textAlign: 'center', verticalAlign: 'middle' },
      { id: '3', type: 'text', text: 'CHILD CARE', x: 9, y: 11, width: 14, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 32, fontWeight: 'bold', textColor: '#1e3a8a', textAlign: 'center', verticalAlign: 'middle' },
      { id: '4', type: 'text', text: 'AVAILABLE', x: 9, y: 17, width: 14, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 3, fontFamily: 'Arial Black', fontSize: 32, fontWeight: 'bold', textColor: '#1e3a8a', textAlign: 'center', verticalAlign: 'middle' },
    ]
  },

  // PLAYGROUND Signs
  {
    id: 'playground-watch-kids',
    name: 'At The Playground',
    category: 'Parks',
    thumbnail: '',
    canvasWidth: 18,
    canvasHeight: 24,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rounded-rectangle', x: 9, y: 12, width: 18, height: 24, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#60a5fa', stroke: '#1e3a8a', strokeWidth: 4, cornerRadius: 8 },
      { id: '2', type: 'shape', shapeType: 'rectangle', x: 9, y: 3.5, width: 14, height: 5, rotation: 0, opacity: 1, locked: false, zIndex: 1, fill: '#1e3a8a', stroke: '', strokeWidth: 0 },
      { id: '3', type: 'text', text: 'AT THE\nPLAYGROUND', x: 9, y: 3.5, width: 12, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 16, fontWeight: 'bold', textColor: '#ffffff', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.1 },
      { id: '4', type: 'text', text: 'KEEP A CLOSE\nWATCH ON\nYOUR KIDS', x: 9, y: 16, width: 14, height: 8, rotation: 0, opacity: 1, locked: false, zIndex: 3, fontFamily: 'Arial Black', fontSize: 20, fontWeight: 'bold', textColor: '#1e3a8a', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.2 },
    ]
  },

  // EMERGENCY STOP Signs
  {
    id: 'emergency-stop',
    name: 'Emergency Stop',
    category: 'Emergency',
    thumbnail: '',
    canvasWidth: 18,
    canvasHeight: 24,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rounded-rectangle', x: 9, y: 12, width: 18, height: 24, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#ffffff', stroke: '#000000', strokeWidth: 2, cornerRadius: 8 },
      { id: '2', type: 'text', text: 'EMERGENCY', x: 9, y: 4, width: 14, height: 3, rotation: 0, opacity: 1, locked: false, zIndex: 1, fontFamily: 'Arial Black', fontSize: 22, fontWeight: 'bold', textColor: '#dc2626', textAlign: 'center', verticalAlign: 'middle' },
      { id: '3', type: 'text', text: 'STOP', x: 9, y: 8, width: 14, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 2, fontFamily: 'Arial Black', fontSize: 42, fontWeight: 'bold', textColor: '#000000', textAlign: 'center', verticalAlign: 'middle' },
      { id: '4', type: 'shape', shapeType: 'rectangle', x: 9, y: 16, width: 6, height: 8, rotation: 0, opacity: 1, locked: false, zIndex: 3, fill: '#e5e7eb', stroke: '#000000', strokeWidth: 2 },
      { id: '5', type: 'shape', shapeType: 'circle', x: 9, y: 14, width: 4, height: 4, rotation: 0, opacity: 1, locked: false, zIndex: 4, fill: '#dc2626', stroke: '#000000', strokeWidth: 1 },
    ]
  },

  // Blank Templates
  {
    id: 'blank-landscape',
    name: 'Blank Landscape',
    category: 'Blank',
    thumbnail: '',
    canvasWidth: 24,
    canvasHeight: 18,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 12, y: 9, width: 24, height: 18, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#ffffff', stroke: '#e2e8f0', strokeWidth: 1 },
    ]
  },
  {
    id: 'blank-portrait',
    name: 'Blank Portrait',
    category: 'Blank',
    thumbnail: '',
    canvasWidth: 18,
    canvasHeight: 24,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 9, y: 12, width: 18, height: 24, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#ffffff', stroke: '#e2e8f0', strokeWidth: 1 },
    ]
  },
  {
    id: 'blank-square',
    name: 'Blank Square',
    category: 'Blank',
    thumbnail: '',
    canvasWidth: 24,
    canvasHeight: 24,
    objects: [
      { id: '1', type: 'shape', shapeType: 'rectangle', x: 12, y: 12, width: 24, height: 24, rotation: 0, opacity: 1, locked: false, zIndex: 0, fill: '#ffffff', stroke: '#e2e8f0', strokeWidth: 1 },
    ]
  },
]

export const TEMPLATE_CATEGORIES = [
  'All',
  'Caution',
  'Warning',
  'Notice',
  'Emergency',
  'Fire Safety',
  'Attention',
  'Safety',
  'Restricted',
  'Prohibition',
  'Informational',
  'Business',
  'Parks',
  'Blank',
]
