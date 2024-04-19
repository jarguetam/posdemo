import { TestBed } from '@angular/core/testing';

import { PrintCostRevaluationService } from './print-cost-revaluation.service';

describe('PrintCostRevaluationService', () => {
  let service: PrintCostRevaluationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintCostRevaluationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
