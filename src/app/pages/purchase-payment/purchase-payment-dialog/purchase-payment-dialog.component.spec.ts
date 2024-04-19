import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasePaymentDialogComponent } from './purchase-payment-dialog.component';

describe('PurchasePaymentDialogComponent', () => {
  let component: PurchasePaymentDialogComponent;
  let fixture: ComponentFixture<PurchasePaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasePaymentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasePaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
