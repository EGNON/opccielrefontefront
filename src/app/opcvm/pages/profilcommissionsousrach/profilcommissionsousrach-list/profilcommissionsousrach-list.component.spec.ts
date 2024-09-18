import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilcommissionsousrachListComponent } from './profilcommissionsousrach-list.component';

describe('ProfilcommissionsousrachListComponent', () => {
  let component: ProfilcommissionsousrachListComponent;
  let fixture: ComponentFixture<ProfilcommissionsousrachListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfilcommissionsousrachListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfilcommissionsousrachListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
