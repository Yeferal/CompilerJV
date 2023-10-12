import { Component, ElementRef, HostListener } from "@angular/core";
import { ModalComponent } from "../modal/modal.component";
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

  constructor(private elementRef: ElementRef) {}

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

  }

  saveAs(){

  }

  closeProejct(){

  }

  generateCode3D(){

  }

  generateCodeOptimized(){

  }

  generateCodeAssembler(){

  }
  
  downloadCode3D(){

  }

  downloadCodeOptimized(){

  }

  downloadCodeAssembler(){

  }

  reportOptimized(){
    
  }
  
}
