import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryEntryDialogComponent } from './inventory-entry-dialog.component';

describe('InventoryEntryDialogComponent', () => {
  let component: InventoryEntryDialogComponent;
  let fixture: ComponentFixture<InventoryEntryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryEntryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
