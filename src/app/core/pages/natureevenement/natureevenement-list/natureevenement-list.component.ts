import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Subscription} from "rxjs";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NatureevenementService} from "../../../services/natureevenement.service";
import {
  DeleteNatureevenementModalComponent
} from "../delete-natureevenement-modal/delete-natureevenement-modal.component";
import {Config} from "datatables.net";

@Component({
  selector: 'app-natureevenement-list',
  templateUrl: './natureevenement-list.component.html',
  styleUrl: './natureevenement-list.component.scss'
})
export class NatureevenementListComponent implements OnInit, OnDestroy, AfterViewInit {
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
    public entityService: NatureevenementService,
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
          title: 'Libellé', data: 'libelleNatureEvenement', render: function (data, type, row) {
            return row.libelleNatureEvenement;
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
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idNatureEvenement}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idNatureEvenement}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.idNatureEvenement}">Supprimer</a>
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

  supprimer(id: any) {
    const modalRef = this.modalService.open(DeleteNatureevenementModalComponent);
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

