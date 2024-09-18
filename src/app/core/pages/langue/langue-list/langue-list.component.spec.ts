import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangueListComponent } from './langue-list.component';

describe('LangueListComponent', () => {
  let component: LangueListComponent;
  let fixture: ComponentFixture<LangueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LangueListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LangueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
