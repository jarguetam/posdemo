import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSpecialPriceDialogComponent } from './customer-special-price-dialog.component';

describe('CustomerSpecialPriceDialogComponent', () => {
  let component: CustomerSpecialPriceDialogComponent;
  let fixture: ComponentFixture<CustomerSpecialPriceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSpecialPriceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSpecialPriceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
