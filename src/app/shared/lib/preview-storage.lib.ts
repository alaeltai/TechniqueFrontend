import { IPhase } from '../types/phase.type';

interface IPreviewState {
    filterDisabled: boolean;
    data: IPhase[];
}

function computeId(id: number | string = ''): string {
    return [`previewData`, id].filter(Boolean).join('-');
}

export function commitPreviewState(data: IPhase[], id: number | string = '', filterDisabled?: boolean): void {
    // localStorage.setItem(`previewData-${this._previewId}`, JSON.stringify(this.previewData));
    const identifier = computeId(id);

    if (filterDisabled === undefined) {
        // Determine current filter disabled flag status
        const current = fetchPreviewState();

        if (current) {
            filterDisabled = current.filterDisabled;
        }
    }

    localStorage.setItem(identifier, JSON.stringify({ filterDisabled, data }));
}

export function removePreviewState(id: number | string = ''): void {
    const identifier = computeId(id);
    localStorage.removeItem(identifier);
}

export function fetchPreviewState(id: number | string = ''): IPreviewState | null {
    const identifier = computeId(id);
    const previewData = localStorage.getItem(identifier);

    if (previewData) {
        try {
            const parsed = JSON.parse(previewData) as { filterDisabled: boolean; data: IPhase[] };

            if (parsed) {
                return {
                    data: parsed.data ?? [],
                    filterDisabled: parsed.filterDisabled ?? false
                } satisfies IPreviewState;
            }
        } catch (_) {
            // Invalid data forwarded to tab
        }

        localStorage.removeItem('previewData'); // Immediately remove after usage
    }

    return null;
}
