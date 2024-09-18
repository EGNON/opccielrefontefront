import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompartimentListComponent } from './compartiment-list.component';

describe('CompartimentListComponent', () => {
  let component: CompartimentListComponent;
  let fixture: ComponentFixture<CompartimentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompartimentListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompartimentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
