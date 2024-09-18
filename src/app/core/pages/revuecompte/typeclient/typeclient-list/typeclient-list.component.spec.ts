import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeclientListComponent } from './typeclient-list.component';

describe('TypeclientListComponent', () => {
  let component: TypeclientListComponent;
  let fixture: ComponentFixture<TypeclientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeclientListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeclientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
