import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierBrowserComponent } from './supplier-browser.component';

describe('SupplierBrowserComponent', () => {
  let component: SupplierBrowserComponent;
  let fixture: ComponentFixture<SupplierBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierBrowserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
