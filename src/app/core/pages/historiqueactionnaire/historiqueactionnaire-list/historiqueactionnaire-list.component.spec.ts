import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueactionnaireListComponent } from './historiqueactionnaire-list.component';

describe('HistoriqueactionnaireListComponent', () => {
  let component: HistoriqueactionnaireListComponent;
  let fixture: ComponentFixture<HistoriqueactionnaireListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoriqueactionnaireListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoriqueactionnaireListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
