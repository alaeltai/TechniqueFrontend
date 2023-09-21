import { ISelect } from '@teq/shared/components/select/types/select.type';
import { IToggle } from '@teq/shared/components/toggle/types/toggle.type';
import type { FilterType } from '../filters.service';

export interface IFilters {
    selects: ISelect[];
    toggles: IToggle[];
}

export type FiltersValue = {
    [type in FilterType]: string | string[] | boolean;
};
