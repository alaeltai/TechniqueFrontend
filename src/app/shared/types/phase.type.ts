import { ISubphase } from '@teq/shared/types/subphase.type';

export interface BasePhase {
    id: string;
    name: string;
    order?: number;
    description?: string;

    /**
     * Data location hash of dot notatted id's that allow look-up of child to parent relationships
     * between original and filtered data levels
     */
    _locator: string;

    /**
     * Determines if the data should be rendered as being disabled
     */
    disabled?: boolean;

    /**
     * Determines if the data should be rendered as collapsed
     */
    collapsed?: boolean;

    /**
     * Original disable status keeper  in case of manual adjustment from parent level
     */
    _disabled?: boolean;

    /**
     * Determines if the data should be omitted from rendering
     */
    filtered?: boolean;

    /**
     * Flag remembering if a search metch was found inside the non directly visible entity data
     */
    matches?: { innerMatch?: boolean };
}

export interface IPhase extends BasePhase {
    type?: 'phase';
    subphases?: ISubphase[];
}
