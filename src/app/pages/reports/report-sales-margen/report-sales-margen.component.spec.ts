import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSalesMargenComponent } from './report-sales-margen.component';

describe('ReportSalesMargenComponent', () => {
  let component: ReportSalesMargenComponent;
  let fixture: ComponentFixture<ReportSalesMargenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportSalesMargenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSalesMargenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
