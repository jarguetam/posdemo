import { TestBed } from '@angular/core/testing';

import { ConnectionStateService } from './connection-state.service';

describe('ConnectionStateService', () => {
  let service: ConnectionStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectionStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
