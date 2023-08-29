import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEllipseNotificationComponent } from './search-ellipse-notification.component';

describe('SearchEllipseNotificationComponent', () => {
  let component: SearchEllipseNotificationComponent;
  let fixture: ComponentFixture<SearchEllipseNotificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchEllipseNotificationComponent]
    });
    fixture = TestBed.createComponent(SearchEllipseNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
