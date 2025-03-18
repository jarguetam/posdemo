import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BluetoothDeviceSelectorComponent } from './bluetooth-device-selector.component';

describe('BluetoothDeviceSelectorComponent', () => {
  let component: BluetoothDeviceSelectorComponent;
  let fixture: ComponentFixture<BluetoothDeviceSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BluetoothDeviceSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BluetoothDeviceSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
