import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoryItemsDialogComponent } from './sub-category-items-dialog.component';

describe('SubCategoryItemsDialogComponent', () => {
  let component: SubCategoryItemsDialogComponent;
  let fixture: ComponentFixture<SubCategoryItemsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubCategoryItemsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategoryItemsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
