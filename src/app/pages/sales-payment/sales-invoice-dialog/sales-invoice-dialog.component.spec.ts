import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesInvoiceDialogComponent } from './sales-invoice-dialog.component';

describe('SalesInvoiceDialogComponent', () => {
  let component: SalesInvoiceDialogComponent;
  let fixture: ComponentFixture<SalesInvoiceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesInvoiceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesInvoiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
