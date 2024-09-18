import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter, Injector,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {SweetAlertOptions} from "sweetalert2";
import {Subscription} from "rxjs";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DataTablesResponse} from "../../../../crm/models/table.model";
import {Utilisateur} from "../../../../crm/models/access/utilisateur.model";
import {UtilisateurService} from "../../../../crm/services/access/utilisateur.service";
import {DeleteUtilisateurModalComponent} from "../delete-utilisateur-modal/delete-utilisateur-modal.component";
import {Config} from "datatables.net";

@Component({
  selector: 'app-utilisateur-list',
  templateUrl: './utilisateur-list.component.html',
  styleUrls: ['./utilisateur-list.component.scss']
})
export class UtilisateurListComponent implements  OnInit, AfterViewInit, OnDestroy {
  isLoading = false;

  entities: DataTablesResponse<any>;

  datatableConfig: Config = {};

  entity: Utilisateur;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = {};

  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  private subscriptions: Subscription[] = [];
  private clickListener: () => void;
  private idInAction: number;

  public urls: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private userService: UtilisateurService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private injector: Injector) {
    /*this.printpath('utilisateurs', this.router.config);
    console.log("PARENT === ", route.parent?.routeConfig);
    console.log("CHILDREN === ", route.parent?.routeConfig?.children);*/
    /*for (let child of route.parent?.routeConfig?.children) {
      if (child.path && child.data["breadcrumb"]) {
        this.children.push(new RouteLink(child.path, child.data["breadcrumb"]));
      }
    }*/
  }

  printpath(parent: string, config: Route[]) {
    for (let i = 0; i < config.length; i++) {
      const route = config[i];
      // console.log(parent + '/' + route.path);
      // console.log(route.path);
      if (route.children) {
        const currentPath = route.path ? `${parent}/${route.path}` : parent;
        this.printpath(currentPath, route.children);
      }
    }
  }

  ngOnInit(): void {
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const sb = this.userService.afficherTous(dataTablesParameters).subscribe(resp => {
          callback(resp);
        });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'Nom', data: 'denomination', render: function (data, type, full) {
            const colorClasses = ['success', 'info', 'warning', 'danger'];
            const randomColorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];

            const initials = data[0].toUpperCase();
            const symbolLabel = `
              <div class="symbol-label fs-3 bg-light-${randomColorClass} text-${randomColorClass}">
                ${initials}
              </div>
            `;

            const nomEtPrenoms = `
              <div class="d-flex flex-column" data-action="view" data-id="${full.id}">
                <a href="javascript:;" class="text-gray-800 text-hover-primary mb-1">${data}</a>
                <span>${full.denomination}</span>
              </div>
            `;

            return `
              <div class="symbol symbol-circle symbol-50px overflow-hidden me-3" data-action="view" data-id="${full.id}">
                <a href="javascript:;">
                  ${symbolLabel}
                </a>
              </div>
              ${nomEtPrenoms}
            `;
          },
        },
        {
          title: 'Sexe', data: 'sexe', render: function (data, type, row) {
            return row.sexe;
          }
        },
        {
          title: 'Mobile', data: 'mobile1', render: function (data, type, row) {
            return row.mobile1;
          }
        },
        {
          title: 'Email', data: 'emailPro', render: function (data, type, row) {
            return row.emailPro;
          }
        },
      ],
      createdRow: function (row, data, dataIndex) {
        $('td:eq(0)', row).addClass('d-flex align-items-center');
        // console.log("LAST === ", $('td:eq(0)', row))
      },
    };
    //this.renderActionColumn();
  }

  renderActionColumn(): void {
    // console.log("COLUMNS === ", this.datatableConfig.columns?.find(obj => obj.title == 'Actions'));
    //console.log("COLUMNS === ", this.datatableConfig.columns[this.datatableConfig.columns?.length-1]);
    /*const actionColumn = {
      sortable: false,
      title: 'Actions',
      render: (data: any, type: any, full: any) => {
        const parentDivStart = `<div class="d-flex align-middle">`;
        const viewButton = `
            <button class="btn btn-sm btn-info me-3" data-action="view" data-id="${full.id}">
                 Afficher
            </button>
        `;

        const editButton = `
            <button class="btn btn-sm btn-primary me-3" data-action="edit" data-id="${full.id}">
              Modifier
            </button>
        `;

        const deleteButton = `
            <button class="btn btn-sm btn-danger" data-action="delete" data-id="${full.id}">
              Supprimer
            </button>
        `;

        const parentDivEnd = `</div>`;

        const buttons = [];
        buttons.push(parentDivStart);
        // buttons.push(viewButton);
        buttons.push(editButton);
        buttons.push(deleteButton);
        buttons.push(parentDivEnd);

        return buttons.join('');
      },
    };*/

    if (this.datatableConfig.columns) {
      let actions = this.datatableConfig.columns[this.datatableConfig.columns?.length-1];
      /*console.log("COLUMNS 1 === ", this.datatableConfig.columns?.find(obj => obj.title == 'Actions'))
      console.log("COLUMNS 2 === ", this.datatableConfig.columns[this.datatableConfig.columns?.length-1]);*/
      actions.render = (data: any, type: any, full: any) => {
        // console.log("DATA === ", type);
        const actions = `
            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                Action
              </button>
              <ul class="dropdown-menu">
                <li>
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.id}">Afficher</a>
                </li>
                <li><a type="button" class="dropdown-item" data-action="edit" data-id="${full.id}">Modifier</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a type="button" class="dropdown-item" data-action="delete" data-id="${full.id}">Supprimer</a></li>
              </ul>
            </div>
        `;
        const buttons = [];
        buttons.push(actions);

        return buttons.join('');
      }
      //this.datatableConfig.columns.push(actionColumn);
    }
  }

  supprimer(id: number) {
    const modalRef = this.modalService.open(DeleteUtilisateurModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(() => this.userService.afficherTous(null), () => {});
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.renderActionColumn();

    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn, .dropdown-item');
      if (closestBtn) {
        const { action, id } = closestBtn.dataset;
        this.idInAction = id;
        switch (action) {
          case 'view':
            this.router.navigate(['show', id], {relativeTo: this.route});
            break;

          case 'create':
            // alert("Vous m'avez cliqué !!!");
            this.router.navigate(['new'], {relativeTo: this.route}).then(
              function(){
                // console.log('navigate success');
                console.dir(arguments);
              },
              function(){
                // console.log('navigate failure');
              }
            );
            break;

          case 'edit':
            this.router.navigate(['edit', id], {relativeTo: this.route});
            break;

          case 'delete':
            this.supprimer(id);
            break;
        }
      }
    });
  }
}
