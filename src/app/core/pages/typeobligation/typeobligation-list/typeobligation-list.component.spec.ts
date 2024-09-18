import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeobligationListComponent } from './typeobligation-list.component';

describe('TypeobligationListComponent', () => {
  let component: TypeobligationListComponent;
  let fixture: ComponentFixture<TypeobligationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeobligationListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeobligationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
