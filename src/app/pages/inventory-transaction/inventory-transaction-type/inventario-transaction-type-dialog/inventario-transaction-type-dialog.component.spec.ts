import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioTransactionTypeDialogComponent } from './inventario-transaction-type-dialog.component';

describe('InventarioTransactionTypeDialogComponent', () => {
  let component: InventarioTransactionTypeDialogComponent;
  let fixture: ComponentFixture<InventarioTransactionTypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventarioTransactionTypeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioTransactionTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
