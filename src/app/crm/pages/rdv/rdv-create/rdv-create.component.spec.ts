import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdvCreateComponent } from './rdv-create.component';

describe('RdvCreateComponent', () => {
  let component: RdvCreateComponent;
  let fixture: ComponentFixture<RdvCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RdvCreateComponent]
    });
    fixture = TestBed.createComponent(RdvCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
