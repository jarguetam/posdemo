import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewJornalBpDialogComponent } from './view-jornal-bp-dialog.component';

describe('ViewJornalBpDialogComponent', () => {
  let component: ViewJornalBpDialogComponent;
  let fixture: ComponentFixture<ViewJornalBpDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewJornalBpDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewJornalBpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
