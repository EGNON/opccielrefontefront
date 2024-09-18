import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompterenduShowComponent } from './compterendu-show.component';

describe('CompterenduShowComponent', () => {
  let component: CompterenduShowComponent;
  let fixture: ComponentFixture<CompterenduShowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompterenduShowComponent]
    });
    fixture = TestBed.createComponent(CompterenduShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
