import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '@teq/modules/auth/pages/login/login.component';
import { AuthComponent } from '@teq/modules/auth/auth.component';
import { AuthRoutingModule } from '@teq/modules/auth/auth-routing.module';
import { ColorBarComponent } from '@teq/shared/components/color-bar/color-bar.component';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from './state/auth.state';
import { AuthService } from './state/auth.service';

@NgModule({
    declarations: [AuthComponent, LoginComponent],
    imports: [CommonModule, AuthRoutingModule, ColorBarComponent, NgxsModule.forFeature([AuthState])],
    exports: [AuthComponent],
    providers: [AuthService]
})
export class AuthModule {}
