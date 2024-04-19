import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePurchaseListComponent } from './invoice-purchase-list.component';

describe('InvoicePurchaseListComponent', () => {
  let component: InvoicePurchaseListComponent;
  let fixture: ComponentFixture<InvoicePurchaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicePurchaseListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePurchaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
