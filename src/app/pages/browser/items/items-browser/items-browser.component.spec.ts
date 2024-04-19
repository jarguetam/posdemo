import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsBrowserComponent } from './items-browser.component';

describe('ItemsBrowserComponent', () => {
  let component: ItemsBrowserComponent;
  let fixture: ComponentFixture<ItemsBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsBrowserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
