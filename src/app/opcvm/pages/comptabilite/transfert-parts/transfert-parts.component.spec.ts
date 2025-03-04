import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertPartsComponent } from './transfert-parts.component';

describe('TransfertPartsComponent', () => {
  let component: TransfertPartsComponent;
  let fixture: ComponentFixture<TransfertPartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransfertPartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransfertPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
