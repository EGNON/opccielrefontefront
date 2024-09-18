import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrespondanceListComponent } from './correspondance-list.component';

describe('CorrespondanceListComponent', () => {
  let component: CorrespondanceListComponent;
  let fixture: ComponentFixture<CorrespondanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CorrespondanceListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorrespondanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
