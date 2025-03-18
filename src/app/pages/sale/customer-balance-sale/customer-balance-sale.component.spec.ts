import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerBalanceSaleComponent } from './customer-balance-sale.component';

describe('CustomerBalanceSaleComponent', () => {
  let component: CustomerBalanceSaleComponent;
  let fixture: ComponentFixture<CustomerBalanceSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerBalanceSaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerBalanceSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
