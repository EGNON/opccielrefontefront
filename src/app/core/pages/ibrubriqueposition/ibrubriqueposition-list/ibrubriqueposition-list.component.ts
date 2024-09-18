import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Subscription} from "rxjs";
import {CleComptecomptable} from "../../../models/clecomptecomptable.model";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {FormuleService} from "../../../services/formule.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DeleteFormuleModalComponent} from "../../formule/delete-formule-modal/delete-formule-modal.component";
import {IbrubriquepositionService} from "../../../services/ibrubriqueposition.service";
import {
  DeleteIbrubriquepositionModalComponent
} from "../delete-ibrubriqueposition-modal/delete-ibrubriqueposition-modal.component";
import {Config} from "datatables.net";

@Component({
  selector: 'app-ibrubriqueposition-list',
  templateUrl: './ibrubriqueposition-list.component.html',
  styleUrl: './ibrubriqueposition-list.component.scss'
})
export class IbrubriquepositionListComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  idCompteComptable:CleComptecomptable;
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
    public entityService: IbrubriquepositionService,
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
          title: 'Code IB', data: 'codeIB', render: function (data, type, row) {
            return row.ib.codeIB;
          }
        },
        {
          title: 'Libellé IB', data: 'libelleIb', render: function (data, type, row) {
            return row.ib.libelleIb;
          }
        },
        {
          title: 'Code rubrique', data: 'codeRubrique', render: function (data, type, row) {
            return row.codeRubrique;
          }
        },
        {
          title: 'Code position', data: 'codePosition', render: function (data, type, row) {
            return row.codePosition;
          }
        },
        {
          title: 'Libellé position', data: 'libellePosition', render: function (data, type, row) {
            return row.libellePosition;
          }
        },
        {
          title: 'Type', data: 'typeValeur', render: function (data, type, row) {
            return row.typeValeur;
          }
        },
        {
          title: 'Modèle', data: 'estModele', render: function (data, type, row) {
            return `<div class="badge ${row.estModele ? 'badge-danger' : 'badge-success'} fw-bold">${row.estModele ? 'OUI' : 'NON'}</div>`;
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
      Operations.render = (data: any, type: any, full: any) => {
        const parentOperationStart = `
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      Action
                    </button>
                    <ul class="dropdown-menu">`;

        const show = `
                <li>
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idFormule}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.ib.codeIB}"
                    data-id2="${full.codeRubrique}" data-id3="${full.codePosition}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.ib.codeIB}"
                    data-id2="${full.codeRubrique}" data-id3="${full.codePosition}">Supprimer</a>
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
    const modalRef = this.modalService.open(DeleteIbrubriquepositionModalComponent);
    modalRef.componentInstance.id = id;

    // modalRef.result.then(() => this.entityService.fetch(), () => {});
  }

  ngAfterViewInit(): void {
    this.renderOperationColumn();
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn, .dropdown-item');
      if (closestBtn) {
        const {action, id,id2,id3} = closestBtn.dataset;
        let id4=id+"/"+id2+"/"+id3
        this.idInAction = id;
        switch (action) {
          case 'view':
            this.router.navigate(['show', id], {relativeTo: this.route});
            break;

          case 'create':
            this.router.navigate(['new'], {relativeTo: this.route});
            break;

          case 'edit':
            this.router.navigate(['edit', id,id2,id3], {relativeTo: this.route});
            break;

          case 'delete':
            this.supprimer(id4);
            break;
        }
      }
    });
  }
}
