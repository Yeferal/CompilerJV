import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOpenProjectComponent } from './modal-open-project.component';

describe('ModalOpenProjectComponent', () => {
  let component: ModalOpenProjectComponent;
  let fixture: ComponentFixture<ModalOpenProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalOpenProjectComponent]
    });
    fixture = TestBed.createComponent(ModalOpenProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
