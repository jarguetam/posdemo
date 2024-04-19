import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsBrowserWareHouseComponent } from './items-browser-ware-house.component';

describe('ItemsBrowserWareHouseComponent', () => {
  let component: ItemsBrowserWareHouseComponent;
  let fixture: ComponentFixture<ItemsBrowserWareHouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsBrowserWareHouseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsBrowserWareHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
