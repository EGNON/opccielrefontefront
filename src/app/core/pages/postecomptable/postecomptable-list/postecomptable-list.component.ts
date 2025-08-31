import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Subscription} from "rxjs";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {PlanService} from "../../../services/plan.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DeletePlanModalComponent} from "../../plan/delete-plan-modal/delete-plan-modal.component";
import {PostecomptableService} from "../../../services/postecomptable.service";
import {DeletePostecomptableModalComponent} from "../delete-postecomptable-modal/delete-postecomptable-modal.component";
import {Config} from "datatables.net";

@Component({
    selector: 'app-postecomptable-list',
    templateUrl: './postecomptable-list.component.html',
    styleUrl: './postecomptable-list.component.scss',
    standalone: false
})
export class PostecomptableListComponent implements OnInit, OnDestroy, AfterViewInit {
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
    public entityService: PostecomptableService,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        // console.log("PARAMS === ", dataTablesParameters);
        const sb = this.entityService.datatable(dataTablesParameters)
          .subscribe(resp => {
            callback(resp.data);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'Plan', data: 'codePlan', render: function (data, type, row) {
            return row.plan.libellePlan;
          }
        },
        {
          title: 'Code', data: 'codePosteComptable', render: function (data, type, row) {
            return row.codePosteComptable;
          }
        },
        {
          title: 'Libellé', data: 'libellePosteComptable', render: function (data, type, row) {
            return row.libellePosteComptable;
          }
        },
        {
          title: 'Type', data: 'type', render: function (data, type, row) {
            return row.type;
          }
        },
        {
          title: 'Formule', data: 'formule', render: function (data, type, row) {
            return row.formule;
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

  renderEmetteurColumn(): void {
    if (this.datatableConfig.columns) {
      let Emetteurs = this.datatableConfig.columns[this.datatableConfig.columns?.length-1];
      Emetteurs.render = (data: any, type: any, full: any) => {
        const parentEmetteurStart = `
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      Action
                    </button>
                    <ul class="dropdown-menu">`;
        const show = `
                <li>
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.codePosteComptable}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit"
                    data-id="${full.codePosteComptable.trim()}"  data-id2="${full.plan.codePlan.trim()}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete"
                    data-id="${full.codePosteComptable.trim()}" data-id2="${full.plan.codePlan.trim()}">Supprimer</a>
                </li>`;
        const parentEmetteurEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentEmetteurStart);
        // Emetteurs.push(show);
        actions.push(edit);
        actions.push(separator);
        actions.push(delete1);
        actions.push(parentEmetteurEnd);

        return actions.join('');
      }
    }
  }

  supprimer(id: any) {
    const modalRef = this.modalService.open(DeletePostecomptableModalComponent);
    modalRef.componentInstance.id = id;

    // modalRef.result.then(() => this.entityService.fetch(), () => {});
  }

  ngAfterViewInit(): void {
    this.renderEmetteurColumn();
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn, .dropdown-item');
      if (closestBtn) {
        const {action, id,id2} = closestBtn.dataset;
        let id4=id+"/"+id2
        this.idInAction = id;
        switch (action) {
          case 'view':
            this.router.navigate(['show', id], {relativeTo: this.route});
            break;

          case 'create':
            this.router.navigate(['new'], {relativeTo: this.route});
            break;

          case 'edit':
            this.router.navigate(['edit', id,id2], {relativeTo: this.route});
            break;

          case 'delete':
            this.supprimer(id4);
            break;
        }
      }
    });
  }
}

