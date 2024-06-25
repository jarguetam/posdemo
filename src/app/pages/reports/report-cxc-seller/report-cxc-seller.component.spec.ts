import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCxcSellerComponent } from './report-cxc-seller.component';

describe('ReportCxcSellerComponent', () => {
  let component: ReportCxcSellerComponent;
  let fixture: ComponentFixture<ReportCxcSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportCxcSellerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCxcSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
