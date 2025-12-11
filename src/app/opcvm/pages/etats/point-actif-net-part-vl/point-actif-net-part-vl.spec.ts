import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointActifNetPartVl } from './point-actif-net-part-vl';

describe('PointActifNetPartVl', () => {
  let component: PointActifNetPartVl;
  let fixture: ComponentFixture<PointActifNetPartVl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PointActifNetPartVl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointActifNetPartVl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
