import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricelistdialogComponent } from './pricelistdialog.component';

describe('PricelistdialogComponent', () => {
  let component: PricelistdialogComponent;
  let fixture: ComponentFixture<PricelistdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricelistdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricelistdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
