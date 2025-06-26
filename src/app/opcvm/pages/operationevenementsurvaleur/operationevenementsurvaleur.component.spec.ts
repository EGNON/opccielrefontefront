import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationevenementsurvaleurComponent } from './operationevenementsurvaleur.component';

describe('OperationevenementsurvaleurComponent', () => {
  let component: OperationevenementsurvaleurComponent;
  let fixture: ComponentFixture<OperationevenementsurvaleurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationevenementsurvaleurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationevenementsurvaleurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
