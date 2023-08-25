import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityCollapseComponent } from './entity-collapse.component';

describe('EntityCollapseComponent', () => {
  let component: EntityCollapseComponent;
  let fixture: ComponentFixture<EntityCollapseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntityCollapseComponent]
    });
    fixture = TestBed.createComponent(EntityCollapseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
