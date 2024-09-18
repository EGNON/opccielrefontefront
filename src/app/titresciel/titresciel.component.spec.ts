import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitrescielComponent } from './titresciel.component';

describe('TitrescielComponent', () => {
  let component: TitrescielComponent;
  let fixture: ComponentFixture<TitrescielComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TitrescielComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TitrescielComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
