import { TestBed } from '@angular/core/testing';

import { ServiceWareHouseService } from './service-ware-house.service';

describe('ServiceWareHouseService', () => {
  let service: ServiceWareHouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceWareHouseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
