import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeclientComponent } from './typeclient.component';

describe('TypeclientComponent', () => {
  let component: TypeclientComponent;
  let fixture: ComponentFixture<TypeclientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeclientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
