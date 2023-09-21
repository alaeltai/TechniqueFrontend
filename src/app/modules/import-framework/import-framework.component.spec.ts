import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFrameworkComponent } from './import-framework.component';

describe('ImportFrameworkComponent', () => {
  let component: ImportFrameworkComponent;
  let fixture: ComponentFixture<ImportFrameworkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportFrameworkComponent]
    });
    fixture = TestBed.createComponent(ImportFrameworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
