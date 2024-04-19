import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCompanyInfoComponent } from './list.company-info.component';

describe('List.CompanyInfoComponent', () => {
  let component: ListCompanyInfoComponent;
  let fixture: ComponentFixture<ListCompanyInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCompanyInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCompanyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
