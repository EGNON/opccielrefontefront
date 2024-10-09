import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPrint2Component } from './client-print2.component';

describe('ClientPrint2Component', () => {
  let component: ClientPrint2Component;
  let fixture: ComponentFixture<ClientPrint2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientPrint2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientPrint2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
