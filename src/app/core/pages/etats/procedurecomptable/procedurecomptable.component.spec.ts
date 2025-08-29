import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedurecomptableComponent } from './procedurecomptable.component';

describe('ProcedurecomptableComponent', () => {
  let component: ProcedurecomptableComponent;
  let fixture: ComponentFixture<ProcedurecomptableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcedurecomptableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProcedurecomptableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
