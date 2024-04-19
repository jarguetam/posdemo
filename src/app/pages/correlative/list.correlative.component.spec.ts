import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCorrelativeComponent } from './list.correlative.component';

describe('List.CorrelativeComponent', () => {
  let component: ListCorrelativeComponent;
  let fixture: ComponentFixture<ListCorrelativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCorrelativeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCorrelativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
