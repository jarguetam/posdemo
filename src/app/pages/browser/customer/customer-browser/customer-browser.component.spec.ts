import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerBrowserComponent } from './customer-browser.component';

describe('CustomerBrowserComponent', () => {
  let component: CustomerBrowserComponent;
  let fixture: ComponentFixture<CustomerBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerBrowserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
