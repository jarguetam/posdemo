import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTransferRequestDialogComponent } from './inventory-transfer-request-dialog.component';

describe('InventoryTransferRequestDialogComponent', () => {
  let component: InventoryTransferRequestDialogComponent;
  let fixture: ComponentFixture<InventoryTransferRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryTransferRequestDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryTransferRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
