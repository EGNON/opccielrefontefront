import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Config } from 'datatables.net';
import moment from 'moment';
import { Subscription, Observable } from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';
import { LibrairiesService } from '../../../../services/librairies.service';
import { AuthService } from '../../../modules/auth';
import { Deleteparametrejoursferiesmodal } from '../../parametrejoursferies/deleteparametrejoursferiesmodal/deleteparametrejoursferiesmodal';
import { Deletedefinitionarrondimodal } from '../deletedefinitionarrondimodal/deletedefinitionarrondimodal';

@Component({
  selector: 'app-definitionarrondi-list',
  standalone: false,
  templateUrl: './definitionarrondi-list.html',
  styleUrl: './definitionarrondi-list.scss'
})
export class DefinitionarrondiList implements OnInit, OnDestroy, AfterViewInit{
  isLoading: boolean;
  private subscriptions: Subscription[] = [];

  aEntity: Observable<any>;
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
    public service: LibrairiesService,
    private router: Router,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.afficherParametreJoursFeries();
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  afficherParametreJoursFeries(){
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const sb = this.service.afficherDefinitionArrondi(dataTablesParameters)
          .subscribe(resp => {
            callback(resp.data);
            // console.log(resp);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'Code', data: 'codeDefinitionArrondi', render: function (data, type, row) {
            return row.codeDefinitionArrondi;
          },
        },
        {
          title: 'Libelle', data: 'libelleDefinitionArrondi', render: function (data, type, row) {
            return row.libelleDefinitionArrondi;
          },
        },
        {
          title: 'Type', data: 'typeArrondi', render: function (data, type, row) {
            return row.typeArrondi;
          },
        },
        {
          title: 'Decimal', data: 'nbreDecimaux', render: function (data, type, row) {
            return row.nbreDecimaux;
          },
        },
        {
          title: '>', data: 'estParValSup', render: function (data, type, row) {
            return row.estParValSup===true?'OUI':'NON';
          },
        },
        {
          title: 'Defaut?', data: 'estParDefaut', render: function (data, type, row) {
            return row.estParDefaut===true?'OUI':'NON';
          },
        },
       
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
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.numLigne}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.numLigne}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.numLigne}">Supprimer</a>
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

  supprimer(id: number) {
    const modalRef = this.modalService.open(Deletedefinitionarrondimodal);
    modalRef.componentInstance.id = id;
    // modalRef.result.then(() => this.service.fetchRows(null), () => {});
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

          case 'delete':
            this.supprimer(id);
            break;
        }
      }
    });
  }
}