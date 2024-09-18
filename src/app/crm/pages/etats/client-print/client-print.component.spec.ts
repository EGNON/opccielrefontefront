import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPrintComponent } from './client-print.component';

describe('ClientPrintComponent', () => {
  let component: ClientPrintComponent;
  let fixture: ComponentFixture<ClientPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientPrintComponent]
    });
    fixture = TestBed.createComponent(ClientPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
