import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarDashComponent } from './bar-dash.component';

describe('BarDashComponent', () => {
  let component: BarDashComponent;
  let fixture: ComponentFixture<BarDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BarDashComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
