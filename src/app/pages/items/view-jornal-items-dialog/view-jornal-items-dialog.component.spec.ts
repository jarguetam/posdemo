import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewJornalItemsDialogComponent } from './view-jornal-items-dialog.component';

describe('ViewJornalItemsDialogComponent', () => {
  let component: ViewJornalItemsDialogComponent;
  let fixture: ComponentFixture<ViewJornalItemsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewJornalItemsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewJornalItemsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
