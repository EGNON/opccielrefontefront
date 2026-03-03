import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Deletedefinitionarrondimodal } from './deletedefinitionarrondimodal';

describe('Deletedefinitionarrondimodal', () => {
  let component: Deletedefinitionarrondimodal;
  let fixture: ComponentFixture<Deletedefinitionarrondimodal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Deletedefinitionarrondimodal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Deletedefinitionarrondimodal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
