import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SouscategorieListComponent } from './souscategorie-list.component';

describe('SouscategorieListComponent', () => {
  let component: SouscategorieListComponent;
  let fixture: ComponentFixture<SouscategorieListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SouscategorieListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SouscategorieListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
