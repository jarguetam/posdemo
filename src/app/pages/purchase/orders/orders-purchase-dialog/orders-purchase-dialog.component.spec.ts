import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersPurchaseDialogComponent } from './orders-purchase-dialog.component';

describe('OrdersPurchaseDialogComponent', () => {
  let component: OrdersPurchaseDialogComponent;
  let fixture: ComponentFixture<OrdersPurchaseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersPurchaseDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersPurchaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
