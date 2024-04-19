import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSaleListComponent } from './invoice-sale-list.component';

describe('InvoiceSaleListComponent', () => {
  let component: InvoiceSaleListComponent;
  let fixture: ComponentFixture<InvoiceSaleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceSaleListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceSaleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
