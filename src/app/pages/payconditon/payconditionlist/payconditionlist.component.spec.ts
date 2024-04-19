import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayconditionlistComponent } from './payconditionlist.component';

describe('PayconditionlistComponent', () => {
  let component: PayconditionlistComponent;
  let fixture: ComponentFixture<PayconditionlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayconditionlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayconditionlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
