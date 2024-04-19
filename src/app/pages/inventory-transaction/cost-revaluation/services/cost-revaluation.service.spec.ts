import { TestBed } from '@angular/core/testing';

import { CostRevaluationService } from './cost-revaluation.service';

describe('CostRevaluationService', () => {
  let service: CostRevaluationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CostRevaluationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
