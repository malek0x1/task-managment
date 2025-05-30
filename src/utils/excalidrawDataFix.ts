
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';

interface ExcalidrawData {
  elements: ExcalidrawElement[];
  appState?: {
    viewBackgroundColor?: string;
    [key: string]: any;
  };
  files?: any;
  libraryItems?: any[];
}


export const ensureExcalidrawData = async (): Promise<void> => {


  return Promise.resolve();
};

export const clearAllExcalidrawDataExcept = async (nodeId: string): Promise<void> => {


  return Promise.resolve();
};

const fixElement = (element: any): ExcalidrawElement => {
  const baseElement = {
    id: element.id || generateId(),
    type: element.type || 'text',
    x: typeof element.x === 'number' ? element.x : 0,
    y: typeof element.y === 'number' ? element.y : 0,
    width: typeof element.width === 'number' ? element.width : 100,
    height: typeof element.height === 'number' ? element.height : 100,
    angle: typeof element.angle === 'number' ? element.angle : 0,
    strokeColor: element.strokeColor || '#000000',
    backgroundColor: element.backgroundColor || 'transparent',
    fillStyle: element.fillStyle || 'hachure',
    strokeWidth: typeof element.strokeWidth === 'number' ? element.strokeWidth : 1,
    strokeStyle: element.strokeStyle || 'solid',
    roughness: typeof element.roughness === 'number' ? element.roughness : 1,
    opacity: typeof element.opacity === 'number' ? element.opacity : 100,
    groupIds: Array.isArray(element.groupIds) ? element.groupIds : [],
    frameId: element.frameId || null,
    roundness: element.roundness || null,
    seed: typeof element.seed === 'number' ? element.seed : Math.floor(Math.random() * 1000000),
    versionNonce: typeof element.versionNonce === 'number' ? element.versionNonce : Math.floor(Math.random() * 1000000),
    isDeleted: Boolean(element.isDeleted),
    boundElements: element.boundElements || null,
    updated: typeof element.updated === 'number' ? element.updated : Date.now(),
    link: element.link || null,
    locked: Boolean(element.locked)
  };

  if (element.type === 'text') {
    return {
      ...baseElement,
      type: 'text',
      text: element.text || '',
      fontSize: typeof element.fontSize === 'number' ? element.fontSize : 16,
      fontFamily: typeof element.fontFamily === 'number' ? element.fontFamily : 1,
      textAlign: element.textAlign || 'left',
      verticalAlign: element.verticalAlign || 'top',
      baseline: typeof element.baseline === 'number' ? element.baseline : element.fontSize || 16,
      containerId: element.containerId || null,
      originalText: element.originalText || element.text || '',
      lineHeight: typeof element.lineHeight === 'number' ? element.lineHeight : 1.25
    } as any;
  }

  if (element.type === 'arrow' || element.type === 'line') {
    return {
      ...baseElement,
      type: element.type,
      points: Array.isArray(element.points) ? element.points : [[0, 0], [100, 100]],
      lastCommittedPoint: element.lastCommittedPoint || null,
      startBinding: element.startBinding || null,
      endBinding: element.endBinding || null,
      startArrowhead: element.startArrowhead || null,
      endArrowhead: element.endArrowhead || (element.type === 'arrow' ? 'arrow' : null)
    } as any;
  }

  if (element.type === 'rectangle' || element.type === 'ellipse' || element.type === 'diamond') {
    return baseElement as any;
  }

  if (element.type === 'freedraw') {
    return {
      ...baseElement,
      type: 'freedraw',
      points: Array.isArray(element.points) ? element.points : [],
      pressures: Array.isArray(element.pressures) ? element.pressures : [],
      simulatePressure: Boolean(element.simulatePressure),
      lastCommittedPoint: element.lastCommittedPoint || null
    } as any;
  }

  return baseElement as any;
};

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
