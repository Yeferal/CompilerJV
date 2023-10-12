import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOpenFileComponent } from './modal-open-file.component';

describe('ModalOpenFileComponent', () => {
  let component: ModalOpenFileComponent;
  let fixture: ComponentFixture<ModalOpenFileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalOpenFileComponent]
    });
    fixture = TestBed.createComponent(ModalOpenFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
