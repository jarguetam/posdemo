import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricelistDetailComponent } from './pricelist-detail.component';

describe('PricelistDetailComponent', () => {
  let component: PricelistDetailComponent;
  let fixture: ComponentFixture<PricelistDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricelistDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricelistDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
