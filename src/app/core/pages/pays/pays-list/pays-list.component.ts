import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DeletePaysModalComponent} from "../delete-pays-modal/delete-pays-modal.component";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../modules/auth";
import {PaysService} from "../../../../crm/services/pays.service";
import {Config} from "datatables.net";

@Component({
    selector: 'app-pays-list',
    templateUrl: './pays-list.component.html',
    styleUrls: ['./pays-list.component.scss'],
    standalone: false
})
export class PaysListComponent implements OnInit, OnDestroy, AfterViewInit{
  isLoading: boolean;
  private subscriptions: Subscription[] = [];

  aEntity: Observable<any>;
  datatableConfig: Config = {};

  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  swalOptions: SweetAlertOptions = {};

  private clickListener: () => void;
  private idInAction: number;

  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private authService: AuthService,
    public paysService: PaysService,
    private router: Router,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.afficherPays();
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  afficherPays(){
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const sb = this.paysService.afficherTous(dataTablesParameters)
          .subscribe(resp => {
            callback(resp);
            console.log(resp);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'Libelle(fr)', data: 'libelleFr', render: function (data, type, row) {
            return row.libelleFr;
          },
        },
        {
          title: 'Libelle(En)', data: 'libelleEn', render: function (data, type, row) {
            return row.libelleEn;
          },
        },
        {
          title: 'Indicatif', data: 'indicatif', render: function (data, type, row) {
            return row.indicatif;
          },
        },
        {
          title: 'monnaie', data: 'codeMonnaie', render: function (data, type, row) {
            const monnaie = row.monnaieDto;
            return monnaie ? row.monnaieDto.codeMonnaie : '';
          },
        }
      ],
      createdRow: function (row, data, dataIndex) {
        $('td:eq(0)', row).addClass('d-flex align-items-center');
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
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idPays}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idPays}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.idPays}">Supprimer</a>
                </li>`;
        const parentActionEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentActionStart);
        // actions.push(show);
        actions.push(edit);
        actions.push(separator);
        actions.push(delete1);
        actions.push(parentActionEnd);

        return actions.join('');
      }
    }
  }

  supprimer(id: number) {
    const modalRef = this.modalService.open(DeletePaysModalComponent);
    modalRef.componentInstance.id = id;
    //modalRef.result.then(() => this.paysService.fetchRows(null), () => {});
  }

  ngAfterViewInit(): void {
    this.renderActionColumn();
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn, .dropdown-item');
      if (closestBtn) {
        const { action, id } = closestBtn.dataset;
        this.idInAction = id;
        switch (action) {

          case 'create':
            this.router.navigate(['new'], {relativeTo: this.route});
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
//OnInit, OnDestroy{
//   isLoading: boolean;
//   entities$: Observable<Pays[]>;
//   private subscriptions: Subscription[] = [];
//
//   constructor(
//     public entityService: PaysService,
//     private modalService: NgbModal) {}
//
//   ngOnInit(): void {
//     const sb = this.entityService.isLoading$.subscribe(res => this.isLoading = res);
//     this.subscriptions.push(sb);
//     this.entityService.fetch();
//     this.entities$ = this.entityService.items$;
//   }
//
//   ngOnDestroy(): void {
//     this.subscriptions.forEach((sb) => sb.unsubscribe());
//   }
//
//   supprimer(id: number) {
//     const modalRef = this.modalService.open(DeletePaysModalComponent);
//     modalRef.componentInstance.id = id;
//     modalRef.result.then(() => this.entityService.fetch(), () => {});
//   }
// }
