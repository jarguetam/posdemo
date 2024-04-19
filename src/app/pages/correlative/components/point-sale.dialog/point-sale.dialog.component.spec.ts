import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointSaleDialogComponent } from './point-sale.dialog.component';

describe('PointSale.DialogComponent', () => {
  let component: PointSaleDialogComponent;
  let fixture: ComponentFixture<PointSaleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointSaleDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PointSaleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
