import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from '@teq/core/components/header/header.component';
import { TeqRoutingModule } from '@teq/core/routing/teq-routing/teq-routing.module';
import { IconComponent } from '@teq/shared/components/icon/icon.component';

@NgModule({
    declarations: [HeaderComponent],
    imports: [BrowserModule, BrowserAnimationsModule, TeqRoutingModule, IconComponent],
    exports: [HeaderComponent, TeqRoutingModule]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule has already been loaded. You should import Core modules in the AppModule only.');
        }
    }
}
