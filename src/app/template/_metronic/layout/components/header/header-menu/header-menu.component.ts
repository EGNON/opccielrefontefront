import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { LayoutType } from '../../../core/configs/config';
import { LayoutInitService } from '../../../core/layout-init.service';
import { LayoutService } from '../../../core/layout.service';
import {NgbDate, NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {ConnexionComponent} from "../../../../../../opcvm/pages/connexion/connexion.component";
import {AuthService} from "../../../../../../core/modules/auth";
import {Observable} from "rxjs";
import {LocalService} from "../../../../../../services/local.service";
declare var $:JQueryStatic;

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit, AfterViewInit {
  private modalRef: NgbModalRef;
  currentOpcvm$: Observable<any>;
  currentOpcvm: any = null;
  opcvmIsConnected: any;

  constructor(
    private localStore: LocalService,
    private authService: AuthService,
    private router: Router,
    private layout: LayoutService,
    private layoutInit: LayoutInitService,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.currentOpcvm$ = this.authService.currentOpcvm$;
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    // console.log("Opcvm === ", this.currentOpcvm);
    this.opcvmIsConnected = window.localStorage.getItem("opcvmIsConnected");
  }

  opcvmForm(el: HTMLElement) {
    if(el.innerText.toLowerCase().includes("déconnexion"))
    {
      window.localStorage.removeItem("opcvmIsConnected");
      window.localStorage.removeItem("currentOpcvm");
      window.localStorage.removeItem("currentSeance");
      // this.localStore.clearData();
      this.opcvmIsConnected = null;
      this.currentOpcvm = null;
      this.authService.currentOpcvmSubject.next(null);
      this.router.navigate(['/'])
    }
    else
    {
      const modalRef = this.modalService.open(ConnexionComponent, {
        backdrop: "static",
        size: "xl"
      });
      modalRef.componentInstance.passEntry.subscribe((receivedEntry:any) => {
        this.currentOpcvm = receivedEntry;
        // console.log("RESP === ", receivedEntry);
      });
    }
  }

  calculateMenuItemCssClass(url: string): string {
    return checkIsActive(this.router.url, url) ? 'active' : '';
  }

  setBaseLayoutType(layoutType: LayoutType) {
    this.layoutInit.setBaseLayoutType(layoutType);
  }

  setToolbar(toolbarLayout: 'classic' | 'accounting' | 'extended' | 'reports' | 'saas') {
    const currentConfig = {...this.layout.layoutConfigSubject.value};
    if (currentConfig && currentConfig.app && currentConfig.app.toolbar) {
      currentConfig.app.toolbar.layout = toolbarLayout;
      this.layout.saveBaseConfig(currentConfig)
    }
  }

  ngAfterViewInit(): void {
    //console.log("MOM === ", $('div'));
  }
}

const getCurrentUrl = (pathname: string): string => {
  return pathname.split(/[?#]/)[0];
};

const checkIsActive = (pathname: string, url: string) => {
  const current = getCurrentUrl(pathname);
  if (!current || !url) {
    return false;
  }

  if (current === url) {
    return true;
  }

  if (current.indexOf(url) > -1) {
    return true;
  }

  return false;
};
