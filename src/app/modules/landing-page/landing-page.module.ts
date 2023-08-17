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

@NgModule({
    declarations: [LandingPageComponent, LandingCardComponent],
    imports: [CommonModule, NgxsModule.forFeature([LandingPageState]), LandingPageRoutingModule, ColorBarComponent],
    exports: [LandingPageComponent],
    providers: [LandingPageService, LandingPageControllerService]
})
export class LandingPageModule {}
