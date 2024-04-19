import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioTransactionTypeListComponent } from './inventario-transaction-type-list.component';

describe('InventarioTransactionTypeListComponent', () => {
  let component: InventarioTransactionTypeListComponent;
  let fixture: ComponentFixture<InventarioTransactionTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventarioTransactionTypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioTransactionTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
