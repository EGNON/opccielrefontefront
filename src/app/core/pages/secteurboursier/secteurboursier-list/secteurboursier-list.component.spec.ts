import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecteurboursierListComponent } from './secteurboursier-list.component';

describe('SecteurboursierListComponent', () => {
  let component: SecteurboursierListComponent;
  let fixture: ComponentFixture<SecteurboursierListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecteurboursierListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecteurboursierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
