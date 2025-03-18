import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidationMoneyComponent } from './liquidation-money.component';

describe('LiquidationMoneyComponent', () => {
  let component: LiquidationMoneyComponent;
  let fixture: ComponentFixture<LiquidationMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidationMoneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidationMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
