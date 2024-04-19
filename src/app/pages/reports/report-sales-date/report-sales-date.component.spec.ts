import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSalesDateComponent } from './report-sales-date.component';

describe('ReportSalesDateComponent', () => {
  let component: ReportSalesDateComponent;
  let fixture: ComponentFixture<ReportSalesDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportSalesDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSalesDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
