import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Avistransfertpart } from './avistransfertpart';

describe('Avistransfertpart', () => {
  let component: Avistransfertpart;
  let fixture: ComponentFixture<Avistransfertpart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Avistransfertpart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Avistransfertpart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
