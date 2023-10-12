import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionEditorCodeAssemblerComponent } from './section-editor-code-assembler.component';

describe('SectionEditorCodeAssemblerComponent', () => {
  let component: SectionEditorCodeAssemblerComponent;
  let fixture: ComponentFixture<SectionEditorCodeAssemblerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectionEditorCodeAssemblerComponent]
    });
    fixture = TestBed.createComponent(SectionEditorCodeAssemblerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
