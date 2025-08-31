import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription, switchMap, tap} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {catchError, filter, map} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";
import {LibraryService} from "../../../modules/helpers/library.service";
import {Role} from "../../../../crm/models/access/role.model";
import {Menu} from "../../../../crm/models/access/menu.model";
import {MenuService} from "../../../../crm/services/access/menu.service";
import {RoleService} from "../../../../crm/services/access/role.service";

@Component({
    selector: 'app-menus-add-edit',
    templateUrl: './menus-add-edit.component.html',
    styleUrls: ['./menus-add-edit.component.scss'],
    standalone: false
})
export class MenusAddEditComponent implements OnInit, OnDestroy{
  id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  roles$: Observable<Role[]>;
  parentMenus$: Observable<Menu[]>;
  entity: any;
  entityForm: FormGroup;
  private subscriptions: Subscription[] = [];

  defaultRole?: Role;
  defaultParentMenu?: Menu;

  constructor(
    private libraryService: LibraryService,
    private entityService: MenuService,
    private roleService: RoleService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    //Récupération de l'object correspondant à id
    const sb = this.route.paramMap
      .pipe(
        filter(paramMap => paramMap.has('id')),
        map(paramMap => paramMap.get('id')!),
        tap((id) => this.id = +id),
        switchMap(id => this.entityService.getById(Number.parseInt(id)))
      ).subscribe(entity => this.loadFormValues(entity));
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        idMenu: [this.id],
        title: [null, Validators.required],
        icon: [null],
        dataLink: [null],
        page: [null],
        parentMenu: [null],
        role: [null],
        estActif: [null, Validators.required],
      }
    );
    this.subscriptions.push(sb);
    this.getRolesAll();
    // this.getParentMenuAll();
    // this.generateMenus(this.libraryService.menus.items);
  }

  get f() { return this.entityForm.controls; }

  generateMenus(params: any = [], parent: any = null, cptFin: number = 0)
  {
    let cpt = cptFin;
    params.forEach((item: any, index: number) => {
      cpt++;
      let newRole: any = {id: null, idRole: null, nom: item.role};
      let roleSubscription = this.roleService.afficherSelonNom(item.role)
        .pipe(
          catchError(_ => this.roleService.create(newRole)),
          switchMap((role: any) => {
            // console.log("NewRole = ", role.idRole);
            let menu: any = {
              estActif: true,
              ordreAffichage: cpt,
              title: item.hasOwnProperty('title') ? item.title : null,
              icon: item.hasOwnProperty('icon') ? item.icon : null,
              page: item.hasOwnProperty('page') ? item.page : null,
              translate: item.hasOwnProperty('translate') ? item.translate : null,
              dataLink: item.hasOwnProperty('dataLink') ? item.dataLink : null,
              role: role != null && role.idRole ? role : null,
              parentMenu: parent != null && parent.idMenu ? parent : null
            };
            return this.entityService.create(menu);
          }),
          tap(menu => {
            // console.log("NewMenu = ", menu);
          })
        )
        .subscribe({
          next: (menu: any) => {
            // const myRole = Object.assign({}, menu);
            this.generateMenus(item.children, menu, cptFin);
            // roleSubject.next(myRole);
          },
          error: (err) => {
            console.log("Erreur = ", err);
          }
        });
      this.subscriptions.push(roleSubscription);

      // const sb = roleSubject.asObservable().pipe(
      //   switchMap((role: any) => {
      //     // console.log("NewRole = ", role.idRole);
      //     let menu: any = {
      //       estActif: true,
      //       ordreAffichage: index+1,
      //       title: item.hasOwnProperty('title') ? item.title : null,
      //       icon: item.hasOwnProperty('icon') ? item.icon : null,
      //       page: item.hasOwnProperty('page') ? item.page : null,
      //       translate: item.hasOwnProperty('translate') ? item.translate : null,
      //       dataLink: item.hasOwnProperty('dataLink') ? item.dataLink : null,
      //       role: role.idRole ? role : null,
      //       parentMenu: parent != null && parent.idMenu ? parent : null
      //     };
      //     console.log("*Parent*", parent);
      //     console.log("*ROLE*", role);
      //     console.log("NewMenu = ", menu);
      //     // return of(menu);
      //     return this.entityService.createRow(menu);
      //   }),
      //   tap(menu => {
      //     // console.log("NewMenu = ", menu);
      //   })
      // ).subscribe({
      //   next: (parent) => {
      //     if(item.hasOwnProperty('children'))
      //     {
      //       this.generateMenus(item.children, parent);
      //     }
      //     console.log("Génération effectuée avec succès !");
      //   }
      // });
      // this.subscriptions.push(sb);
    });
  }

  getRolesAll()
  {
    this.roles$ = this.roleService.afficherTous().pipe(
      map(resp => resp.data)
    );
  }

  getParentMenuAll()
  {
    this.parentMenus$ = this.entityService.afficherMenus().pipe(
      map(p => p.filter(obj => obj.children.length == 0))
    );
  }

  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({title: entity.title});
    this.entityForm.patchValue({icon: entity.icon});
    this.entityForm.patchValue({estActif: entity.estActif});
    this.entityForm.patchValue({page: entity.page});
    this.entityForm.patchValue({parentMenu: entity.parentMenu});
    this.entityForm.patchValue({role: entity.role});

    this.defaultParentMenu = entity.parentMenu;
    this.defaultRole = entity.role;
  }

  onSaveEntity()
  {
    this.isLoading = true;
    this.submitted = true;

    if(this.entityForm.invalid) return;
    // return;
    this.submitting = true;
    const sb = this.saveEntity().subscribe({
      next: () => {
        this.router.navigate(['menus'], {relativeTo: this.route});
      },
      error: () => {

      }
    });
    this.subscriptions.push(sb);
  }

  saveEntity() {
    return this.id
      ? this.entityService.update(this.entityForm.value)
      : this.entityService.create(this.entityForm.value);
  }
}
