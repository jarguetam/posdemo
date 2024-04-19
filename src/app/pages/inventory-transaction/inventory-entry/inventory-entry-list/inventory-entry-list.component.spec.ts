import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryEntryListComponent } from './inventory-entry-list.component';

describe('InventoryEntryListComponent', () => {
  let component: InventoryEntryListComponent;
  let fixture: ComponentFixture<InventoryEntryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryEntryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryEntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
