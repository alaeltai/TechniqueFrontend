import { IOption } from '@teq/shared/components/select/types/option.type';

export interface ISelect {
    value?: string;
    label?: string;
    searchable?: boolean;
    controlName: string;
    options: IOption[];
}
