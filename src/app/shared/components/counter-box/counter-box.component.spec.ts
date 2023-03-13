import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterBoxComponent } from './counter-box.component';

describe('CounterBoxComponent', () => {
  let component: CounterBoxComponent;
  let fixture: ComponentFixture<CounterBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CounterBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CounterBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
