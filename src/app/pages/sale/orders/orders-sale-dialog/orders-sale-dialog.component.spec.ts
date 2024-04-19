import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersSaleDialogComponent } from './orders-sale-dialog.component';

describe('OrdersSaleDialogComponent', () => {
  let component: OrdersSaleDialogComponent;
  let fixture: ComponentFixture<OrdersSaleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersSaleDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersSaleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
