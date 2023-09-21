import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseTabComponent } from './phase-tab.component';

describe('PhaseTabComponent', () => {
    let component: PhaseTabComponent;
    let fixture: ComponentFixture<PhaseTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PhaseTabComponent]
        });
        fixture = TestBed.createComponent(PhaseTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
