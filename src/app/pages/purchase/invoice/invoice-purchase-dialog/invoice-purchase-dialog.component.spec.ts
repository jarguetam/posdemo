import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePurchaseDialogComponent } from './invoice-purchase-dialog.component';

describe('InvoicePurchaseDialogComponent', () => {
  let component: InvoicePurchaseDialogComponent;
  let fixture: ComponentFixture<InvoicePurchaseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicePurchaseDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePurchaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
