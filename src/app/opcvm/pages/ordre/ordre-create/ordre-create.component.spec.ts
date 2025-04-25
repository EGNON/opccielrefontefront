import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdreCreateComponent } from './ordre-create.component';

describe('OrdreCreateComponent', () => {
  let component: OrdreCreateComponent;
  let fixture: ComponentFixture<OrdreCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdreCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdreCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
