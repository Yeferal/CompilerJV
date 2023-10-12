import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSaveAsComponent } from './modal-save-as.component';

describe('ModalSaveAsComponent', () => {
  let component: ModalSaveAsComponent;
  let fixture: ComponentFixture<ModalSaveAsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSaveAsComponent]
    });
    fixture = TestBed.createComponent(ModalSaveAsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
