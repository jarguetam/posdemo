import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPaymentDialogComponent } from './sales-payment-dialog.component';

describe('SalesPaymentDialogComponent', () => {
  let component: SalesPaymentDialogComponent;
  let fixture: ComponentFixture<SalesPaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesPaymentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
