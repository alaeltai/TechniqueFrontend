import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlossaryComponent } from './glossary.component';

describe('GlossaryComponent', () => {
    let component: GlossaryComponent;
    let fixture: ComponentFixture<GlossaryComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [GlossaryComponent]
        });
        fixture = TestBed.createComponent(GlossaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
