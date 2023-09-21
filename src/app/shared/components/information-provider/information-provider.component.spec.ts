import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationProviderComponent } from './information-provider.component';

describe('BadgeComponent', () => {
    let component: InformationProviderComponent;
    let fixture: ComponentFixture<InformationProviderComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [InformationProviderComponent]
        });
        fixture = TestBed.createComponent(InformationProviderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
