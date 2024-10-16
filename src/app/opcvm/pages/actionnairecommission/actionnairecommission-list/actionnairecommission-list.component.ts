import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Subscription} from "rxjs";
import {Config} from "datatables.net";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {ActionnaireopcvmService} from "../../../services/actionnaireopcvm.service";
import {AuthService} from "../../../../core/modules/auth";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  DeleteActionnaireopcvmModalComponent
} from "../../actionnaireopcvm/delete-actionnaireopcvm-modal/delete-actionnaireopcvm-modal.component";
import {ActionnairecommissionService} from "../../../services/actionnairecommission.service";
import moment from "moment";
import {formatNumber} from "@angular/common";
import {
  DeleteActionnairecommissionModalComponent
} from "../delete-actionnairecommission-modal/delete-actionnairecommission-modal.component";

@Component({
  selector: 'app-actionnairecommission-list',
  templateUrl: './actionnairecommission-list.component.html',
  styleUrl: './actionnairecommission-list.component.scss'
})
export class ActionnairecommissionListComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  dateRecup:string[];
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
    public entityService: ActionnairecommissionService,
    public authService: AuthService,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    //console.log("currentOpcvm=",this.authService.LocalStorageManager.getValue("currentOpcvm"))
    //console.log("idOpcvm=",this.authService.LocalStorageManager.getValue("currentOpcvm")?.idOpcvm)
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        console.log("PARAMS === ", dataTablesParameters);
        const sb = this.entityService.datatable_id(dataTablesParameters,this.authService.LocalStorageManager.getValue("currentOpcvm")?.idOpcvm)
          .subscribe(resp => {
            callback(resp.data);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'Dénomination', data: 'denomination', render: function (data, type, row) {
            return row.personne.denomination;
          }
        },
        {
          title: 'Type commission', data: 'typeCommission', render: function (data, type, row) {
            return row.typeCommission;
          }
        },
        {
          title: 'Profil', data: 'libelleProfil', render: function (data, type, row) {
            return row.libelleProfil;
          }
        },
        {
          title: 'Date', data: 'date', render: function (data, type, row) {
            /*let daterecup:string[];
            let mois:number;
            let libelleMois:string;
             daterecup=row.date;
             mois=Number(daterecup[1]);
             libelleMois=daterecup[1]
             if(mois<10)
               libelleMois="0"+daterecup[1];*/
            //console.log(daterecup)
            return moment(data).format('DD/MM/YYYY');
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
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idCritereAlerte}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.personne.idPersonne}"
                    data-id2="${full.opcvm.idOpcvm}" data-id3="${full.typeCommission}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.personne.idPersonne}"
                    data-id2="${full.opcvm.idOpcvm}" data-id3="${full.typeCommission}">Supprimer</a>
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

  supprimer(id: string) {
    const modalRef = this.modalService.open(DeleteActionnairecommissionModalComponent);
    modalRef.componentInstance.id = id;
    // modalRef.result.then(() => this.entityService.fetch(), () => {});
  }

  ngAfterViewInit(): void {
    this.renderActionColumn();
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn, .dropdown-item');
      if (closestBtn) {
        const {action, id,id2,id3} = closestBtn.dataset;
        this.idInAction = id;
        let id4=id+"/"+id2+"/"+id3;

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

