import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WareHouseDialogComponent } from './ware-house-dialog.component';

describe('WareHouseDialogComponent', () => {
  let component: WareHouseDialogComponent;
  let fixture: ComponentFixture<WareHouseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WareHouseDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WareHouseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
