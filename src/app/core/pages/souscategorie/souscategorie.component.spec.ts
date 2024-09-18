import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SouscategorieComponent } from './souscategorie.component';

describe('SouscategorieComponent', () => {
  let component: SouscategorieComponent;
  let fixture: ComponentFixture<SouscategorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SouscategorieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SouscategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
