export interface ISVGRenderingOptions {
    width: number;
    height: number;
    contents: SVGNode[];
}

export type SVGNode = ISVGRect | ISVGLine | ISVGText | ISVGTSpan | ISVGEmbedded | ISVGPath;

export interface ISVGLine {
    type: 'line';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
    width: number;
}

export interface ISVGRect {
    type: 'rect';
    width: number;
    height: number;
    x: number;
    y: number;
    border?: {
        left?: { width: number; color: string };
        right?: { width: number; color: string };
        top?: { width: number; color: string };
        bottom?: { width: number; color: string };
    };
    borderWidth?: number;
    borderColor?: string;
    background?: string;
    borderRadius?: number;
    filter?: string;
    // TODO: Determine more
}

export interface ISVGText {
    type: 'text';
    contents: string;
    x: number;
    y: number;
    fill?: string;
    children?: ISVGTSpan[];
    style: {
        fontFamily?: string;
        fontSize?: number;
        fontWeight?: number;
        lineHeight?: number;
        letterSpacing?: string | number;
        textTransform?: string;
    };
}

export interface ISVGTSpan extends Omit<ISVGText, 'type' | 'children'> {
    type: 'tspan';
}

export interface ISVGEmbedded {
    type: 'svg';
    width: number;
    height: number;
    viewBox: string;
    fill: string;
    x: number;
    y: number;
    children: SVGNode[]; // TODO: Add multi-level children?
}

export interface ISVGPath {
    type: 'path';
    d: string;
    fill?: string;
    // TODO: Add stroke?
}
