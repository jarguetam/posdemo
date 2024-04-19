import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersSaleListComponent } from './orders-sale-list.component';

describe('OrdersSaleListComponent', () => {
  let component: OrdersSaleListComponent;
  let fixture: ComponentFixture<OrdersSaleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersSaleListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersSaleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
