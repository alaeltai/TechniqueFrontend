import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeViewerComponent } from './tree-viewer.component';

describe('TreeViewerComponent', () => {
  let component: TreeViewerComponent;
  let fixture: ComponentFixture<TreeViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TreeViewerComponent]
    });
    fixture = TestBed.createComponent(TreeViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
