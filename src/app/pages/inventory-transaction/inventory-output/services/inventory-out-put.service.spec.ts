import { TestBed } from '@angular/core/testing';

import { InventoryOutPutService } from './inventory-out-put.service';

describe('InventoryOutPutService', () => {
  let service: InventoryOutPutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryOutPutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
