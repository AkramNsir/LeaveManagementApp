import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoughnutDashComponent } from './doughnut-dash.component';

describe('DoughnutDashComponent', () => {
  let component: DoughnutDashComponent;
  let fixture: ComponentFixture<DoughnutDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoughnutDashComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoughnutDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
