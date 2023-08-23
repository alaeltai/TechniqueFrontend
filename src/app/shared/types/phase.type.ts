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
     * Original disable status keeper  in case of manual adjustment from parent level
     */
    _disabled?: boolean;

    /**
     * Parent reference keeper
     */
    parent?: BasePhase;

    /**
     * Determines if the data should be omitted from rendering
     */
    filtered?: boolean;
}

export interface IPhase extends BasePhase {
    type?: 'phase';
    subphases?: ISubphase[];
}
