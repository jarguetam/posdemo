import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsBrowserPurchaseComponent } from './items-browser-purchase.component';

describe('ItemsBrowserPurchaseComponent', () => {
  let component: ItemsBrowserPurchaseComponent;
  let fixture: ComponentFixture<ItemsBrowserPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsBrowserPurchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsBrowserPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
