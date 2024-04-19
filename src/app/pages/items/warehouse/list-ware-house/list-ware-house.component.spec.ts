import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWareHouseComponent } from './list-ware-house.component';

describe('ListWareHouseComponent', () => {
  let component: ListWareHouseComponent;
  let fixture: ComponentFixture<ListWareHouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListWareHouseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWareHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
