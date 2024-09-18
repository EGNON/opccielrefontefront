import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AffectationService} from "../../../services/affectation.service";
import {DeleteAffectationModalComponent} from "../delete-affectation-modal/delete-affectation-modal.component";
import {Compterendu} from "../../../models/compterendu.model";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import moment from "moment";
import {AuthService} from "../../../../core/modules/auth";
import {Config} from "datatables.net";

@Component({
  selector: 'app-affectation-list',
  templateUrl: './affectation-list.component.html',
  styleUrls: ['./affectation-list.component.scss']
})
 export class AffectationListComponent implements OnInit, OnDestroy, AfterViewInit{
  isLoading: boolean;
  compteRendu$: Observable<Compterendu[]>;
private subscriptions: Subscription[] = [];

  aEntity: Observable<any>;
  compteRendu: any;
  compteRendus: Compterendu[];
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
    public affectationService: AffectationService,
    private router: Router,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.afficherAffectation();
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
    this.clickListener();
  }
  this.subscriptions.forEach((sb) => sb.unsubscribe());
}
  afficherAffectation(){
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const sb = this.affectationService.datatableList(dataTablesParameters)
          .pipe(
            filter((resp) => resp.data.length > 0)
          )
          .subscribe(resp => {
            callback(resp);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'Date affectation', data: 'dateAffectation', render: function (data, type, row) {
            return moment(row.dateAffectation).format('DD-MM-YYYY');
          },
        },
        {
          title: 'Agent', data: 'denomination', render: function (data, type, row) {
            return row.personnel.denomination;
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
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idAffectation}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idAffectation}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.idAffectation}">Supprimer</a>
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

  supprimer(id: number) {
    const modalRef = this.modalService.open(DeleteAffectationModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(() => this.affectationService.fetchRows(null), () => {});
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

          case 'view':
          this.router.navigate(['view', id], {relativeTo: this.route});
          break;

          case 'delete':
            this.supprimer(id);
            break;
        }
      }
    });
  }
}
//implements OnInit, OnDestroy{
//   isLoading: boolean;
//   entities$: Observable<Affectation[]>;
//
//   constructor(
//     public entityService: AffectationService,
//     private modalService: NgbModal) {}
//
//   ngOnInit(): void {
//     this.entities$ = this.entityService.afficherTous();
//   }
//
//   ngOnDestroy(): void {}
//
//   supprimer(id: number) {
//     const modalRef = this.modalService.open(DeleteAffectationModalComponent);
//     modalRef.componentInstance.id = id;
//     modalRef.result.then(() => this.entityService.fetch(), () => {});
//   }
// }
