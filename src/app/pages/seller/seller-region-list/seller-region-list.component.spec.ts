import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerRegionListComponent } from './seller-region-list.component';

describe('SellerRegionListComponent', () => {
  let component: SellerRegionListComponent;
  let fixture: ComponentFixture<SellerRegionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerRegionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerRegionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
