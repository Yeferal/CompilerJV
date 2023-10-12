import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewFileComponent } from './modal-new-file.component';

describe('ModalNewFileComponent', () => {
  let component: ModalNewFileComponent;
  let fixture: ComponentFixture<ModalNewFileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalNewFileComponent]
    });
    fixture = TestBed.createComponent(ModalNewFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
