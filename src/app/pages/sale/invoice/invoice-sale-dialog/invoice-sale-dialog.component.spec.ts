import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSaleDialogComponent } from './invoice-sale-dialog.component';

describe('InvoiceSaleDialogComponent', () => {
  let component: InvoiceSaleDialogComponent;
  let fixture: ComponentFixture<InvoiceSaleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceSaleDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceSaleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
