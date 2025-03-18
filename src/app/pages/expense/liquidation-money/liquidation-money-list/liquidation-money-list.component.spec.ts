import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidationMoneyListComponent } from './liquidation-money-list.component';

describe('LiquidationMoneyListComponent', () => {
  let component: LiquidationMoneyListComponent;
  let fixture: ComponentFixture<LiquidationMoneyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidationMoneyListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidationMoneyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
