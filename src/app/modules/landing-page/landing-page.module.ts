import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { LandingPageComponent } from './landing-page.component';
import { LandingPageRoutingModule } from '@teq/modules/landing-page/landing-page-routing.module';
import { ColorBarComponent } from '@teq/shared/components/color-bar/color-bar.component';
import { LandingCardComponent } from './components/landing-card/landing-card.component';
import { LandingPageService } from '@teq/modules/landing-page/state/landing-page.service';
import { LandingPageControllerService } from '@teq/modules/landing-page/state/landing-page-controller.service';
import { LandingPageState } from '@teq/modules/landing-page/state/landing-page.state';
import { APIState } from '@teq/shared/states/api/api.state';

@NgModule({
    declarations: [LandingPageComponent, LandingCardComponent],
    imports: [CommonModule, NgxsModule.forFeature([LandingPageState]), NgxsModule.forFeature([APIState]), LandingPageRoutingModule, ColorBarComponent],
    exports: [LandingPageComponent],
    providers: [LandingPageService, LandingPageControllerService]
})
export class LandingPageModule {}
