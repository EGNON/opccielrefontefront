import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecteurboursierComponent } from './secteurboursier.component';

describe('SecteurboursierComponent', () => {
  let component: SecteurboursierComponent;
  let fixture: ComponentFixture<SecteurboursierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecteurboursierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecteurboursierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
