import { FilterType } from '../../filters/filters.service';

export interface IToggle {
    /**
     * Form control name
     */
    controlName: FilterType;

    /**
     * Checked status
     */
    value: boolean;

    /**
     * Checkbox display label
     */
    label: string;
}
