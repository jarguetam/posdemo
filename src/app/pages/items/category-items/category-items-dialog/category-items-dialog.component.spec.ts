import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryItemsDialogComponent } from './category-items-dialog.component';

describe('CategoryItemsDialogComponent', () => {
  let component: CategoryItemsDialogComponent;
  let fixture: ComponentFixture<CategoryItemsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryItemsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryItemsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
