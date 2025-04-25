import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpressionOrdreComponent } from './impression-ordre.component';

describe('ImpressionOrdreComponent', () => {
  let component: ImpressionOrdreComponent;
  let fixture: ComponentFixture<ImpressionOrdreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImpressionOrdreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImpressionOrdreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
