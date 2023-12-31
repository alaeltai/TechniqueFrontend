import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropZoneComponent } from './dropzone.component';

describe('DropZoneComponent', () => {
    let component: DropZoneComponent;
    let fixture: ComponentFixture<DropZoneComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DropZoneComponent]
        });
        fixture = TestBed.createComponent(DropZoneComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
