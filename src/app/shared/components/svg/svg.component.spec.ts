import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SVGRendererComponent } from './svg.component';

describe('SVGRendererComponent', () => {
    let component: SVGRendererComponent;
    let fixture: ComponentFixture<SVGRendererComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SVGRendererComponent]
        });
        fixture = TestBed.createComponent(SVGRendererComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
