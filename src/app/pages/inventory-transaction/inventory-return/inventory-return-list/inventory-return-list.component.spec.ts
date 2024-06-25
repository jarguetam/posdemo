import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReturnListComponent } from './inventory-return-list.component';

describe('InventoryReturnListComponent', () => {
  let component: InventoryReturnListComponent;
  let fixture: ComponentFixture<InventoryReturnListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryReturnListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryReturnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
