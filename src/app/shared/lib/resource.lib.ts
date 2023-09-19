type ResourceType = 'image/svg+xml' | 'application/json' | 'application/pdf';

export function generateResource(
    content: string | HTMLElement | Record<string | number | symbol, unknown> | unknown[],
    options: {
        type: ResourceType;
        hint: string;
        download: boolean;
    }
): void {
    const c: string =
        typeof content === 'string'
            ? content
            : !Array.isArray(content) && typeof content.addEventListener === 'function'
            ? (content as HTMLElement).outerHTML
            : JSON.stringify(content);
    const blob = new Blob([c], { type: options.type });
    const url = URL.createObjectURL(blob);

    if (options.download) {
        // Offer the resulting resource for download
        const handler = document.createElement('a');
        handler.href = url;
        handler.download = options.hint;
        handler.click();
    } else {
        // Open the new resource into a new tab
        window.open(url);
    }

    URL.revokeObjectURL(url);
}
