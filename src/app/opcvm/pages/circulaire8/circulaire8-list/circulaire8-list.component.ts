import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {finalize, Subscription} from "rxjs";
import {Config} from "datatables.net";
import {SweetAlertOptions} from "sweetalert2";
import {LocalService} from "../../../../services/local.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ActionnaireopcvmService} from "../../../services/actionnaireopcvm.service";
import {AuthService} from "../../../../core/modules/auth";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  DeleteActionnaireopcvmModalComponent
} from "../../actionnaireopcvm/delete-actionnaireopcvm-modal/delete-actionnaireopcvm-modal.component";
import {Infoscirculaire8Service} from "../../../services/infoscirculaire8.service";
import moment from "moment";
import {DeleteModalCirculaire8Component} from "../delete-modal-circulaire8/delete-modal-circulaire8.component";
import { LibrairiesService } from '../../../../services/librairies.service';
import { LoaderService } from '../../../../loader.service';

@Component({
    selector: 'app-circulaire8-list',
    templateUrl: './circulaire8-list.component.html',
    styleUrl: './circulaire8-list.component.scss',
    standalone: false
})
export class Circulaire8ListComponent implements OnInit, OnDestroy, AfterViewInit {
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
    public entityService: Infoscirculaire8Service,
    public libaririeService: LibrairiesService,
    public loaderService: LoaderService,
    public authService: AuthService,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    console.log("currentOpcvm=",this.localStore.getData("currentOpcvm"))
    console.log("idOpcvm=",this.localStore.getData("currentOpcvm")?.idOpcvm)
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        console.log("PARAMS === ", dataTablesParameters);
        const sb = this.entityService.datatable_id(dataTablesParameters,this.localStore.getData("currentOpcvm")?.idOpcvm)
          .subscribe(resp => {
            callback(resp.data);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'Date début', data: 'dateDebut', render: function (data, type, row) {
            return moment(row.dateDebut).format('DD/MM/YYYY');
          }
        },
        {
          title: 'Date fin', data: 'dateFin', render: function (data, type, row) {
            return moment(row.dateFin).format('DD/MM/YYYY');
          }
        },
        {
          title: 'Evenement marquant', data: 'evenementMarquant', render: function (data, type, row) {
            return row.evenementMarquant;
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
imprimer(dateDebut:Date,dateFin:Date,idOpcvm:number){
  this.loaderService.setLoading(false); 
  this.loaderService.setLoading(true);  
  const entity={
      dateDebut:dateDebut,
      dateFin:dateFin,
      idOpcvm:idOpcvm
    }

    this.libaririeService.circulaire8(
        entity).pipe(
          finalize(()=>{
           this.loaderService.setLoading(false);
          })
        ).subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'circulaire8.pdf';
          a.click();
        });
        
    
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
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.numLigne}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.numLigne}"
                    >Modifier</a>
                </li>`;
        const print = `
                <li>
                    <a type="button" class="dropdown-item" data-action="print" data-id2="${full.dateDebut}" data-id3="${full.dateFin}"
                    >Imprimer</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.numLigne}"
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
        actions.push(print);
        actions.push(parentActionEnd);

        return actions.join('');
      }
    }
  }

  supprimer(id: string) {
    const modalRef = this.modalService.open(DeleteModalCirculaire8Component);
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
        const dateDebut=id2;
        const dateFin=id3;
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

          case 'print':
            console.log(dateDebut)
            console.log(dateFin)
            this.imprimer(dateDebut,dateFin,this.localStore.getData("currentOpcvm")?.idOpcvm);
            break;
        }
      }
    });
  }
}

