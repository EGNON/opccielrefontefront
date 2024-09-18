import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Subscription} from "rxjs";
import {Config} from "datatables.net";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {CategorieclientService} from "../../../../services/revuecompte/categorieclient.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  DeleteCategorieclientModalComponent
} from "../../categorieclient/delete-categorieclient-modal/delete-categorieclient-modal.component";

@Component({
  selector: 'app-categorieclient-list',
  templateUrl: './categorieclient-list.component.html',
  styleUrl: './categorieclient-list.component.scss'
})
export class CategorieclientListComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  datatableConfig: Config = {};
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  swalOptions: SweetAlertOptions = {};

  private clickListener: () => void;
  private idInAction: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    public entityService: CategorieclientService,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        console.log("PARAMS === ", dataTablesParameters);
        const sb = this.entityService.datatable(dataTablesParameters)
          .subscribe(resp => {
            callback(resp.data);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'Code', data: 'codeCategorieClient', render: function (data, Categorie, row) {
            return row.codeCategorieClient;
          }
        },
        {
          title: 'Libellé', data: 'libelleCategorieClient', render: function (data, Categorie, row) {
            return row.libelleCategorieClient;
          }
        },
      ],
      createdRow: function (row, data, dataIndex) {
        // $('td:eq(0)', row).addClass('d-flex align-items-center');
      },
    };
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  renderOperationColumn(): void {
    if (this.datatableConfig.columns) {
      let Operations = this.datatableConfig.columns[this.datatableConfig.columns?.length-1];
      Operations.render = (data: any, Categorie: any, full: any) => {
        const parentOperationStart = `
                <div class="btn-group">
                    <button Categorie="button" class="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      Action
                    </button>
                    <ul class="dropdown-menu">`;

        const show = `
                <li>
                    <a Categorie="button" class="dropdown-item" data-action="view" data-id="${full.idCategorieClient}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a Categorie="button" class="dropdown-item" data-action="edit" data-id="${full.idCategorieClient}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a Categorie="button" class="dropdown-item" data-action="delete" data-id="${full.idCategorieClient}">Supprimer</a>
                </li>`;
        const parentOperationEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentOperationStart);
        // Operations.push(show);
        actions.push(edit);
        actions.push(separator);
        actions.push(delete1);
        actions.push(parentOperationEnd);

        return actions.join('');
      }
    }
  }

  supprimer(id: any) {
    const modalRef = this.modalService.open(DeleteCategorieclientModalComponent);
    modalRef.componentInstance.id = id;

    // modalRef.result.then(() => this.entityService.fetch(), () => {});
  }

  ngAfterViewInit(): void {
    this.renderOperationColumn();
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn, .dropdown-item');
      if (closestBtn) {
        const {action, id} = closestBtn.dataset;
        this.idInAction = id;
        switch (action) {
          case 'view':
            this.router.navigate(['show', id], {relativeTo: this.route});
            break;

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
