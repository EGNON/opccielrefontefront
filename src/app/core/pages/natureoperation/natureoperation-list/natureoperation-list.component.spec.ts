import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NatureoperationListComponent } from './natureoperation-list.component';

describe('NatureoperationListComponent', () => {
  let component: NatureoperationListComponent;
  let fixture: ComponentFixture<NatureoperationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NatureoperationListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NatureoperationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
