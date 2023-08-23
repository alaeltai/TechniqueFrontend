import type { ISVGEmbedded, ISVGLine, ISVGPath, ISVGRect, ISVGTSpan, ISVGText, SVGNode } from '../types/svg.type';

const filtersLookup: Record<string, string> = {
    'cmdiYSg1MSwgNTEsIDUxLCAwLjE1KSAwcHggMTVweCAyNXB4IDBweA==': 'phaseShadow',
    'cmdiYSg1MSwgNTEsIDUxLCAwLjA4KSAwcHggMTVweCAxNXB4IDBweA==': 'subPhaseShadow',
    'cmdiYSg1MSwgNTEsIDUxLCAwLjA4KSAwcHggMTVweCAxNC45OXB4IDBweA==': 'randomShadow'
};

const CharacterWidthCache: Record<string, number> = {};

export function asSVGRenderingOptions(
    c: ChildNode,
    svgContents: SVGNode[] = [],
    stack: { parentBackground?: string; parent?: SVGNode; offsetX: number; offsetY: number; scale: number } = {
        offsetX: 0,
        offsetY: 0,
        scale: 1
    }
): SVGNode[] {
    if (c.nodeType === c.ELEMENT_NODE) {
        // HTML element
        const el = c as HTMLElement;
        const sizes = el.getBoundingClientRect();
        const styles = window.getComputedStyle(el);
        const x = sizes.x * stack.scale - stack.offsetX;
        const y = sizes.y * stack.scale - stack.offsetY;

        let touched = false;
        let child: SVGNode | null = null;

        if (el.hasAttribute('data-svg-ignore-all')) {
            // Skip subtrees marked for complete filtering from processing
            return svgContents;
        }

        if (el.tagName === 'svg') {
            // Embedded SVG
            const svg: ISVGEmbedded = {
                type: 'svg',
                fill: styles.fill,
                x,
                y,
                height: parseInt(el.getAttribute('height') as string, 10),
                width: parseInt(el.getAttribute('width') as string, 10),
                viewBox: el.getAttribute('viewBox') as string,
                children: []
            };

            child = svg;

            // Traverse all children and add them to the current container
            el.childNodes.forEach(cc => asSVGRenderingOptions(cc, svgContents, { ...stack, parent: svg }));

            touched = true;
        } else if (el.tagName === 'path' && stack?.parent) {
            // Embedded SVG path
            const path: ISVGPath = {
                type: 'path',
                d: el.getAttribute('d') as string,
                fill: el.getAttribute('fill') as string
            };

            if (stack.parent && stack.parent.type === 'svg') {
                stack.parent.children.push(path);
            }
        } else {
            const rect: ISVGRect = {
                type: 'rect',
                width: sizes.width * stack.scale,
                height: sizes.height * stack.scale,
                x,
                y
                // Debug point
                // borderColor: 'red',
                // borderWidth: 1
            };

            if (styles.backgroundColor !== stack?.parentBackground && styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                rect.background = styles.backgroundColor;

                touched = true;
            }

            if (styles.border && styles.border !== '0px none rgb(0, 0, 0)' && parseInt(styles.borderWidth, 10) > 0) {
                // Use stroke for all sided borders
                rect.borderWidth = parseFloat(styles.borderWidth) > 0 ? Math.max(1, parseFloat(styles.borderWidth)) : 0;
                rect.borderColor = styles.borderColor;

                touched = true;
            } else {
                // Draw lines in place of borders for non continuous or miss matched borders
                (['left', 'right', 'top', 'bottom'] as Array<keyof CSSStyleDeclaration>).forEach(direction => {
                    const capitalized = (direction as string).slice(0, 1).toUpperCase() + (direction as string).slice(1);
                    const widthProp = `border${capitalized}Width` as keyof CSSStyleDeclaration;
                    const colorProp = `border${capitalized}Color` as keyof CSSStyleDeclaration;

                    const widthRaw = styles[widthProp] as string;
                    const width = widthRaw ? (parseFloat(widthRaw) > 0 ? Math.max(1, parseFloat(widthRaw)) : 0) : 0;

                    if (width > 0) {
                        const line: ISVGLine = {
                            type: 'line',
                            ...(direction === 'left'
                                ? {
                                      x1: rect.x,
                                      x2: rect.x,
                                      y1: rect.y,
                                      y2: rect.y + rect.height
                                  }
                                : direction === 'right'
                                ? {
                                      x1: rect.x + rect.width,
                                      x2: rect.x + rect.width,
                                      y1: rect.y,
                                      y2: rect.y + rect.height
                                  }
                                : direction === 'top'
                                ? {
                                      x1: rect.x,
                                      x2: rect.x + rect.width,
                                      y1: rect.y,
                                      y2: rect.y
                                  }
                                : {
                                      x1: rect.x,
                                      x2: rect.x + rect.width,
                                      y1: rect.y + rect.height,
                                      y2: rect.y + rect.height
                                  }),
                            width,
                            color: styles[colorProp] as string
                        };

                        svgContents.push(line);

                        touched = true;
                    }
                });
            }

            if (parseFloat(styles.borderRadius) > 0) {
                rect.borderRadius = Math.max(1, parseFloat(styles.borderRadius));

                touched = true;
            }

            if (styles.boxShadow !== 'none') {
                const filter = btoa(styles.boxShadow);
                if (filtersLookup[filter]) {
                    rect.filter = filtersLookup[filter];

                    touched = true;
                } else {
                    console.warn(`Missing filter definition for filter: ${filter} on`, el);
                }
            }

            child = rect;

            // Traverse all children and add them to the current container
            el.childNodes.forEach(cc => asSVGRenderingOptions(cc, svgContents, { ...stack, parentBackground: rect.background }));
        }

        if (touched && child) {
            if (!el.hasAttribute('data-svg-ignore')) {
                svgContents.push(child);
            }
        }
    } else {
        // Text/comment
        if (c.nodeType === c.TEXT_NODE) {
            const el = c.parentElement as HTMLElement;
            const sizes = el.getBoundingClientRect();
            const x = sizes.x * stack.scale - stack.offsetX;
            const y = sizes.y * stack.scale - stack.offsetY;
            const styles = window.getComputedStyle(el);
            const fontSize = parseFloat(styles.fontSize);
            const fontWeight = styles.fontWeight;
            const letterSpacing = styles.letterSpacing;
            const lineHeight = parseFloat(styles.lineHeight);
            let contents = (c.textContent ?? '').trim();

            if (contents.length) {
                const paddingLeft = parseInt(styles.paddingLeft, 10);
                const paddingRight = parseInt(styles.paddingRight, 10);
                const borderLeft = parseInt(styles.borderLeftWidth, 10);
                const borderRight = parseInt(styles.borderRightWidth, 10);
                const textContainerWidth = Math.ceil(sizes.width * stack.scale - paddingLeft - paddingRight - borderLeft - borderRight);
                const fontFamily = styles.fontFamily;
                const children: ISVGTSpan[] = [];

                const firstLineX = x + parseFloat(styles.paddingLeft);
                const firstLineY = y + parseFloat(styles.paddingTop) + fontSize + (lineHeight - fontSize) / 4;
                const widthOptions = { fontFamily, fontSize, fontWeight, letterSpacing };
                const contentsWidth = getContentsWidth(el, contents, widthOptions);
                const spaceWidth = getContentsWidth(el, ' ', widthOptions);

                if (contentsWidth > textContainerWidth && contents.includes(' ')) {
                    // Break text into lines
                    let row = '';
                    let rowWidth = 0;
                    let rowNbr = 0;

                    contents.split(/\s/g).forEach((s, i, all) => {
                        const isLast = i === all.length - 1;
                        const currSegementWidth = getContentsWidth(el, s, widthOptions);
                        const currRowWidth = rowWidth + currSegementWidth;

                        if (currRowWidth > textContainerWidth || isLast) {
                            if (isLast) {
                                if (currRowWidth <= textContainerWidth) {
                                    // Append the last segment to the current row as it fits
                                    row = `${row} ${s}`;
                                } else {
                                    // Commit the current row and add the remaining on a new row
                                    children.push(
                                        createTSpan(
                                            row,
                                            firstLineX,
                                            firstLineY + rowNbr * lineHeight,
                                            styles.color,
                                            styles,
                                            fontSize,
                                            lineHeight,
                                            letterSpacing
                                        )
                                    );

                                    row = s;
                                    rowNbr += 1;
                                }
                            }

                            // Commit the current row based on limit reached
                            children.push(
                                createTSpan(row, firstLineX, firstLineY + rowNbr * lineHeight, styles.color, styles, fontSize, lineHeight, letterSpacing)
                            );

                            row = s;
                            rowNbr += 1;
                            rowWidth = 0;
                        } else {
                            if (!row.length) {
                                row = s;

                                rowWidth += currSegementWidth;
                            } else {
                                row = `${row} ${s}`;

                                rowWidth += currSegementWidth + spaceWidth;
                            }
                        }
                    });

                    contents = '';
                }

                // Text fits into it's container, draw it as is
                const text: ISVGText = {
                    type: 'text',
                    contents,
                    children,
                    x: firstLineX,
                    y: firstLineY,
                    fill: styles.color,
                    style: {
                        fontFamily: styles.fontFamily,
                        fontSize,
                        fontWeight: parseInt(styles.fontWeight, 10),
                        lineHeight,
                        letterSpacing,
                        textTransform: styles.textTransform
                    }
                };

                svgContents.push(text);
            }
        }
    }

    return svgContents;
}

function createTSpan(
    contents: string,
    x: number,
    y: number,
    fill: string,
    styles: CSSStyleDeclaration,
    fontSize: number,
    lineHeight: number,
    letterSpacing: string
): ISVGTSpan {
    return {
        type: 'tspan',
        contents,
        x,
        y,
        fill,
        style: {
            fontFamily: styles.fontFamily,
            fontSize,
            fontWeight: parseInt(styles.fontWeight, 10),
            lineHeight,
            letterSpacing,
            textTransform: styles.textTransform
        }
    };
}

export function sortSVGOptions(options: SVGNode[]): SVGNode[] {
    return options.sort((a, b) => {
        if (a.type === 'rect' && b.type === 'rect') {
            if (a.filter && !b.filter) {
                return -1;
            } else if (!a.filter && b.filter) {
                return 1;
            }

            // Move smaller rects after the larger ones in rendering order
            const aSurface = a.width * a.height;
            const bSurface = b.width * b.height;

            return bSurface - aSurface;
        } else if (a.type === 'rect' && b.type === 'text') {
            return -1;
        } else if (a.type === 'text' && b.type === 'rect') {
            return 1;
        } else if (a.type !== 'line' && b.type === 'line') {
            return -1;
        } else if (a.type === 'line' && b.type !== 'line') {
            return 1;
        } else if (a.type !== 'svg' && b.type === 'svg') {
            return -1;
        } else if (a.type === 'svg' && b.type !== 'svg') {
            return 1;
        } else if (a.type !== 'path' && b.type === 'path') {
            return -1;
        } else if (a.type === 'path' && b.type !== 'path') {
            return 1;
        }

        return 0;
    });
}

function getCacheKey(
    letter: string,
    options: {
        fontFamily: string;
        fontSize: number;
        fontWeight: string;
        letterSpacing: string;
    }
): string {
    return `${options.fontFamily}_${options.fontWeight}_${options.fontSize}_${options.letterSpacing}_${letter}`;
}

function computeCharactersWidth(
    element: HTMLElement,
    contents: string,
    options: {
        fontFamily: string;
        fontSize: number;
        fontWeight: string;
        letterSpacing: string;
    }
): void {
    contents.split('').forEach(letter => {
        const hash = getCacheKey(letter, options);

        if (!CharacterWidthCache[hash]) {
            // Compute the average width of a character in given element using provided input
            const container = document.createElement('span');
            container.style.opacity = '0';
            container.style.fontFamily = options.fontFamily;
            container.style.fontWeight = options.fontWeight;
            container.style.fontSize = `${options.fontSize}px`;
            // container.style.letterSpacing = options.letterSpacing;

            if (letter === ' ') {
                container.innerHTML = '&nbsp;';
            } else {
                container.innerHTML = contents;
            }

            element.appendChild(container);

            const charWidth = container.getBoundingClientRect().width;

            element.removeChild(container);

            CharacterWidthCache[hash] = charWidth;
        }
    });
}

function getContentsWidth(
    element: HTMLElement,
    contents: string,
    options: {
        fontFamily: string;
        fontSize: number;
        fontWeight: string;
        letterSpacing: string;
    }
): number {
    return contents
        .split('')
        .map(letter => getCharacterWidth(element, letter, options))
        .reduce((ret, v) => ret + v, 0);
}

function getCharacterWidth(
    element: HTMLElement,
    letter: string,
    options: {
        fontFamily: string;
        fontSize: number;
        fontWeight: string;
        letterSpacing: string;
    }
): number {
    const hash = getCacheKey(letter, options);

    if (!CharacterWidthCache[hash]) {
        computeCharactersWidth(element, letter, options);
    }

    return CharacterWidthCache[hash];
}
