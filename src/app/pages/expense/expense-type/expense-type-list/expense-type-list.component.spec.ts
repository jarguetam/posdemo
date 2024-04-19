import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTypeListComponent } from './expense-type-list.component';

describe('ExpenseTypeListComponent', () => {
  let component: ExpenseTypeListComponent;
  let fixture: ComponentFixture<ExpenseTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseTypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
