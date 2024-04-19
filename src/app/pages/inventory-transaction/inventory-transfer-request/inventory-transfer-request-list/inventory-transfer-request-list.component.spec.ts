import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTransferRequestListComponent } from './inventory-transfer-request-list.component';

describe('InventoryTransferRequestListComponent', () => {
  let component: InventoryTransferRequestListComponent;
  let fixture: ComponentFixture<InventoryTransferRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryTransferRequestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryTransferRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
