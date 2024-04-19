import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAccountListComponent } from './customer-account-list.component';

describe('CustomerAccountListComponent', () => {
  let component: CustomerAccountListComponent;
  let fixture: ComponentFixture<CustomerAccountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerAccountListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
