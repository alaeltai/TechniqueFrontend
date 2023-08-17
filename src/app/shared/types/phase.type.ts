import { ISubphase } from '@teq/shared/types/subphase.type';

export interface BasePhase {
    id: string;
    name: string;
    order?: number;
    description?: string;

    /**
     * Determines if the data should be rendered as being disabled
     */
    disabled?: boolean;

    /**
     * Determines if the data should be omitted from rendering
     */
    filtered?: boolean;
}

export interface IPhase extends BasePhase {
    type?: 'phase';
    subphases?: ISubphase[];
}
