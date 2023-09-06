import { Injectable } from '@angular/core';
import { ILandingCard } from '@teq/modules/landing-page/types/landing-card.type';
import { BaseControllerService } from '@teq/shared/services/base-controller.service';
import { Observable, of } from 'rxjs';

export const cards = [
    {
        title: 'Explore',
        description: 'For beginner users. Open the Technique platform without a predefined selection and play around.',
        button: {
            name: 'Explore Technique',
            link: '/explore'
        },
        image: 'assets/img/explore.svg'
    },
    {
        title: 'Create',
        description: 'Select predefined templates of complexity and tailor the selection to better fit your project needs.',
        button: {
            name: 'Create a new framework',
            link: '/create'
        },
        image: 'assets/img/create.svg'
    },
    {
        title: 'Import',
        description: 'Import a .teq file that you or someone else created, to view its details.',
        button: {
            name: 'Upload a framework',
            link: '/import'
        },
        image: 'assets/img/import.svg'
    }
];

@Injectable()
export class LandingPageControllerService extends BaseControllerService {
    getLandingPageCards(): Observable<ILandingCard[]> {
        return of(cards);
    }
}
