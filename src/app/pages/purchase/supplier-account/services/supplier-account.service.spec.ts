import { TestBed } from '@angular/core/testing';

import { SupplierAccountService } from './supplier-account.service';

describe('SupplierAccountService', () => {
  let service: SupplierAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
