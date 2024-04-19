import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayconditiondialogComponent } from './payconditiondialog.component';

describe('PayconditiondialogComponent', () => {
  let component: PayconditiondialogComponent;
  let fixture: ComponentFixture<PayconditiondialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayconditiondialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayconditiondialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
