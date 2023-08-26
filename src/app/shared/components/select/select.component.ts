import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, forwardRef, OnInit, signal, HostListener, ElementRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IOption, OptionValueType } from '@teq/shared/components/select/types/option.type';
import { IconComponent } from '../icon/icon.component';
import { BehaviorSubject, Observable, distinctUntilChanged } from 'rxjs';
import { CheckboxComponent } from '../checkbox/checkbox.component';

const MinLettersTreshold = 3;

@Component({
    selector: 'teq-select',
    standalone: true,
    imports: [CommonModule, NgFor, NgIf, FormsModule, IconComponent, CheckboxComponent],
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

    @Input() disabled = false;
    @Input() value?: string | string[];
    @Input() label?: string;
    @Input() searchable?: boolean;
    @Input() searchIcon?: boolean;
    @Input() options!: IOption[];
    @Input() multiple?: boolean;

    private readonly _filteredOptions$ = new BehaviorSubject<IOption[]>([]);

    displayLabel = '';

    public opened = signal(false);

    @HostListener('document:click', ['$event'])
    unfocus(event: Event): void {
        let unfocus = true;

        if (event.target) {
            let target: HTMLElement | null = event.target as HTMLElement;

            while (target) {
                if (target === this._element.nativeElement) {
                    // Inside the container
                    unfocus = false;
                    break;
                }

                target = target.parentElement;
            }
        }

        if (unfocus) {
            this.opened.set(false);
        }
    }

    constructor(private readonly _element: ElementRef) {}

    get filteredOptions$(): Observable<IOption[]> {
        return this._filteredOptions$.pipe(distinctUntilChanged());
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

    onInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;

        if (this.searchable && this.options.length) {
            // Search exclusively on provided options
            this._lastSearch = value;

            this._filterOptions();
            this.opened.set(true);
        } else {
            // Forward the search tearm for outer filtering
            if (
                (value.length > MinLettersTreshold && this._lastSearch !== value) || // if the value changed and is of sufficient length
                (this._lastSearch.length >= MinLettersTreshold && value.length < MinLettersTreshold) // or the value was trimmed under the minimum length for the first time
            ) {
                this._lastSearch = value; // Cache the value as last searched for value
                this.onChange(value); // And propagate the new search value as a filter
            }
        }
    }

    clearTerm(): void {
        this.displayLabel = '';

        this.opened.set(false);

        this.onChange('');
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
        this.value = option.value?.toString();
        this.displayLabel = option.label;

        this.opened.set(false);

        this.onChange(option.value);
    }

    toggleOptionsView(): void {
        if (this._filteredOptions$.value.length) {
            this.opened.update(value => !value);
        }
    }

    isSelected(value: OptionValueType): boolean {
        const values = (Array.isArray(this.value) ? this.value : [this.value]) as OptionValueType[];

        return values.includes(value);
    }

    private _ensureValue(): void {
        if (!this.value && this.options.length) {
            // Enforce the first option as the selected value if available
            const option = this.options[0];

            this.value = option.value?.toString();
            this.displayLabel = option.label;
        }

        if (!this.displayLabel && this.value !== undefined) {
            const option = this.options.find(o => o.value?.toString() === this.value);

            if (option) {
                // An option with specified value exists, use it's label
                this.displayLabel = option.label;
            } else {
                // No option satisfying provided value exists, select the first existing option
                this.value = undefined;

                this._ensureValue();
            }
        }
    }

    private _filterOptions(): void {
        if (this.searchable) {
            if (this._lastSearch) {
                this._filteredOptions$.next(this.options.filter(option => option.label.includes(this._lastSearch)));
            } else {
                this._filteredOptions$.next(this.options);
            }
        } else {
            this._filteredOptions$.next(this.options);
        }
    }
}
