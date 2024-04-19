import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTransferRequestToCompleteComponent } from './inventory-transfer-request-to-complete.component';

describe('InventoryTransferRequestToCompleteComponent', () => {
  let component: InventoryTransferRequestToCompleteComponent;
  let fixture: ComponentFixture<InventoryTransferRequestToCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryTransferRequestToCompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryTransferRequestToCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
