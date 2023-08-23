import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'teq-checkbox',
    standalone: true,
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
    imports: [CommonModule, NgFor, NgIf],
    changeDetection: ChangeDetectionStrategy.OnPush
    // providers: [
    //     {
    //         provide: NG_VALUE_ACCESSOR,
    //         useExisting: forwardRef(() => ToggleComponent),
    //         multi: true
    //     }
    // ]
})
export class CheckboxComponent implements ControlValueAccessor {
    @Input() disabled?: boolean = false;
    @Input() value?: boolean;
    @Input() label?: string;

    onChange: (value: boolean) => void = () => undefined;

    change(event: Event): void {
        const checked = (event.target as HTMLInputElement).checked;

        this.value = checked;

        this.onChange(this.value);
    }

    onTouched: () => void = () => undefined;

    writeValue(value: boolean): void {
        this.onChange(value);
    }

    registerOnChange(fn: (value: boolean) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
