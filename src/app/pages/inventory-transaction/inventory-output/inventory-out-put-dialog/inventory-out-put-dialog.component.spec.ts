import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOutPutDialogComponent } from './inventory-out-put-dialog.component';

describe('InventoryOutPutDialogComponent', () => {
  let component: InventoryOutPutDialogComponent;
  let fixture: ComponentFixture<InventoryOutPutDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryOutPutDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryOutPutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
