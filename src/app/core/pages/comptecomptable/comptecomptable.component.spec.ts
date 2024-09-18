import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComptecomptableComponent } from './comptecomptable.component';

describe('ComptecomptableComponent', () => {
  let component: ComptecomptableComponent;
  let fixture: ComponentFixture<ComptecomptableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComptecomptableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComptecomptableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
