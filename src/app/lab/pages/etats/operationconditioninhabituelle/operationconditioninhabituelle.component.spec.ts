import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationconditioninhabituelleComponent } from './operationconditioninhabituelle.component';

describe('OperationconditioninhabituelleComponent', () => {
  let component: OperationconditioninhabituelleComponent;
  let fixture: ComponentFixture<OperationconditioninhabituelleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationconditioninhabituelleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationconditioninhabituelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
