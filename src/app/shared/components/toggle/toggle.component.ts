import { ChangeDetectionStrategy, Component, Input, forwardRef } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { IToggle } from './types/toggle.type';

@Component({
    selector: 'teq-toggle',
    standalone: true,
    imports: [NgFor, NgIf],
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
    @Input() toggle!: IToggle;

    onChange: (value: boolean) => void = () => undefined;

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
