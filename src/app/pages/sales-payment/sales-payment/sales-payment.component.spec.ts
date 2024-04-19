import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPaymentComponent } from './sales-payment.component';

describe('SalesPaymentComponent', () => {
  let component: SalesPaymentComponent;
  let fixture: ComponentFixture<SalesPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
