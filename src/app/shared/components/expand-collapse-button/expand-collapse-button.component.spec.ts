import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandCollapseButtonComponent } from './expand-collapse-button.component';

describe('ExpandCollapseButtonComponent', () => {
  let component: ExpandCollapseButtonComponent;
  let fixture: ComponentFixture<ExpandCollapseButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpandCollapseButtonComponent]
    });
    fixture = TestBed.createComponent(ExpandCollapseButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
