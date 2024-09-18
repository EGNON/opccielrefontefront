import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeobligationAddEditComponent } from './typeobligation-add-edit.component';

describe('TypeobligationAddEditComponent', () => {
  let component: TypeobligationAddEditComponent;
  let fixture: ComponentFixture<TypeobligationAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeobligationAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeobligationAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
