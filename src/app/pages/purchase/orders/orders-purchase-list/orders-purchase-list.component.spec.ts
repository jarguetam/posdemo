import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersPurchaseListComponent } from './orders-purchase-list.component';

describe('OrdersPurchaseListComponent', () => {
  let component: OrdersPurchaseListComponent;
  let fixture: ComponentFixture<OrdersPurchaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersPurchaseListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersPurchaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
