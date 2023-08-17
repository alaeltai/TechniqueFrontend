import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IOption, OptionValueType } from '@teq/shared/components/select/types/option.type';

@Component({
    selector: 'teq-select',
    standalone: true,
    imports: [NgFor, NgIf, FormsModule],
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectComponent),
            multi: true
        }
    ]
})
export class SelectComponent implements OnInit, ControlValueAccessor {
    private _lastSearch = '';
    private _filteredOptions!: IOption[];

    @Input() disabled = false;
    @Input() value?: string;
    @Input() label?: string;
    @Input() searchable?: boolean;
    @Input() options!: IOption[];

    get filteredOptions(): IOption[] {
        return this._filteredOptions;
    }

    ngOnInit(): void {
        this._ensureValue();
        this._filterOptions();
    }

    onChange: (value: OptionValueType) => void = () => undefined;

    onTouched: () => void = () => undefined;

    writeValue(value: OptionValueType): void {
        this.onChange(value);
    }

    registerOnChange(fn: (value: OptionValueType) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    change(option: IOption): void {
        this.onChange(option.value);
    }

    filterOptions(event: Event): void {
        if ((event.target as HTMLInputElement).value !== this._lastSearch) {
            this._lastSearch = (event.target as HTMLInputElement).value;
            this._filterOptions();
        }
    }

    private _ensureValue(): void {
        if (!(this.label ?? this.value)) {
            if (this.options.length) {
                const option = this.options[0];
                if (option) {
                    this.value = option.value?.toString();
                }
            }
        }
    }

    private _filterOptions(): void {
        if (this._lastSearch) {
            this._filteredOptions = this.options.filter(option => option.label.includes(this._lastSearch));
        } else if (!this.searchable) {
            this._filteredOptions = this.options;
        } else {
            this._filteredOptions = [];
        }
    }
}
