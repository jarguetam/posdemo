import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrelativeDialogComponent } from './correlative.dialog.component';

describe('Correlative.DialogComponent', () => {
  let component: CorrelativeDialogComponent;
  let fixture: ComponentFixture<CorrelativeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrelativeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrelativeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
