import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoryItemsListComponent } from './sub-category-items-list.component';

describe('SubCategoryItemsListComponent', () => {
  let component: SubCategoryItemsListComponent;
  let fixture: ComponentFixture<SubCategoryItemsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubCategoryItemsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategoryItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
