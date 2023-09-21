import { Injectable } from '@angular/core';
import { ITemplateCard } from '@teq/modules/select-template/types/template-card.type';
import { BaseControllerService } from '@teq/shared/services/base-controller.service';
import { Observable, of } from 'rxjs';

export const templates: ITemplateCard[] = [
    {
        title: 'Low',
        description: 'Suitable for projects that fit under 3 months of work, with a team not larger than 8 people.',
        button: {
            name: 'Select',
            link: '/create'
        }
    },
    {
        title: 'Medium',
        description: 'Suitable for projects that fit under 3 months of work, with a team not larger than 8 people.',
        button: {
            name: 'Select',
            link: '/create'
        }
    },
    {
        title: 'High',
        description: 'Suitable for projects that fit under 3 months of work, with a team not larger than 8 people.',
        button: {
            name: 'Select',
            link: '/create'
        }
    },
    {
        title: 'Value Selling',
        description: 'Suitable for projects that fit under 3 months of work, with a team not larger than 8 people.',
        button: {
            name: 'Select',
            link: '/create'
        }
    },
    {
        title: 'Tailor',
        description: 'Suitable for projects that fit under 3 months of work, with a team not larger than 8 people.',
        button: {
            name: 'Select',
            link: '/create'
        }
    },
    {
        title: 'Customer',
        description: 'Suitable for projects that fit under 3 months of work, with a team not larger than 8 people.',
        button: {
            name: 'Select',
            link: '/create'
        }
    }
];

@Injectable()
export class SelectTemplateControllerService extends BaseControllerService {
    getTemplateCards(): Observable<ITemplateCard[]> {
        return of(templates);
    }
}
