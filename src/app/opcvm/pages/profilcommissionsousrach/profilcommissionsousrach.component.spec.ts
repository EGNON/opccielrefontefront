import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilcommissionsousrachComponent } from './profilcommissionsousrach.component';

describe('ProfilcommissionsousrachComponent', () => {
  let component: ProfilcommissionsousrachComponent;
  let fixture: ComponentFixture<ProfilcommissionsousrachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfilcommissionsousrachComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfilcommissionsousrachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
