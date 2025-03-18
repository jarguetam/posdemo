import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportInventoryPdfComponent } from './report-inventory-pdf.component';

describe('ReportInventoryPdfComponent', () => {
  let component: ReportInventoryPdfComponent;
  let fixture: ComponentFixture<ReportInventoryPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportInventoryPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportInventoryPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
