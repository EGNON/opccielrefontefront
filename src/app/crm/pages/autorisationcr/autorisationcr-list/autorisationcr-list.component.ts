import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit, QueryList,
  Renderer2,
  ViewChildren
} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {Compterendu} from "../../../models/compterendu.model";
import {SweetAlertOptions} from "sweetalert2";
import {CompterenduService} from "../../../services/compterendu.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {filter, map} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../core/modules/auth";
import {Config} from "datatables.net";

@Component({
    selector: 'app-autorisationcr-list',
    templateUrl: './autorisationcr-list.component.html',
    styleUrls: ['./autorisationcr-list.component.scss'],
    standalone: false
})
export class AutorisationcrListComponent implements OnInit, OnDestroy, AfterViewInit{
  @ViewChildren("itemElement") private itemElements: QueryList<ElementRef>;

  isLoading: boolean;
  entities$: Observable<Compterendu[]>;
  private subscriptions: Subscription[] = [];

  aEntity: Observable<any>;
  entity: any;
  entities: Compterendu[];
  datatableConfig: Config = {};

  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  swalOptions: SweetAlertOptions = {};

  private clickListener: () => void;
  private idInAction: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private elRef:ElementRef,
    private authService: AuthService,
    public entityService: CompterenduService,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const sb = this.entityService.afficherTous(dataTablesParameters)
          /* .pipe(
            filter((resp) => resp.data.length > 0),
            map(n => {
              const newData = n.data.filter(obj => obj.createur?.idPersonne === this.authService.currentUserValue?.id && obj.estValide);
              return {...n, data: newData};
            })
          ) */
          .subscribe(resp => {
            callback({
              ...resp,
              recordsFiltered:resp.data.length,
              recordsTotal:resp.data.length
            });
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'Objet', data: 'objetCR', render: function (data, type, row) {
            return row.objetCR;
          },
        },
        {
          title: 'Description', data: 'description', render: function (data, type, row) {
            return row.description;
          }
        },
        {
          title: 'Etat', data: 'estValide', render: function (data, type, full) {
            const etat = data || full.estValide;
            return `<div class="badge ${etat ? 'badge-success' : 'badge-info'} fw-bold">${etat ? 'Validé' : 'En cours'}</div>`;
          }
        },
      ],
      createdRow: function (row, data, dataIndex) {
        $('td:eq(0)', row).addClass('d-flex align-items-center');
      },
    };
  }

  ngOnDestroy(): void {
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
        const lock = `
                <li>
                    <a type="button" class="dropdown-item" data-action="lock" data-id="${full.id}">${full.estValide ? 'Débloquer' : 'Bloquer'}</a>
                </li>`;
        const parentActionEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentActionStart);
        actions.push(lock);
        actions.push(parentActionEnd);

        return actions.join('');
      }
    }
  }

  bloquerDebloquer(id: number, request: any, button: any)
  {
    this.entityService.validateCR(id, request).subscribe({
      next: () => {
        button.textContent = !request.estValide ? "Bloquer" : "Débloquer";
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([currentUrl]);
        });
      },
      error: err => {

      }
    });
  }

  ngAfterViewInit(): void {
    this.renderActionColumn();
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn, .dropdown-item');
      if (closestBtn) {
        const { action, id } = closestBtn.dataset;
        this.idInAction = id;
        switch (action) {
          case 'lock':
            const etat = !closestBtn.textContent.toLowerCase().includes("débloquer");
            // alert(closestBtn.classList);
            this.bloquerDebloquer(id, {estValide: etat}, closestBtn);
            break;
        }
      }
    });
  }
}
