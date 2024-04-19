import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySupplierListComponent } from './category-supplier-list.component';

describe('CategorySupplierListComponent', () => {
  let component: CategorySupplierListComponent;
  let fixture: ComponentFixture<CategorySupplierListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorySupplierListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorySupplierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
