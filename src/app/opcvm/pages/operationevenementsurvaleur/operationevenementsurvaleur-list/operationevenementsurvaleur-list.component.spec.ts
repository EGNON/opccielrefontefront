import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationevenementsurvaleurListComponent } from './operationevenementsurvaleur-list.component';

describe('OperationevenementsurvaleurListComponent', () => {
  let component: OperationevenementsurvaleurListComponent;
  let fixture: ComponentFixture<OperationevenementsurvaleurListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationevenementsurvaleurListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationevenementsurvaleurListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
