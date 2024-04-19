import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitOfMeasureDialogComponent } from './unit-of-measure-dialog.component';

describe('UnitOfMeasureDialogComponent', () => {
  let component: UnitOfMeasureDialogComponent;
  let fixture: ComponentFixture<UnitOfMeasureDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitOfMeasureDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitOfMeasureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
