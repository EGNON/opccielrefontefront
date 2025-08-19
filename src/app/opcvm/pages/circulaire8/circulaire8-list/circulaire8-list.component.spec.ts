import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Circulaire8ListComponent } from './circulaire8-list.component';

describe('Circulaire8ListComponent', () => {
  let component: Circulaire8ListComponent;
  let fixture: ComponentFixture<Circulaire8ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Circulaire8ListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Circulaire8ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
