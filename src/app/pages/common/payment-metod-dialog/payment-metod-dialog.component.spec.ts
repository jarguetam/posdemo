import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMetodDialogComponent } from './payment-metod-dialog.component';

describe('PaymentMetodDialogComponent', () => {
  let component: PaymentMetodDialogComponent;
  let fixture: ComponentFixture<PaymentMetodDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentMetodDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentMetodDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
