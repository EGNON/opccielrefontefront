import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeetablissementListComponent } from './modeetablissement-list.component';

describe('ModeetablissementListComponent', () => {
  let component: ModeetablissementListComponent;
  let fixture: ComponentFixture<ModeetablissementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeetablissementListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeetablissementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
