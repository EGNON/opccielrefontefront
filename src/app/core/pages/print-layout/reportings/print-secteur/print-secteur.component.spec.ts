import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSecteurComponent } from './print-secteur.component';

describe('PrintSecteurComponent', () => {
  let component: PrintSecteurComponent;
  let fixture: ComponentFixture<PrintSecteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrintSecteurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintSecteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
