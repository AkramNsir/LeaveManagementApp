import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeDashComponent } from './gauge-dash.component';

describe('GaugeDashComponent', () => {
  let component: GaugeDashComponent;
  let fixture: ComponentFixture<GaugeDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GaugeDashComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GaugeDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
