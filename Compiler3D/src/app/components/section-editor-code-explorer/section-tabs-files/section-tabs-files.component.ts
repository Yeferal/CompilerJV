import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-section-tabs-files',
  templateUrl: './section-tabs-files.component.html',
  styleUrls: ['./section-tabs-files.component.scss']
})
export class SectionTabsFilesComponent {
  @HostListener('wheel', ['$event']) onMouseWheel(event: WheelEvent): void {
    // Ajustar el desplazamiento horizontal al girar la rueda del ratón
    const tabsContainer = event.currentTarget as HTMLElement;
    tabsContainer.scrollLeft += event.deltaY;
    event.preventDefault();
  }
}
