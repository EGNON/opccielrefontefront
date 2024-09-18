import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Subscription} from "rxjs";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SousCategorieService} from "../../../../titresciel/services/souscategorie.service";
import {DeleteSouscategorieModalComponent} from "../delete-souscategorie-modal/delete-souscategorie-modal.component";
import {Config} from "datatables.net";

@Component({
  selector: 'app-souscategorie-list',
  templateUrl: './souscategorie-list.component.html',
  styleUrl: './souscategorie-list.component.scss'
})
export class SouscategorieListComponent implements OnInit, OnDestroy, AfterViewInit {
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
    public entityService: SousCategorieService,
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
          title: 'libellé', data: 'libelleSousCategorie', render: function (data, type, row) {
            return row.libelleSousCategorie;
          }
        },
        {
          title: 'Catégorie', data: 'libelleCategorie', render: function (data, type, row) {
            return row.categoriePersonne?.libelle;
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
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idSousCategorie}">Afficher</a>
                </li>`;
      const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idSousCategorie}">Modifier</a>
                </li>`;
      const separator = `<li><hr class="dropdown-divider"></li>`;
      const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.idSousCategorie}">Supprimer</a>
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
    const modalRef = this.modalService.open(DeleteSouscategorieModalComponent);
    modalRef.componentInstance.id = id;
    // modalRef.result.then(() => this.entityService.fetch(), () => {});
  }

  ngAfterViewInit(): void {
    this.renderActionColumn();
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
