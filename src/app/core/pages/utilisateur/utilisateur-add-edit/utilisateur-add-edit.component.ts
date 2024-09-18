import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription, switchMap, tap} from "rxjs";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbCollapse, NgbDate, NgbTimepickerConfig, NgbTimeStruct} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, filter, finalize, map} from "rxjs/operators";
import {Pays} from "../../../../crm/models/pays.model";
import {Profession} from "../../../../crm/models/profession.model";
import {Role} from "../../../../crm/models/access/role.model";
import {UtilisateurService} from "../../../../crm/services/access/utilisateur.service";
import {PaysService} from "../../../../crm/services/pays.service";
import {ProfessionService} from "../../../../crm/services/profession.service";
import {RoleService} from "../../../../crm/services/access/role.service";
import {UtilisateurRole} from "../../../../crm/models/access/utilisateur-role.model";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {AuthService, UserType} from "../../../modules/auth";
import "select2";
import {LibraryService} from "../../../modules/helpers/library.service";
import {UtilisateurRolePermission} from "../../../modules/auth/models/utilisateur-role-permission.model";

declare var $: JQueryStatic;

@Component({
  selector: 'app-utilisateur-add-edit',
  templateUrl: './utilisateur-add-edit.component.html',
  styleUrls: ['./utilisateur-add-edit.component.scss']
})
export class UtilisateurAddEditComponent implements OnInit, AfterViewInit, OnDestroy {
  id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  payss$: any;
  professions$: any;
  roles$: Observable<Role[]>;
  entity: any;
  entityForm: FormGroup;
  private subscriptions: Subscription[] = [];

  defaultPaysNationalite?: Pays;
  defaultPaysResidence?: Pays;
  defaultProfession?: Profession;
  defaultUtilisateur?: BehaviorSubject<UserType> = new BehaviorSubject<UserType>(undefined);
  defaultUtilisateurRoles: BehaviorSubject<UtilisateurRole[]> = new BehaviorSubject<UtilisateurRole[]>([]);
  defaultUtilisateurPermissions: BehaviorSubject<UtilisateurRolePermission[]> = new BehaviorSubject<UtilisateurRolePermission[]>([]);
  defaultRoles: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>([]);

  heureDebut: NgbTimeStruct = {hour: 0, minute: 0, second: 0};
  heureFin: NgbTimeStruct = {hour: 23, minute: 59, second: 59};

  isCollapsed: any[] = [];

  //For pagination
  pageNo: number = 1;
  pageSize: number = 12;
  totalItems: number = 0;

  constructor(
    private authService: AuthService,
    private libraryService: LibraryService,
    private cd: ChangeDetectorRef,
    private config: NgbTimepickerConfig,
    private entityService: UtilisateurService,
    private paysService: PaysService,
    private professionService: ProfessionService,
    private roleService: RoleService,
    private pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
    config.seconds = true;
    config.spinners = false;
    config.size = "small";
    config.meridian = false;
  }

  get defaultUserRoles(): UtilisateurRole[] {
    return this.defaultUtilisateurRoles.value;
  }

  set defaultUserRoles(utilisateurRoles: UtilisateurRole[]) {
    this.defaultUtilisateurRoles.next(utilisateurRoles);
  }

  get defaultUserPermissions(): UtilisateurRolePermission[] {
    return this.defaultUtilisateurPermissions.value;
  }

  set defaultUserPermissions(utilisateurRolePermissions: UtilisateurRolePermission[]) {
    this.defaultUtilisateurPermissions.next(utilisateurRolePermissions);
  }

  ngOnInit(): void {
    const date1 = new Date();
    this.heureDebut.hour = date1.getHours();
    this.heureDebut.minute = date1.getMinutes();
    this.heureDebut.second = date1.getSeconds();
    //Récupération de l'object correspondant à id
    const sb = this.route.paramMap
      .pipe(
        filter(paramMap => paramMap.has('id')),
        map(paramMap => paramMap.get('id')!),
        tap((id) => this.id = +id),
        switchMap(id => this.entityService.getRowById(id))
      ).subscribe(entity => {
        this.defaultUserRoles = entity.roles1;
        this.defaultUserPermissions = entity.permissions;
        this.loadFormValues(entity);
      });
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        idPersonne: [this.id],
        nom: [null, Validators.required],
        prenom: [null, Validators.required],
        sexe: [null, Validators.required],
        dateNaissance: [null],
        civilite: [null, Validators.required],
        statutMatrimonial: [null, Validators.required],
        username: [null, Validators.required],
        password: [null, Validators.required],
        profession: [null, Validators.required],
        paysNationalite: [null, Validators.required],
        mobile1: [null, Validators.required],
        paysResidence: [null],
        mobile2: [null],
        estActif: [null, Validators.required],
        emailPro: [null, Validators.email],
        emailPerso: [null, Validators.email],
        // utilisateurRoles: [null],
        allRoles: this.fb.array([]),
        utilisateurRoles: this.fb.array([]),
        roles1: this.fb.array([]),
        permissions: this.fb.array([]),
        user: [null]
      }
    );
    this.subscriptions.push(sb);
    if (!this.id) {
      this.getRolesAll(null);
      this.pageInfo.updateTitle("Ajout d'un utilisateur")
    } else {
      this.pageInfo.updateTitle("Modification d'un utilisateur");
    }

    this.getPaysAll();
    this.getProfessionAll();
  }

  createRoleForm() {
    return this.fb.group({
      idUtilisateurRole: new FormGroup({
        idUtilisateur: new FormControl(null),
        idRole: new FormControl(null),
      }),
      utilisateur: new FormControl(null),
      role: new FormControl(null),
    });
  }

  createPermissionForm() {
    return this.fb.group({
      idUtilisateurRolePermission: new FormGroup({
        idUtilisateur: new FormControl(null),
        idRole: new FormControl(null),
        idPermis: new FormControl(null),
      }),
      utilisateur: new FormControl(null),
      role: new FormControl(null),
      permission: new FormControl(null),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() {
    return this.entityForm.controls;
  }

  getPermissions(itemIndex: number): FormArray {
    return <FormArray>(this.allRoles.at(itemIndex) as FormGroup).get('permissions');
  }

  get roles1() {
    return <FormArray>this.entityForm.get('roles1');
  }

  get permissions() {
    return <FormArray>this.entityForm.get('permissions');
  }

  private addRolesToForm(data: any, entity: any) {
    this.allRoles.clear();
    this.roles1.clear();
    data.forEach((value: any, index: number) => {
      let a = this.createItem({
        id: {
          idUtilisateur: this.id && entity != null ? entity.idPersonne : this.entityForm.value.user?.idPersonne,
          idRole: value.idRole
        },
        utilisateur: {
          id: this.id && entity != null ? entity.idPersonne : this.entityForm.value.user?.idPersonne,
          idPersonne: this.id && entity != null ? entity.idPersonne : this.entityForm.value.user?.idPersonne
        },
        role: {
          id: value.idRole,
          idRole: value.idRole
        },
        etat: false,
        roles1: this.fb.array([]),
        permissions: this.fb.array([]),
      });
      (<FormArray>a.get('roles1')).push(this.createItem({
        id: {
          idRole: value.idRole,
          idUtilisateur: this.entityForm.value.user?.idPersonne
        },
        utilisateur: {
          id: this.entityForm.value.user?.idPersonne,
          idPersonne: this.entityForm.value.user?.idPersonne
        },
        role: {
          id: value.idRole,
          idRole: value.idRole,
          nom: value.nom
        },
        etat: false
      }));
      if (value.permissions && value.permissions.length > 0) {
        (<FormArray>a.get('permissions')).clear();
        value.permissions.forEach(val => {
          (<FormArray>a.get('permissions')).push(this.createItem({
            id: {
              idPermis: val.permission.idPermis,
              idRole: value.idRole,
              idUtilisateur: this.entityForm.value.user?.idPersonne
            },
            utilisateur: {
              id: this.entityForm.value.user?.idPersonne,
              idPersonne: this.entityForm.value.user?.idPersonne
            },
            role: {
              id: value.idRole,
              idRole: value.idRole,
              nom: value.nom
            },
            permission: {
              id: val.permission.idPermis,
              idPermis: val.permission.idPermis,
              libellePermis: val.permission.libellePermis
            },
            etat: this.id && entity != null ? entity.permissions.find(urp => urp.permission.id === val.permission.id && urp.role.idRole === value.idRole) != null : false
          }))
        });
      }
      this.allRoles.push(a);
      if(this.id > 0) {
        let role = this.defaultUserPermissions.find((obj: any) => obj.role.idRole == value.idRole);
        if (role) {
          this.allRoles.controls[index].patchValue({
            id: {
              idUtilisateur: entity.idPersonne,
              idRole: role.role.idRole
            },
            utilisateur: {
              id: entity.idPersonne,
              idPersonne: entity.idPersonne
            },
            role: {
              id: role.role.idRole,
              idRole: role.role.idRole,
              nom: role.role.nom
            },
            etat: true
          });
          const roleForm = this.createRoleForm();
          roleForm.patchValue({
            idUtilisateurRole: {
              idUtilisateur: this.entityForm.value.user?.idPersonne,
              idRole: value.idRole
            },
            utilisateur: {
              id: this.entityForm.value.user?.idPersonne,
              idPersonne: this.entityForm.value.user?.idPersonne
            },
            role: {
              id: value.idRole,
              idRole: value.idRole
            }
          });
          this.roles1.push(roleForm);
        }
      }
    });
    this.cd.detectChanges();
  }

  createItem(data: any): FormGroup {
    return this.fb.group(data);
  }

  get allRoles(): FormArray {
    return <FormArray>this.entityForm.get('allRoles')
  }

  onCheckChange(event: any, userRoles?: any) {
    /* Selected */
    if (event.target.checked && userRoles) {
      // Add a new control in the arrayForm
      // formArray.push(new FormControl(event.target.value));
      this.roles1.push(this.createItem({
        id: {
          idUtilisateur: this.entityForm.value.user?.idPersonne,
          idRole: userRoles.role.idRole
        },
        utilisateur: {
          id: this.entityForm.value.user?.idPersonne,
          idPersonne: this.entityForm.value.user?.idPersonne
        },
        role: {
          id: userRoles.role.idRole,
          idRole: userRoles.role.idRole,
          nom: userRoles.role.nom
        }
      }));
    }
    /* unselected */
    else {
      // find the unselected element
      let j: number = 0;
      this.roles1.controls.forEach((ctrl: any) => {
        if (ctrl.value.role.idRole == userRoles.role.idRole) {
          // Remove the unselected element from the arrayForm
          this.roles1.removeAt(j);
          return;
        }
        j++;
      });
    }
  }

  onPermissionCheckChange(event: any, roleIndex: number, userRolesPermissions?: any) {
    console.log("Form === ", this.entityForm);
    /* Permission cochée */
    if (event.target.checked && userRolesPermissions) {
      // Mettre à jour les rôles dans le tableau des rôles
      const roleForm = this.createRoleForm();
      roleForm.patchValue({
        idUtilisateurRole: {
          idUtilisateur: this.entityForm.value.user?.idPersonne,
          idRole: userRolesPermissions.role.idRole
        },
        utilisateur: {
          id: this.entityForm.value.user?.idPersonne,
          idPersonne: this.entityForm.value.user?.idPersonne
        },
        role: {
          id: userRolesPermissions.role.idRole,
          idRole: userRolesPermissions.role.idRole,
          nom: userRolesPermissions.role.nom
        }
      });
      this.roles1.push(roleForm);
      // Cocher le rôle dont une des permissions a été cochée
      this.allRoles.controls[roleIndex].patchValue({
        ...roleForm.value,
        etat: true
      });

      //Mettre à jour les permissions dans le tableau des permissions
      const permissionForm = this.createPermissionForm();
      permissionForm.patchValue({
        idUtilisateurRolePermission: {
          idUtilisateur: this.entityForm.value.user?.idPersonne,
          idRole: userRolesPermissions.role.idRole,
          idPermis: userRolesPermissions.permission.idPermis
        },
        utilisateur: {
          id: this.entityForm.value.user?.idPersonne,
          idPersonne: this.entityForm.value.user?.idPersonne
        },
        role: {
          id: userRolesPermissions.role.idRole,
          idRole: userRolesPermissions.role.idRole,
          nom: userRolesPermissions.role.nom
        },
        permission: {
          id: userRolesPermissions.permission.idPermis,
          idPermis: userRolesPermissions.permission.idPermis,
          libellePermis: userRolesPermissions.permission.libellePermis
        }
      });
      this.permissions.push(permissionForm);
    }
    /* Permission décochée */
    else {
      // Retrouver les rôles décochés et les retirer de la liste
      let i: number = 0;
      this.roles1.controls.forEach((ctrl: any) => {
        if (ctrl.value.role.idRole == userRolesPermissions.role.idRole) {
          // Remove the unselected element from the arrayForm
          this.roles1.removeAt(i);
          return;
        }
        i++;
      });

      // Retrouver les permissions décochées et les retirer de la liste
      let j: number = 0;
      this.permissions.controls.forEach((ctrl: any) => {
        if (ctrl.value.role.idRole == userRolesPermissions.role.idRole
          && ctrl.value.permission.idPermis === userRolesPermissions.permission.idPermis) {
          // Remove the unselected element from the arrayForm
          this.permissions.removeAt(j);
          //Décocher le rôle concerné lorsqu'il n'y a plus aucune permission associée
          const actualRolePermissions = this.allRoles.controls[roleIndex].value.permissions as any[];
          if(actualRolePermissions != null && actualRolePermissions.length) {
            const finalRolePermissions = actualRolePermissions.filter(value => value.etat);
            if(finalRolePermissions.length <= 0) {
              this.allRoles.controls[roleIndex].patchValue({
                ...this.allRoles.controls[roleIndex].value,
                etat: false
              });
            }
          }
          return;
        }
        j++;
      });
    }
  }

  getPaysAll = () => {
    this.paysService.afficherPaysListe().subscribe(
      (data) => {
        this.payss$ = data;
      }
    )
  }

  getProfessionAll = () => {
    this.professionService.afficherListe().subscribe(
      (data) => {
        this.professions$ = data;
      }
    )
  }

  getSearchRequest(keyword: string = "") {
    return {
      "globalOperator": "OR",
      "pageDto": {
        "pageNo": this.pageNo-1,
        "pageSize": this.pageSize,
        "sort": "ASC",
        "sortByColumn": "nom"
      },
      "searchRequestDto": [
        {
          "column": "nom",
          "value": keyword,
          "operation": "LIKE"
        }
      ]
    };
  }

  searchRoles(keyword: string = "") {
    this.roles$ = this.roles$.pipe(
      filter((roles: Role[]) => roles != null && roles.length > 0),
      map((roles: Role[]) => roles.filter(value => value.nom.toLowerCase().includes(keyword.toLowerCase()))),
      tap(resp => {
        this.allRoles.controls = this.allRoles.controls.filter(formgroup => formgroup.value.role.nom.toLowerCase().includes(keyword.toLowerCase()));
        console.log("Réponse du serveur : ", resp);
      }),
    );
  }

  getRolesAll(entity: any, keyword: string = "") {
    const request = this.getSearchRequest(keyword);
    this.roles$ = this.roleService.afficherTous().pipe(
      tap(resp => {
        this.totalItems = resp.data.totalElements;
      }),
      map(resp => resp.data),
      map((roles: Role[]) => roles.filter(value => value.permissions.length > 0)),
      tap(resp => this.addRolesToForm(resp, entity))
    );
  }

  loadFormValues(entity: any) {
    this.entity = entity;
    this.entityForm.patchValue({nom: entity.nom});
    this.entityForm.patchValue({estActif: entity.estActif});
    this.entityForm.patchValue({prenom: entity.prenom});
    this.entityForm.patchValue({sexe: entity.sexe});
    let dateNaissance = new Date(entity.dateNaissance);
    if(!isNaN(dateNaissance.getDate())) {
      this.entityForm.patchValue({
        dateNaissance: new NgbDate(
          dateNaissance.getFullYear(), dateNaissance.getMonth() + 1, dateNaissance.getDate())
      });
    }
    this.entityForm.patchValue({civilite: entity.civilite});
    this.entityForm.patchValue({statutMatrimonial: entity.statutMatrimonial});
    this.entityForm.patchValue({mobile1: entity.mobile1});
    this.entityForm.patchValue({mobile2: entity.mobile2});
    this.entityForm.patchValue({username: entity.username});
    this.entityForm.patchValue({password: entity.password});
    this.entityForm.patchValue({paysNationalite: entity.paysNationalite});
    this.entityForm.patchValue({paysResidence: entity.paysResidence});
    this.entityForm.patchValue({profession: entity.profession});
    this.entityForm.patchValue({emailPro: entity.emailPro});
    this.entityForm.patchValue({emailPerso: entity.emailPerso});
    this.entityForm.patchValue({roles: entity.roles});
    this.entityForm.patchValue({user: entity});
    entity.permissions.forEach((item: any) => {
      this.permissions.push(this.createItem({
        id: {
          idPermis: item.permission.idPermis,
          idRole: item.role.idRole,
          idUtilisateur: entity.idPersonne
        },
        utilisateur: {id: entity.idPersonne, idPersonne: entity.idPersonne},
        role: {
          id: item.role.idRole,
          idRole: item.role.idRole,
          nom: item.role.nom
        },
        permission: {
          id: item.permission.idPermis,
          idPermis: item.permission.idPermis,
          libellePermis: item.permission.libellePermis
        },
        etat: true
      }));
    });
    //Chargement des roles existants
    this.getRolesAll(entity);
    /*const request = this.getSearchRequest();
    this.roles$ = this.roleService.pagination(request).pipe(
      tap(resp => {
        this.totalItems = resp.data.totalElements;
      }),
      map(resp => resp.data.content),
      map((roles: Role[]) => roles.filter(value => value.permissions.length > 0)),
      tap(data => {
        this.allRoles.clear();
        this.roles1.clear();
        data.forEach((value: any, index: number) => {
          let a = this.createItem({
            id: {
              idUtilisateur: entity.idPersonne,
              idRole: value.idRole
            },
            utilisateur: {
              id: entity.idPersonne,
              idPersonne: entity.idPersonne
            },
            role: {
              id: value.idRole,
              idRole: value.idRole
            },
            etat: false,
            roles1: this.fb.array([]),
            permissions: this.fb.array([]),
          });
          (<FormArray>a.get('roles1')).push(this.createItem({
            id: {
              idRole: value.idRole,
              idUtilisateur: this.entityForm.value.user?.idPersonne
            },
            utilisateur: {
              id: this.entityForm.value.user?.idPersonne,
              idPersonne: this.entityForm.value.user?.idPersonne
            },
            role: {
              id: value.idRole,
              idRole: value.idRole,
              nom: value.nom
            },
            etat: false
          }));
          if (value.permissions && value.permissions.length > 0) {
            (<FormArray>a.get('permissions')).clear();
            value.permissions.forEach(val => {
              (<FormArray>a.get('permissions')).push(this.createItem({
                id: {
                  idPermis: val.permission.idPermis,
                  idRole: value.idRole,
                  idUtilisateur: this.entityForm.value.user?.idPersonne
                },
                utilisateur: {
                  id: this.entityForm.value.user?.idPersonne,
                  idPersonne: this.entityForm.value.user?.idPersonne
                },
                role: {
                  id: value.idRole,
                  idRole: value.idRole,
                  nom: value.nom
                },
                permission: {
                  id: val.permission.idPermis,
                  idPermis: val.permission.idPermis,
                  libellePermis: val.permission.libellePermis
                },
                etat: entity.permissions.find(urp => urp.permission.id === val.permission.id && urp.role.idRole === value.idRole) != null
              }))
            });
          }
          this.allRoles.push(a);
          let role = this.defaultUserPermissions.find((obj: any) => obj.role.idRole == value.idRole);
          if (role) {
            this.allRoles.controls[index].patchValue({
              id: {
                idUtilisateur: entity.idPersonne,
                idRole: role.role.idRole
              },
              utilisateur: {
                id: entity.idPersonne,
                idPersonne: entity.idPersonne
              },
              role: {
                id: role.role.idRole,
                idRole: role.role.idRole,
                nom: role.role.nom
              },
              etat: true
            });
            const roleForm = this.createRoleForm();
            roleForm.patchValue({
              idUtilisateurRole: {
                idUtilisateur: this.entityForm.value.user?.idPersonne,
                idRole: value.idRole
              },
              utilisateur: {
                id: this.entityForm.value.user?.idPersonne,
                idPersonne: this.entityForm.value.user?.idPersonne
              },
              role: {
                id: value.idRole,
                idRole: value.idRole
              }
            });
            this.roles1.push(roleForm);
          }
        });
      })
    );*/

    this.libraryService.updateSelect2Elements(this.entityForm.value);

    // this.defaultUtilisateurRoles = entity.utilisateurRoles;
    this.defaultPaysNationalite = entity.paysNationalite;
    this.defaultPaysResidence = entity.paysResidence;
    this.defaultProfession = entity.profession;
    this.defaultUtilisateur = entity;
  }

  onSaveEntity() {
    this.isLoading = true;
    this.submitted = true;
    this.submitting = true;
    console.log("FORM === ", this.entityForm);
    // return;
    if (this.entityForm.invalid) return;
    this.submitting = true;
    // return;
    const sb = this.saveEntity()
      .pipe(
        catchError((err) => {
          this.submitting = false;
          return of(err.message);
        }),
        finalize(() => {
          this.isLoading = false;
          this.submitted = false;
          this.router.navigate(['utilisateurs'], {relativeTo: this.route});
        })
      )
      .subscribe();
    this.subscriptions.push(sb);
  }

  saveEntity() {
    let dateNaiss: any;
    if (this.entityForm.controls.dateNaissance.value) {
      dateNaiss = new Date(
        this.entityForm.controls.dateNaissance.value.year,
        this.entityForm.controls.dateNaissance.value.month - 1,
        this.entityForm.controls.dateNaissance.value.day + 1);
    }
    const entity = {
      ...this.entityForm.value,
      dateNaissance: dateNaiss,
      utilisateurRoles: null
    }
    return this.id
      ? this.entityService.updateRow(entity)
      : this.entityService.createRow(entity);
  }

  page = 1;

  handlePageChange(event) {
    this.page = event;
  }

  toggleCollapse(collapse: NgbCollapse, i: number) {
    collapse.toggle();
    this.isCollapsed[i] = true;
  }

  ngAfterViewInit(): void {
    var $select2 = $('.select2');
    $select2.select2();

    // Update form control value on Select2 change
    $select2.on("change", (event: any) => {
      const value = $(event.target).val();
      const name: string = $(event.target).attr("name")!;
      if (!(typeof name === "undefined")) {
        this.entityForm.controls[name].setValue(value);
      }
    });
    this.cd.detectChanges(); // Manually trigger change detection
  }
}
