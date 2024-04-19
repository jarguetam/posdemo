import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryItemsListComponent } from './category-items-list.component';

describe('CategoryItemsListComponent', () => {
  let component: CategoryItemsListComponent;
  let fixture: ComponentFixture<CategoryItemsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryItemsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
