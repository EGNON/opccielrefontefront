import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComptecomptableListComponent } from './comptecomptable-list.component';

describe('ComptecomptableListComponent', () => {
  let component: ComptecomptableListComponent;
  let fixture: ComponentFixture<ComptecomptableListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComptecomptableListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComptecomptableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
