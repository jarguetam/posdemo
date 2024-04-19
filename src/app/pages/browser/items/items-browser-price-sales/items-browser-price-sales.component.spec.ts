import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsBrowserPriceSalesComponent } from './items-browser-price-sales.component';

describe('ItemsBrowserPriceSalesComponent', () => {
  let component: ItemsBrowserPriceSalesComponent;
  let fixture: ComponentFixture<ItemsBrowserPriceSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsBrowserPriceSalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsBrowserPriceSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
