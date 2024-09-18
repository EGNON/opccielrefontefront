import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeobligationComponent } from './typeobligation.component';

describe('TypeobligationComponent', () => {
  let component: TypeobligationComponent;
  let fixture: ComponentFixture<TypeobligationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeobligationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeobligationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
