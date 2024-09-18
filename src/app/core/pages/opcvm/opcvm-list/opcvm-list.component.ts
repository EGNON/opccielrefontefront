import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import moment from "moment/moment";
import $ from "jquery";
import {OpcvmService} from "../../../../opcvm/services/opcvm.service";
import {Subscription} from "rxjs";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {DeleteOpcvmModalComponent} from "../delete-opcvm-modal/delete-opcvm-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {Config} from "datatables.net";

@Component({
  selector: 'app-opcvm-list',
  templateUrl: './opcvm-list.component.html',
  styleUrl: './opcvm-list.component.scss'
})
export class OpcvmListComponent implements OnInit, AfterViewInit, OnDestroy{
  datatableConfig: Config = {};
  dtOptions: any = {};

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  private clickListener: () => void;
  private idInAction: number;

  private subscriptions: Subscription[] = [];

  constructor(
    private pageInfo: PageInfoService,
    private renderer: Renderer2,
    private opcvmService: OpcvmService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal) {}

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.pageInfo.updateTitle("Liste des opcvms");
    this.afficherListe();
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
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idOpcvm}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idOpcvm}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.idOpcvm}">Supprimer</a>
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

  afficherListe() {
    const self = this;
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const sb = this.opcvmService.listeOpcvm(dataTablesParameters)
          .subscribe(resp => {
            callback(resp.data);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'ID', data: 'idOpcvm', render: function (data, type, row) {
            return row.idOpcvm;
          },
        },
        {
          title: 'Sigle', data: 'sigleOpcvm', render: function (data, type, row) {
            return row.sigleOpcvm;
          },
        },
        {
          title: 'Dénomination', data: 'denominationOpcvm', render: function (data, type, row) {
            return row.denominationOpcvm || '';
          },
        },
        {
          title: 'VL', data: 'valeurLiquidativeActuelle', render: function (data, type, row) {
            // const vl = String(row.valeurLiquidativeActuelle).toString();
            return row.valeurLiquidativeActuelle.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
            // return vl;
          },
        },
        {
          title: 'Date prochaine VL', data: 'dateProchainCalculVL', render: function (data, type, row) {
            return moment(data).format('DD/MM/YYYY') || '-';
          },
        },
        /*{
          data: null, render: function(data, type, row){
            return `<button class="btn btn-info btn-sm deleteBtn">Me Connecter</button>`;
          }
        }*/
      ],
      createdRow: function (row, data, dataIndex) {
        // $(row).find('.btn').on('click', btncallback("Merde !!"));
        // $(row).find('.btn').on('click', () => self.selectOpcvm(data));
      },
    };
    this.dtOptions = {
      ...this.dtOptions,
      ...this.datatableConfig
    }
  }

  supprimer(id: string) {
    const modalRef = this.modalService.open(DeleteOpcvmModalComponent);
    modalRef.componentInstance.id = id;
    //modalRef.result.then(() => this.entityService.fetch(), () => {});
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
