import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExitConfirmationComponent } from './create-exit-confirmation.component';

describe('CreateExitConfirmationComponent', () => {
  let component: CreateExitConfirmationComponent;
  let fixture: ComponentFixture<CreateExitConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateExitConfirmationComponent]
    });
    fixture = TestBed.createComponent(CreateExitConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
