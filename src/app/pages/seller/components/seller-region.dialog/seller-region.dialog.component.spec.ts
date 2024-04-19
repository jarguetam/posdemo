import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerRegionDialogComponent } from './seller-region.dialog.component';

describe('SellerRegion.DialogComponent', () => {
  let component: SellerRegionDialogComponent;
  let fixture: ComponentFixture<SellerRegionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerRegionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerRegionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
