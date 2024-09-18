import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientnayantinvestiComponent } from './clientnayantinvesti.component';

describe('ClientnayantinvestiComponent', () => {
  let component: ClientnayantinvestiComponent;
  let fixture: ComponentFixture<ClientnayantinvestiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientnayantinvestiComponent]
    });
    fixture = TestBed.createComponent(ClientnayantinvestiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
