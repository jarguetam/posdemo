import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportExpenseResumComponent } from './report-expense-resum.component';

describe('ReportExpenseResumComponent', () => {
  let component: ReportExpenseResumComponent;
  let fixture: ComponentFixture<ReportExpenseResumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportExpenseResumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportExpenseResumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
