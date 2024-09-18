import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef, HostListener,
  OnDestroy,
  OnInit,
  QueryList, ViewChild,
  ViewChildren
} from '@angular/core';
import {LayoutService} from "../../../core/layout.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {MenuService} from "../../../../../../crm/services/access/menu.service";
import {Observable, Subscription} from "rxjs";
import {AuthService, UserType} from "../../../../../../core/modules/auth";
import {LibraryService} from "../../../../../../core/modules/helpers/library.service";
import {Role} from "../../../../../../crm/models/access/role.model";
// import * as $ from "jquery";
import {filter, map} from "rxjs/operators";

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  menus: any = [];
  roles: Role[] = [];
  private unsubscribe: Subscription[] = [];
  currentUser: UserType;
  compteur: any[] = [];
  allRoutes: any;

  @ViewChildren('sub', { read: ElementRef }) subs: QueryList<ElementRef>;
  @ViewChild('app_menu') appMenu: ElementRef<HTMLDivElement>;

  constructor(
    private cdr:ChangeDetectorRef,
    private layout: LayoutService,
    private router: Router,
    private route: ActivatedRoute,
    private menuService: MenuService,
    private libraryService: LibraryService,
    private authService: AuthService) { }

  ngOnInit(): void {
    const sb = this.authService.currentUser$.subscribe((data) => {
      data?.roles1.forEach(u => {
        this.roles.push(u.role);
      });
      this.currentUser = data;
    });
    this.unsubscribe.push(sb);
    //this.menus = this.libraryService.menus.items;
    //this.menuAll(this.menus, null, null, false);
    //Récupération de toutes les routes
    this.libraryService.allRoutes$.subscribe({
      next: value => {
        this.allRoutes = value;
      },
      error: err => {
        console.log("Erreur ", err);
      }
    });
    this.libraryService.recupererTousLesMenus();
    this.authService.currentOpcvmSubject
      .pipe(
        map(opcvm => {
          const opcvmIsConnected = window.localStorage.getItem("opcvmIsConnected");
          if((opcvm != null && typeof opcvm != undefined) || (opcvmIsConnected && opcvmIsConnected === "1"))
          {
            return this.libraryService.opcvmMenus.items;
          }
          else
          {
            return this.libraryService.menus.items
          }
        })
      )
      .subscribe(menus => {
        this.compteur = [];
        this.menus = menus;
        // console.log(this.menus);
        // this.menuAll(this.menus, null, null, false);
      });
  }

  ngAfterViewInit(): void {
    let $  = require('jquery');
    this.cdr.detectChanges();
  }

  @HostListener('click',['$event.target', '$event'])
  onClick(targetElement: HTMLElement, e: Event) {
    //console.log(targetElement);
    switch(targetElement.tagName)
    {
      case 'BUTTON':
      break;
      case 'LI':
      break;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  menuAll(menus: any, parent: any = null, lastParentTitle: any = null, allow: boolean = false)
  {
    menus.forEach((menu: any, index: number) => {
      if(parent != null)
      {
        if(lastParentTitle == null) lastParentTitle = parent.title;
        var oldLastP = this.findId(lastParentTitle, this.menus);
        if(lastParentTitle != parent.title) {
          if(!this.findId(parent.title, this.compteur))
          {
            var z = this.findId(parent.title, oldLastP.children);
            if(!z)
            {
              this.compteur.push({...parent, children: []});
              this.findId(parent.title, this.compteur).children.push({...menu, children: []});
            }
            else
            {
              var l = this.findId(lastParentTitle, this.compteur);
              if(l)
              {
                this.findId(lastParentTitle, this.compteur).children.push({...parent, children: []});
                this.findId(parent.title, this.compteur).children.push({...menu, children: []});
              }
              else
              {
                this.compteur.push({...parent, children: []});
                this.findId(parent.title, this.compteur).children.push({...menu, children: []});
              }
            }
          }
          else
          {}
          lastParentTitle = parent.title;
        }
        else
        {
          var x = this.findId(lastParentTitle, this.compteur);
          if(!x)
          {
            var y = this.findId(menu.title, oldLastP.children);
            if(y.children.length > 0) this.compteur.push({...parent, children: []});
          }
          else
          {
            if (menu.allow != null && menu.allow === true)
            {
              if(this.findId(lastParentTitle, this.compteur) != null) this.findId(lastParentTitle, this.compteur).children.push({...menu, children: []});
              if(this.findId(menu.parent, this.compteur) != null) this.findId(menu.parent, this.compteur).allow = true;
            }
          }
        }

        if(this.findId(parent.parent, this.compteur) != null && menu.allow)
          this.findId(parent.parent, this.compteur).allow = menu.allow;
      }
      else
      {
        lastParentTitle = menu.title;
        this.compteur.push({...menu, children: []});
      }

      if(this.findId(menu.parent, this.compteur) != null && menu.allow)
      {
        this.findId(menu.parent, this.compteur).allow = menu.allow;
      }

      this.menuAll(menu.children, menu, lastParentTitle, allow);
    });
  }

  findId(title: any, menus: any) {
    return menus.reduce((a:any, item:any) => {
      if (a) return a;
      if (item.title === title) return item;
      if (item.children) return this.findId(title, item.children);
    }, null);
  }

  isMenuItemActive(menu: any, link: any): boolean {
    const active = this.router.url === menu.page;
    if(active) {
      const accordion = $(link).parents('.menu-accordion');
      const sub_accordion = $(link).parents('.menu-sub-accordion');
      accordion.addClass('here show');
      sub_accordion.addClass('menu-active-bg');

      this.authService.currentRoleSubject.next(menu.role);
    }
    return active;
  }
}
