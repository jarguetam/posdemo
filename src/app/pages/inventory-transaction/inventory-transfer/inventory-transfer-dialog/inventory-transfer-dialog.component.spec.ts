import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTransferDialogComponent } from './inventory-transfer-dialog.component';

describe('InventoryTransferDialogComponent', () => {
  let component: InventoryTransferDialogComponent;
  let fixture: ComponentFixture<InventoryTransferDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryTransferDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryTransferDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
