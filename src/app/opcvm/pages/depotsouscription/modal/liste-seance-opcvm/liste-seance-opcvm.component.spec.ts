import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeSeanceOpcvmComponent } from './liste-seance-opcvm.component';

describe('ListeSeanceOpcvmComponent', () => {
  let component: ListeSeanceOpcvmComponent;
  let fixture: ComponentFixture<ListeSeanceOpcvmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListeSeanceOpcvmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeSeanceOpcvmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
