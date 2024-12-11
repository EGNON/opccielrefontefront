import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisrachatListComponent } from './avisrachat-list.component';

describe('AvisrachatListComponent', () => {
  let component: AvisrachatListComponent;
  let fixture: ComponentFixture<AvisrachatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvisrachatListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvisrachatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
