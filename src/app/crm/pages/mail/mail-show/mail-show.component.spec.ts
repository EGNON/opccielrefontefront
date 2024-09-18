import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailShowComponent } from './mail-show.component';

describe('MailShowComponent', () => {
  let component: MailShowComponent;
  let fixture: ComponentFixture<MailShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MailShowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MailShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
