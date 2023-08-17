import { Component, Input } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import type { EntityType } from '@teq/shared/types/types';
import { IconComponent } from '../icon/icon.component';
import { APIService } from '@teq/shared/states/api/api.service';
import { LazyRequestDirective } from '@teq/shared/directives/lazy-request';

@Component({
    selector: 'teq-information-provider',
    standalone: true,
    imports: [NgFor, NgIf, NgStyle, IconComponent, LazyRequestDirective],
    templateUrl: './information-provider.component.html',
    styleUrls: ['./information-provider.component.scss'],
    providers: [APIService]
})
export class InformationProviderComponent {
    @Input({ required: true }) type!: EntityType;

    @Input({ required: true }) id!: string;

    @Input({ required: true }) entity!: { name: string; description?: string };
}
