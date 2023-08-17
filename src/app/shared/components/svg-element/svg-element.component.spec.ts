import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SVGNodeRendererComponent } from '../svg-element/svg-element.component';

describe('SVGRendererComponent', () => {
    let component: SVGNodeRendererComponent;
    let fixture: ComponentFixture<SVGNodeRendererComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SVGNodeRendererComponent]
        });
        fixture = TestBed.createComponent(SVGNodeRendererComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
