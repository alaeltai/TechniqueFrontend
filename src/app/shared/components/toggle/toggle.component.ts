import { ChangeDetectionStrategy, Component, Input, forwardRef } from '@angular/core';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'teq-toggle',
    standalone: true,
    imports: [CommonModule, NgFor, NgIf],
    templateUrl: './toggle.component.html',
    styleUrls: ['./toggle.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ToggleComponent),
            multi: true
        }
    ]
})
export class ToggleComponent implements ControlValueAccessor {
    @Input() disabled = false;
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
