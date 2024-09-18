import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecensementopeffectueesComponent } from './recensementopeffectuees.component';

describe('RecensementopeffectueesComponent', () => {
  let component: RecensementopeffectueesComponent;
  let fixture: ComponentFixture<RecensementopeffectueesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecensementopeffectueesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecensementopeffectueesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
