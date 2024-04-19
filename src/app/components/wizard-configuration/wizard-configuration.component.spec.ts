import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardConfigurationComponent } from './wizard-configuration.component';

describe('WizardConfigurationComponent', () => {
  let component: WizardConfigurationComponent;
  let fixture: ComponentFixture<WizardConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WizardConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
