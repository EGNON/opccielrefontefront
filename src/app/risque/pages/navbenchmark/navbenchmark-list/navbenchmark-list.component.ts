import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Subscription, switchMap} from "rxjs";
import {Config} from "datatables.net";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {DepotrachatService} from "../../../../opcvm/services/depotrachat.service";
import {SeanceopcvmService} from "../../../../opcvm/services/seanceopcvm.service";
import {LocalService} from "../../../../services/local.service";
import {AuthService} from "../../../../core/modules/auth";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import moment from "moment/moment";
import {
  VerifintentionrachatComponent
} from "../../../../opcvm/pages/intentionrachat/verifintentionrachat/verifintentionrachat.component";
import {
  DeleteIntentionrachatModalComponent
} from "../../../../opcvm/pages/intentionrachat/delete-intentionrachat-modal/delete-intentionrachat-modal.component";

@Component({
    selector: 'app-navbenchmark-list',
    templateUrl: './navbenchmark-list.component.html',
    styleUrl: './navbenchmark-list.component.scss',
    standalone: false
})
export class NavbenchmarkListComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  idSeance:number;
  estVerifie2:boolean;
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
    public entityService: SeanceopcvmService,
    public localStore: LocalService,
    public authService: AuthService,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.afficherSeanceOpcvm()
  }
  afficherSeanceOpcvm(){
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const sb = this.entityService.datatable(dataTablesParameters)
          .subscribe(resp => {
            callback(resp.data);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title:'Opcvm', data: 'denominationOpcvm', render: function (data, type, row) {
            return row.opcvm.denominationOpcvm;
          },
        },
        {
          title: 'Date ouverture', data: 'dateOuverture', render: function (data, type, row) {
            return moment(row.dateOuverture).format('DD-MM-YYYY');
          },
        },
        {
          title: 'Date fermeture', data: 'dateFermeture', render: function (data, type, row) {
            return moment(row.dateFermeture).format('DD-MM-YYYY');
          },
        },
        {
          title: 'NavBenchMark', data: 'navBenchmark', render: function (data, type, row) {
            return row.navBenchmark;
          },
        },
      ],
      createdRow: function (row, data, dataIndex) {
        $('td:eq(0)', row).addClass('d-flex align-items-center');
        // $('td:last-child', row).addClass('d-flex flex-row align-middle');
      },
    };
  }

  verifierRachat() {
    const modalRef = this.modalService.open(VerifintentionrachatComponent, {
      backdrop: "static",
      size: "xl"
    });
    modalRef.componentInstance.passEntry.subscribe((receivedEntry:any) => {
      //this.currentOpcvm = receivedEntry;
      //console.log("RESP === ", receivedEntry);
    });
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
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idDepotRachat}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idSeanceOpcvm.idOpcvm}"
                    data-id2="${full.idSeanceOpcvm.idSeance}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.idDepotRachat}"
                    >Supprimer</a>
                </li>`;
        const parentActionEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentActionStart);
        // actions.push(show);

          actions.push(edit);
          actions.push(separator);
          // actions.push(delete1);

        actions.push(parentActionEnd);

        return actions.join('');
      }
    }
  }

  supprimer(id: string) {
    const modalRef = this.modalService.open(DeleteIntentionrachatModalComponent);
    modalRef.componentInstance.id = id;
    // modalRef.result.then(() => this.entityService.fetch(), () => {});
  }

  ngAfterViewInit(): void {
    this.renderActionColumn();
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn, .dropdown-item');
      if (closestBtn) {
        const {action, id,id2} = closestBtn.dataset;
        this.idInAction = id;
        let id3=id+"/"+id2;
        switch (action) {
          case 'view':
            this.router.navigate(['show', id], {relativeTo: this.route});
            break;

          case 'create':
            this.router.navigate(['new',id2], {relativeTo: this.route});
            break;

          case 'edit':
            this.router.navigate(['edit', id,id2], {relativeTo: this.route});
            break;

          case 'delete':
            this.supprimer(id3);
            break;
        }
      }
    });
  }
}
