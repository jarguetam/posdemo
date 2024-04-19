import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySupplierDialogComponent } from './category-supplier-dialog.component';

describe('CategorySupplierDialogComponent', () => {
  let component: CategorySupplierDialogComponent;
  let fixture: ComponentFixture<CategorySupplierDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorySupplierDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorySupplierDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
