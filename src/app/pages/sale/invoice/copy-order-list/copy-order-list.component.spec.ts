import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyOrderListComponent } from './copy-order-list.component';

describe('CopyOrderListComponent', () => {
  let component: CopyOrderListComponent;
  let fixture: ComponentFixture<CopyOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyOrderListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
