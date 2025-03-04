import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertPartsListComponent } from './transfert-parts-list.component';

describe('TransfertPartsListComponent', () => {
  let component: TransfertPartsListComponent;
  let fixture: ComponentFixture<TransfertPartsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransfertPartsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransfertPartsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
