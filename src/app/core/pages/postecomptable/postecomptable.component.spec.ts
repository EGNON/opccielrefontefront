import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostecomptableComponent } from './postecomptable.component';

describe('PostecomptableComponent', () => {
  let component: PostecomptableComponent;
  let fixture: ComponentFixture<PostecomptableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostecomptableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostecomptableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
