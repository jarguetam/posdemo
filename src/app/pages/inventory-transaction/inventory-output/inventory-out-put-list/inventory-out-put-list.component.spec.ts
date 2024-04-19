import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOutPutListComponent } from './inventory-out-put-list.component';

describe('InventoryOutPutListComponent', () => {
  let component: InventoryOutPutListComponent;
  let fixture: ComponentFixture<InventoryOutPutListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryOutPutListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryOutPutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
