import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubphaseComponent } from './subphase.component';

describe('SubphaseComponent', () => {
  let component: SubphaseComponent;
  let fixture: ComponentFixture<SubphaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubphaseComponent]
    });
    fixture = TestBed.createComponent(SubphaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
