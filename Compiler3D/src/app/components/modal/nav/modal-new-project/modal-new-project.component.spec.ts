import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewProjectComponent } from './modal-new-project.component';

describe('ModalNewProjectComponent', () => {
  let component: ModalNewProjectComponent;
  let fixture: ComponentFixture<ModalNewProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalNewProjectComponent]
    });
    fixture = TestBed.createComponent(ModalNewProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
