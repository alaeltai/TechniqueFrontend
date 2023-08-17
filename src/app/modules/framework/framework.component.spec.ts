import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameworkComponent } from './framework.component';

describe('FrameworkComponent', () => {
  let component: FrameworkComponent;
  let fixture: ComponentFixture<FrameworkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FrameworkComponent]
    });
    fixture = TestBed.createComponent(FrameworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
