import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPaymentListComponent } from './sales-payment-list.component';

describe('SalesPaymentListComponent', () => {
  let component: SalesPaymentListComponent;
  let fixture: ComponentFixture<SalesPaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesPaymentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
