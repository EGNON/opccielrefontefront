import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarificationordinaireAddEditComponent } from './tarificationordinaire-add-edit.component';

describe('TarificationordinaireAddEditComponent', () => {
  let component: TarificationordinaireAddEditComponent;
  let fixture: ComponentFixture<TarificationordinaireAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TarificationordinaireAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TarificationordinaireAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
