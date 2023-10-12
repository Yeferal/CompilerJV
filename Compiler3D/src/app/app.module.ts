import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ContentMainComponent } from './components/content-main/content-main.component';
import { DirectorybarComponent } from './components/directorybar/directorybar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SectionEditorCodeExplorerComponent } from './components/section-editor-code-explorer/section-editor-code-explorer.component';
import { TreeDirectoryComponent } from './components/tree-directory/tree-directory.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { SectionEditorCodeFileComponent } from './components/section-editor-code-explorer/section-editor-code-file/section-editor-code-file.component';
import { SectionEditorFooterFileComponent } from './components/section-editor-code-explorer/section-editor-footer-file/section-editor-footer-file.component';
import { SectionTabsFilesComponent } from './components/section-editor-code-explorer/section-tabs-files/section-tabs-files.component';
import { ChildDirectoryComponent } from './components/tree-directory/child-directory/child-directory.component';
import { ChildFileComponent } from './components/tree-directory/child-file/child-file.component';
import { ModalComponent } from './components/modal/modal.component';
import { ModalNewFileComponent } from './components/modal/nav/modal-new-file/modal-new-file.component';
import { ModalNewProjectComponent } from './components/modal/nav/modal-new-project/modal-new-project.component';
import { ModalOpenProjectComponent } from './components/modal/nav/modal-open-project/modal-open-project.component';
import { ModalOpenFileComponent } from './components/modal/nav/modal-open-file/modal-open-file.component';
import { ModalSaveAsComponent } from './components/modal/nav/modal-save-as/modal-save-as.component';
import { SectionEditorCode3dComponent } from './components/section-editor-code-explorer/section-editor-code3d/section-editor-code3d.component';
import { SectionEditorCodeOptimizedComponent } from './components/section-editor-code-explorer/section-editor-code-optimized/section-editor-code-optimized.component';
import { SectionEditorCodeAssemblerComponent } from './components/section-editor-code-explorer/section-editor-code-assembler/section-editor-code-assembler.component';
import { SectionEditorReportComponent } from './components/section-editor-code-explorer/section-editor-report/section-editor-report.component';

@NgModule({
  declarations: [
    AppComponent,
    ContentMainComponent,
    DirectorybarComponent,
    NavbarComponent,
    SectionEditorCodeExplorerComponent,
    TreeDirectoryComponent,
    SectionEditorCodeFileComponent,
    SectionEditorFooterFileComponent,
    SectionTabsFilesComponent,
    ChildDirectoryComponent,
    ChildFileComponent,
    ModalComponent,
    ModalNewFileComponent,
    ModalNewProjectComponent,
    ModalOpenProjectComponent,
    ModalOpenFileComponent,
    ModalSaveAsComponent,
    SectionEditorCode3dComponent,
    SectionEditorCodeOptimizedComponent,
    SectionEditorCodeAssemblerComponent,
    SectionEditorReportComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    CodemirrorModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
