import { ISelect } from '@teq/shared/components/select/types/select.type';
import { IToggle } from '@teq/shared/components/toggle/types/toggle.type';

export interface IFilters {
    selects: ISelect[];
    toggles: IToggle[];
}
