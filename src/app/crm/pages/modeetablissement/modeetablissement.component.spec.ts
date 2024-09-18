import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeetablissementComponent } from './modeetablissement.component';

describe('ModeetablissementComponent', () => {
  let component: ModeetablissementComponent;
  let fixture: ComponentFixture<ModeetablissementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeetablissementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeetablissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
