import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {Subscription, switchMap, tap} from "rxjs";
import {DataTablesResponse} from "../../../../crm/models/data-tables.response.model";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PersonnelService} from "../../../../crm/services/personne/personnel.service";
import {Config} from "datatables.net";

@Component({
  selector: 'app-personnel-list',
  templateUrl: './personnel-list.component.html',
  styleUrl: './personnel-list.component.scss'
})
export class PersonnelListComponent implements OnInit, AfterViewInit, OnDestroy {

  qualite?: string | null;
  entity: any;
  newButtonTitle: string = "Nouveau";
  title: string;
  isLoading: boolean = false;
  private subscriptions: Subscription[] = [];
  personnes: DataTablesResponse<any>;

  datatableConfig: Config = {};

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  private clickListener: () => void;
  private idInAction: number;

  constructor(
    private renderer: Renderer2,
    public entityService: PersonnelService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal
  ) {
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
            this.router.navigate(['view', id], {relativeTo: this.route});
            break;

          case 'create':
            this.router.navigate(['new'], {relativeTo: this.route});
            break;

          case 'edit':
            this.router.navigate(['edit', id], {relativeTo: this.route});
            break;

          case 'delete':
            //this.supprimer(id);
            break;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.entityService.datatable(dataTablesParameters)
          .subscribe(resp => {
            console.log(resp);
            const result = resp.data;
            callback(result);
          });
      },
      columns: [
        // {
        //   title: 'N° Compte SGI', data: 'numeroCpteDeposit', render: function (data, type, row) {
        //     const numeroCpteDeposit = row.numeroCpteDeposit;
        //     return numeroCpteDeposit || '';
        //   },
        //   orderData: [1],
        //   orderSequence: ['asc', 'desc'],
        //   type: 'string',
        // },
        {
          title: 'Dénomination', data: 'nom', render: function (data, type, full) {
            return full.denomination || '';
          }
        },
        {
          title: 'Sexe', data: 'sexe', render: function (data, type, full) {
            return full.sexe || '';
          }
        },
        {
          title: 'Mobile 1', data: 'mobile1', render: function (data, type, row) {
            const roleName = row.mobile1;
            return roleName || '';
          },
          orderData: [1],
          orderSequence: ['asc', 'desc'],
          type: 'string',
        }
      ],
      createdRow: function (row, data, dataIndex) {
        // $('td', row).each(function (index, value) {
        //   $(value).addClass('min-w-200px');
        //   console.log(`For index ${index}, data value is ${value}`);
        // });
        // $('td:eq(0)', row).addClass('d-flex align-items-center');
        // $('td:last-child', row).addClass('d-flex flex-row align-middle');
      },
    };
  }

  renderActionColumn(): void {
    if (this.datatableConfig.columns) {
      let actions = this.datatableConfig.columns[this.datatableConfig.columns?.length-1];
      actions.render = (data: any, type: any, full: any) => {
        const parentActionStart = `
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      Action
                    </button>
                    <ul class="dropdown-menu">`;
        const show = `
                <li>
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idPersonne}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idPersonne}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.idPersonne}">Supprimer</a>
                </li>`;
        const parentActionEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentActionStart);
        actions.push(show);
        actions.push(edit);
        actions.push(separator);
        actions.push(delete1);
        actions.push(parentActionEnd);

        return actions.join('');
      }
    }
  }

  supprimer(id: string) {
    const modalRef = this.modalService.open(null);
    modalRef.componentInstance.id = id;
    //modalRef.result.then(() => this.entityService.fetch(), () => {});
  }
}
