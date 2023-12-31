import { Component, ElementRef, HostListener } from "@angular/core";
import { ModalComponent } from "../modal/modal.component";
import { CookieService } from "ngx-cookie-service";
import { ShareProjectService } from "src/app/services/share-project.service";
import { FilesService } from "src/app/services/files.service";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  currentMenuItem: any;

  menuItems = [
    {
      label: "Archivo",
      clicked: false,
      showSubMenu: false
    },
    {
      label: "Generar Codigo",
      clicked: false,
      showSubMenu: false
    },
    {
      label: "Descargar",
      clicked: false,
      showSubMenu: false
    },
    {
      label: "Reporte",
      clicked: false,
      showSubMenu: false
    }
  ];

  constructor(private elementRef: ElementRef, 
    private filesService: FilesService, 
    private shareProjectService: ShareProjectService, 
    private cookieService: CookieService) {}

  toggleSubMenu(menuItem: any): void {

    if (this.currentMenuItem !== menuItem) {
      this.hideCurrentSubMenu();
    }

    if (!menuItem.clicked) {
      menuItem.showSubMenu = !menuItem.showSubMenu;
    }
    menuItem.clicked = !menuItem.clicked;
    
    this.currentMenuItem = menuItem;
  }

  showSubMenu(menuItem: any): void {
    if (this.currentMenuItem && this.currentMenuItem !== menuItem && this.currentMenuItem.clicked) {
      if (this.currentMenuItem.showSubMenu) {
        this.currentMenuItem.showSubMenu = false;
      }
      menuItem.clicked = true;
      menuItem.showSubMenu = true;
      this.hideCurrentSubMenu();
      this.currentMenuItem = menuItem;
    }
  }

  hideSubMenu(menuItem: any): void {
    // if (this.currentMenuItem && this.currentMenuItem !== menuItem && this.currentMenuItem.clicked) {
    //   menuItem.clicked = false;
    //   menuItem.showSubMenu = false;
    // }
  }

  hideCurrentSubMenu(): void {
    if (this.currentMenuItem) {
      this.currentMenuItem.showSubMenu = false;
      this.currentMenuItem.clicked = false;
      this.currentMenuItem = null;
    }
  }

  @HostListener("document:click", ["$event.target"])
  onClick(target: any): void {
    /** Recibe el target y si el target pertenece a esta componente entonces devuelve un true
     * Porque busca el contenido de este mismo componente
     */
    const clickedInsideNavbar = this.elementRef.nativeElement.contains(target);
    
    if (!clickedInsideNavbar) {
      this.hideCurrentSubMenu();
    }
  }

  openModalChild(modal: ModalComponent){
    modal.openModal();
  }

  save(){
    this.shareProjectService.sendDataSave();
  }

  saveAs(){
    this.shareProjectService.sendDataSaveAs();
  }

  closeProejct(){
    this.cookieService.delete("project");
    this.shareProjectService.setRoot(null);
    this.shareProjectService.sendDataRoot(null);
    this.shareProjectService.setTabs([]);
    this.shareProjectService.setActualNode(null);
    this.shareProjectService.sendDataActual(null);
  }

  generateCode3D(){
    this.filesService.sendGen3D();
  }

  generateCodeAssembler(){
    this.filesService.sendGenAssem();
  }
  
  downloadCode3D(){
    this.filesService.sendDow3D();
  }

  downloadCodeAssembler(){
    this.filesService.sendDowAssem();
  }
  
}
