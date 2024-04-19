import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPointSaleComponent } from './list.point-sale.component';

describe('List.PointSaleComponent', () => {
  let component: ListPointSaleComponent;
  let fixture: ComponentFixture<ListPointSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPointSaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPointSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
