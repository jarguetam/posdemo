import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPriceListAssignmentComponent } from './customer-price-list-assignment.component';

describe('CustomerPriceListAssignmentComponent', () => {
  let component: CustomerPriceListAssignmentComponent;
  let fixture: ComponentFixture<CustomerPriceListAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerPriceListAssignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPriceListAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
