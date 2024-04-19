import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasePaymentListComponent } from './purchase-payment-list.component';

describe('PurchasePaymentListComponent', () => {
  let component: PurchasePaymentListComponent;
  let fixture: ComponentFixture<PurchasePaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasePaymentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasePaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
