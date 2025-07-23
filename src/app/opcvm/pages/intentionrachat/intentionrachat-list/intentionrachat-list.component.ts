import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Config } from 'datatables.net';
import moment from 'moment';
import { Subscription, switchMap } from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';
import { AuthService } from '../../../../core/modules/auth';
import { DepotrachatService } from '../../../services/depotrachat.service';
import { SeanceopcvmService } from '../../../services/seanceopcvm.service';

import { DeleteIntentionrachatModalComponent } from '../delete-intentionrachat-modal/delete-intentionrachat-modal.component';
import { VerifintentionrachatComponent } from '../verifintentionrachat/verifintentionrachat.component';
import {LocalService} from "../../../../services/local.service";

@Component({
  selector: 'app-intentionrachat-list',
  templateUrl: './intentionrachat-list.component.html',
  styleUrl: './intentionrachat-list.component.scss'
})
export class IntentionrachatListComponent implements OnInit, OnDestroy, AfterViewInit {
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
    public entityService: DepotrachatService,
    public seanceOpcvmService: SeanceopcvmService,
    public localStore: LocalService,
    public authService: AuthService,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    // console.log("currentOpcvm=",this.authService.LocalStorageManager.getValue("currentOpcvm"))
    console.log("opcvm=",this.localStore.getData("currentOpcvm"))
    console.log("user=",this.authService.currentUserValue?.username)
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        console.log("PARAMS === ", dataTablesParameters);
        this.seanceOpcvmService.afficherSeanceEnCours
        (this.localStore.getData("currentOpcvm").idOpcvm).pipe(
          switchMap( (val) => {
            console.log("val=",val)
            this.idSeance=val.data.idSeanceOpcvm.idSeance;
            return this.entityService.datatable_DepotRachat(
              dataTablesParameters,this.localStore.getData("currentOpcvm").idOpcvm
              ,this.idSeance,"INT_RACH");
          })
        ).subscribe(resp=> {
          callback(resp.data);
        })

        /*const sb = this.entityService.datatable_DepotRachat(
          dataTablesParameters,this.localStore.getData("currentOpcvm").idOpcvm
        ,this.idSeance,"INT_RACH")
          .subscribe(resp => {

            callback(resp.data);
          });
        this.subscriptions.push(sb);*/
      },
      columns: [
        {
          title: 'Type', data: 'type', render: function (data, type, row) {
            return row.type;
          }
        },
        {
          title: 'N°OP', data: 'idOperarion', render: function (data, type, row) {
            return row.idOperation;
          }
        },
        {
          title: 'Date OP.', data: 'dateOperation', render: function (data, type, row) {
            return moment(row.dateOperation).format('DD/MM/YYYY');
          }
        },
        {
          title: 'Date valeur', data: 'dateValeur', render: function (data, type, row) {
            //return row.standard;
            return moment(row.dateValeur).format('DD/MM/YYYY');
          }
        },
        {
          title: 'Actionnaire.', data: 'denomination', render: function (data, type, row) {
            //return row.standard;
            return row.actionnaire?.denomination;
          }
        },
        {
          title: 'Distributeur', data: 'denomination', render: function (data, type, row) {
            //return row.standard;
            return row.personne?.denomination;
          }
        },
        {
          title: 'Libelle OP.', data: 'libelleOperation', render: function (data, type, row) {
            //return row.standard;
            return row.libelleOperation;
          }
        },
        {
          title: 'Quantité', data: 'qte', render: function (data, type, row) {
            //return row.standard;
            return row.quantite;
          }
        },
        {
          title: 'Montant', data: 'montant', render: function (data, type, row) {
            //return row.standard;
            return row.montant;
          }
        },
      ],
      createdRow: function (row, data, dataIndex) {
        // $('td:eq(0)', row).addClass('d-flex align-items-center');
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
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idDepotRachat}"
                    data-id2="${full.idSeance}">Modifier</a>
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
        if(!full.estVerifie2)
        {
          actions.push(edit);
          actions.push(separator);
          actions.push(delete1);
        }
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
