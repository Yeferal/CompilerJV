import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionEditorCode3dComponent } from './section-editor-code3d.component';

describe('SectionEditorCode3dComponent', () => {
  let component: SectionEditorCode3dComponent;
  let fixture: ComponentFixture<SectionEditorCode3dComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectionEditorCode3dComponent]
    });
    fixture = TestBed.createComponent(SectionEditorCode3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
