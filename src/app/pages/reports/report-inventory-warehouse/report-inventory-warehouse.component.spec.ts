import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportInventoryWarehouseComponent } from './report-inventory-warehouse.component';

describe('ReportInventoryWarehouseComponent', () => {
  let component: ReportInventoryWarehouseComponent;
  let fixture: ComponentFixture<ReportInventoryWarehouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportInventoryWarehouseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportInventoryWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
