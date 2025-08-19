import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelevetitrefcpComponent } from './relevetitrefcp.component';

describe('RelevetitrefcpComponent', () => {
  let component: RelevetitrefcpComponent;
  let fixture: ComponentFixture<RelevetitrefcpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelevetitrefcpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RelevetitrefcpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
