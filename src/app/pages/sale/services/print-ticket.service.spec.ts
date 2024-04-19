import { TestBed } from '@angular/core/testing';

import { PrintTicketService } from './print-ticket.service';

describe('PrintTicketService', () => {
  let service: PrintTicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintTicketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
