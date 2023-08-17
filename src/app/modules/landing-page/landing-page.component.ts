import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from '@teq/modules/auth/state/auth.service';
import { LandingPageService } from '@teq/modules/landing-page/state/landing-page.service';
import { ILandingCard } from '@teq/modules/landing-page/types/landing-card.type';
import { bottomFadeIn, fadeIn } from '@teq/shared/animations/animations.lib';
import { greetings } from '@teq/shared/lib/greetings.lib';

@UntilDestroy()
@Component({
    selector: 'teq-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss'],
    animations: [bottomFadeIn, fadeIn]
})
export class LandingPageComponent implements OnInit {
    public user?: string;
    public greeting!: string;
    public cards$!: Observable<ILandingCard[]>;

    constructor(private readonly _authService: AuthService, private readonly _landingPageService: LandingPageService) {}

    ngOnInit(): void {
        this.greeting = greetings();

        this._landingPageService.loadLandingCards();

        this.cards$ = this._landingPageService.cards$;

        this._authService.user$.pipe(untilDestroyed(this)).subscribe(user => {
            this.user = user.split(',')[1];
        });
    }
}
