import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostRevaluationDialogComponent } from './cost-revaluation-dialog.component';

describe('CostRevaluationDialogComponent', () => {
  let component: CostRevaluationDialogComponent;
  let fixture: ComponentFixture<CostRevaluationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostRevaluationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostRevaluationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
