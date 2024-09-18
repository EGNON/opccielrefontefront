import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilcommissionsousrachAddEditComponent } from './profilcommissionsousrach-add-edit.component';

describe('ProfilcommissionsousrachAddEditComponent', () => {
  let component: ProfilcommissionsousrachAddEditComponent;
  let fixture: ComponentFixture<ProfilcommissionsousrachAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfilcommissionsousrachAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfilcommissionsousrachAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
