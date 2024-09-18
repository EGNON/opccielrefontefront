import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Observable, Subscription, tap} from "rxjs";
import {Affectation} from "../../../models/affectation.model";
import {AffectationService} from "../../../services/affectation.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute, Router} from "@angular/router";
import {SweetAlertOptions} from "sweetalert2";
import moment from "moment";
import {filter, map} from "rxjs/operators";
import {AuthService} from "../../../../core/modules/auth";
import {Config} from "datatables.net";

@Component({
  selector: 'app-objectif-atteint-list',
  templateUrl: './objectif-atteint-list.component.html',
  styleUrls: ['./objectif-atteint-list.component.scss']
})
export class ObjectifAtteintListComponent implements OnInit, OnDestroy, AfterViewInit{
  isLoading: boolean;
  entities$: Observable<Affectation[]>;

  private subscriptions: Subscription[] = [];

  datatableConfig: Config = {};

  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  swalOptions: SweetAlertOptions = {};

  private clickListener: () => void;
  private idInAction: number;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private router: Router,
    public entityService: AffectationService,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const sb = this.entityService.datatableList(dataTablesParameters)
          .pipe(
            filter((resp) => resp.data.length > 0),
            map(n => {
              const newData = n.data.filter(obj => obj.personnel.idPersonne === this.authService.currentUserValue?.idPersonne);
              return {...n, data: newData};
            })
          )
          .subscribe(resp => {
            callback(resp);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'DATE AFFECTATION', data: 'dateAffectation', render: function (data, type, row) {
            return moment(data).format('DD MMM YYYY à hh:mm');
          }
        },
        {
          title: 'SOUMISSION', data: 'dateSoumission', render: function (data, type, row) {
            return data ? moment(data).format('DD MMM YYYY à hh:mm') : '<div class="badge badge-danger fw-bold">Non soumis</div>';
          }
        },
        {
          title: 'AGENT', data: 'personnel', render: function (data, type, row) {
            return data.denomination;
          },
          orderData: [1],
          orderSequence: ['asc', 'desc'],
          type: 'string',
        }
      ],
      createdRow: function (row, data, dataIndex) {
        $('td:eq(0)', row).addClass('d-flex align-items-center');
        $('td:last-child', row).addClass('d-flex flex-row align-middle');
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
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idAffectation}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idAffectation}">Modifier</a>
                </li>`;
        const rapport = `
                <li>
                    <a type="button" class="dropdown-item" data-action="rapport" data-id="${full.idAffectation}">Rapport</a>
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
        // actions.push(edit);
        actions.push(rapport);
        /*actions.push(separator);
        actions.push(delete1);*/
        actions.push(parentActionEnd);

        return actions.join('');
      }
    }
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

          case 'rapport':
            this.router.navigate([id, 'rapport'], {relativeTo: this.route});
            break;
        }
      }
    });
  }
}
