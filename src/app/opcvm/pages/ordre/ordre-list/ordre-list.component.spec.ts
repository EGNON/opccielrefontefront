import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdreListComponent } from './ordre-list.component';

describe('OrdreListComponent', () => {
  let component: OrdreListComponent;
  let fixture: ComponentFixture<OrdreListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdreListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
