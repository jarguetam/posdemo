import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSaleComponent } from './invoice-sale.component';

describe('InvoiceSaleComponent', () => {
  let component: InvoiceSaleComponent;
  let fixture: ComponentFixture<InvoiceSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceSaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
