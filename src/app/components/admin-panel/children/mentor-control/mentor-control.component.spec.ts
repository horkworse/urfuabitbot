import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorControlComponent } from './mentor-control.component';

describe('MentorControlComponent', () => {
  let component: MentorControlComponent;
  let fixture: ComponentFixture<MentorControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentorControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
