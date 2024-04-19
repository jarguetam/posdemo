import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidationDialogComponent } from './liquidation-dialog.component';

describe('LiquidationDialogComponent', () => {
  let component: LiquidationDialogComponent;
  let fixture: ComponentFixture<LiquidationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
