import { IOption } from '@teq/shared/components/select/types/option.type';
import { FilterType } from '../../filters/filters.service';

export interface ISelect {
    value?: string | string[];

    /**
     * Select label to be used on empty value cases or as a placeholder for input cases
     */
    label?: string;

    /**
     * Determines if the select is searchable
     * A search on the labels of provided options will be automatically executed when a term is inputed.
     * If the control has no provided options, the search is expected to be executed in an outside context
     * and will only be triggered once the minimum term length is reached.
     */
    searchable?: boolean;

    /**
     * Determines if searchables should add a search icon
     */
    searchIcon?: boolean;

    /**
     * Determines if multiple options should be selectable for this control
     */
    multiple?: boolean;

    /**
     * Form control name
     */
    controlName: FilterType;

    /**
     * Select options
     */
    options: IOption[];
}
