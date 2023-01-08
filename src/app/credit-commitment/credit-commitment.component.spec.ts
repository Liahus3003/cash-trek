import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCommitmentComponent } from './credit-commitment.component';

describe('CreditCommitmentComponent', () => {
  let component: CreditCommitmentComponent;
  let fixture: ComponentFixture<CreditCommitmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCommitmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCommitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
