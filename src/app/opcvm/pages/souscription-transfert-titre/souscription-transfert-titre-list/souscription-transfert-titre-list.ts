import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Config } from 'datatables.net';
import { Subscription, filter, map, tap, switchMap } from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';
import { AuthService } from '../../../../core/modules/auth';
import { LocalService } from '../../../../services/local.service';
import { TarificationordinaireService } from '../../../services/tarificationordinaire.service';
import { DeleteTarificationordinaireModalComponent } from '../../tarificationordinaire/delete-tarificationordinaire-modal/delete-tarificationordinaire-modal.component';
import {Action} from "../../../../core/modules/entity-crud/entity-crud.component";
import { DepotRachatService } from '../../../../lab/services/depotrachat.service';
import { DepotrachatService } from '../../../services/depotrachat.service';
import moment from 'moment';
import { DeleteModalOperationevenementsurvaleurComponent } from '../../operationevenementsurvaleur/delete-modal-operationevenementsurvaleur/delete-modal-operationevenementsurvaleur.component';
import { Verifsouscriptiontransferttitre } from '../verifsouscriptiontransferttitre/verifsouscriptiontransferttitre';

@Component({
  selector: 'app-souscription-transfert-titre-list',
  standalone: false,
  templateUrl: './souscription-transfert-titre-list.html',
  styleUrl: './souscription-transfert-titre-list.scss'
})
export class SouscriptionTransfertTitreList implements OnInit, OnDestroy, AfterViewInit {
  isLoading: boolean;
  private subscriptions: Subscription[] = [];

  datatableConfig: Config = {};
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  swalOptions: SweetAlertOptions = {};

  private clickListener: () => void;
  private idInAction: number;

  constructor(
    private localStore: LocalService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    public entityService: DepotrachatService,
    public authService: AuthService,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {

    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        console.log("PARAMS === ", dataTablesParameters);
        const sb = this.entityService.afficherDepotRachatTransfert(dataTablesParameters,this.localStore.getData("currentOpcvm")?.idOpcvm,
      this.localStore.getData("currentSeance")?.idSeanceOpcvm.idSeance)
          .subscribe(resp => {
            callback(resp.data);
            console.log(resp.data)
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'TYPE', data: 'type', render: function (data, type, row) {
            return row.type;
          }
        },
        {
          title: 'N° OP.', data: 'idOperation', render: function (data, type, row) {
            return row.idOperation;
          }
        },
        {
          title: 'Date opération', data: 'dateOperation', render: function (data, type, row) {
            return moment(row.dateOperation).format('DD/MM/YYYY');
          }
        },
        {
          title: 'DATE VALEUR', data: 'dateValeur', render: function (data, type, row) {
            return moment(row.dateValeur).format('DD/MM/YYYY');
          }
        },
        {
          title: 'LIBELLE OP.', data: 'libelleOperation', render: function (data, type, row) {
            return row.libelleOperation;
          }
        },
        {
          title: 'QUANTITE', data: 'qte', render: function (data, type, row) {
            return  row.qte;
          }
        },
        {
          title: 'MONTANT', data: 'montant', render: function (data, type, row) {
            return  row.montant;
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
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idOperation}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idOperation}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.idOperation}"
                    >Supprimer</a>
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
  verifierSouscriptionTRansfertTitre() {
      const modalRef = this.modalService.open(Verifsouscriptiontransferttitre, {
        backdrop: "static",
        size: "xl"
      });
      modalRef.componentInstance.passEntry.subscribe((receivedEntry:any) => {
        //this.currentOpcvm = receivedEntry;
        //console.log("RESP === ", receivedEntry);
      });
    }
  supprimer(id: string) {
    const modalRef = this.modalService.open(DeleteModalOperationevenementsurvaleurComponent);
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
        // let id3=id+"/"+id2;
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
