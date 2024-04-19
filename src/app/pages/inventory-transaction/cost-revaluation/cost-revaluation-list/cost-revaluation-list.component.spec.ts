import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostRevaluationListComponent } from './cost-revaluation-list.component';

describe('CostRevaluationListComponent', () => {
  let component: CostRevaluationListComponent;
  let fixture: ComponentFixture<CostRevaluationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostRevaluationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostRevaluationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
