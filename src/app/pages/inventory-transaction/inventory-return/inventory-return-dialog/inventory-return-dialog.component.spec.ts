import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReturnDialogComponent } from './inventory-return-dialog.component';

describe('InventoryReturnDialogComponent', () => {
  let component: InventoryReturnDialogComponent;
  let fixture: ComponentFixture<InventoryReturnDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryReturnDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryReturnDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
