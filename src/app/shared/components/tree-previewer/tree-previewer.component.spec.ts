import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreePreviewerComponent } from './tree-previewer.component';

describe('TreePreviewerComponent', () => {
    let component: TreePreviewerComponent;
    let fixture: ComponentFixture<TreePreviewerComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TreePreviewerComponent]
        });
        fixture = TestBed.createComponent(TreePreviewerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
