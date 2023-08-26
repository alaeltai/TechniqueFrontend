import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnViewerComponent } from './column-viewer.component';

describe('ColumnViewerComponent', () => {
    let component: ColumnViewerComponent;
    let fixture: ComponentFixture<ColumnViewerComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ColumnViewerComponent]
        });
        fixture = TestBed.createComponent(ColumnViewerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
