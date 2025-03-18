import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemBrowserTransferComponent } from './item-browser-transfer.component';

describe('ItemBrowserTransferComponent', () => {
  let component: ItemBrowserTransferComponent;
  let fixture: ComponentFixture<ItemBrowserTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemBrowserTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemBrowserTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
