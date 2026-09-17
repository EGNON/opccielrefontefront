import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {fromEvent, Subscription, switchMap, tap} from "rxjs";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  DeleteCriterealerteModalComponent
} from "../../criterealerte/delete-criterealerte-modal/delete-criterealerte-modal.component";
import {debounceTime, distinctUntilChanged, filter, finalize, map} from "rxjs/operators";
import {CryptageService} from "../../../services/cryptage.service";
import {TransactionService} from "../../../services/transaction.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import DataTables, {Config} from "datatables.net";
import moment from 'moment';
import { DataTableDirective } from 'angular-datatables';
import { CritereAlerteService } from '../../../services/criterealerte.service';


@Component({
    selector: 'app-transaction-list',
    templateUrl: './transaction-list.component.html',
    styleUrl: './transaction-list.component.scss',
    standalone: false
})
export class TransactionListComponent implements OnInit, OnDestroy, AfterViewInit{
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  datatableConfig: Config = {};
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  critere:string;
  swalOptions: SweetAlertOptions = {};
private currentSearch?: Subscription;
  private clickListener: () => void;
  private idInAction: number;
  change:boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    public entityService: TransactionService,
    public critereAlerteService: CritereAlerteService,
    public pageInfo:PageInfoService,
    public cryptageService: CryptageService,
    private modalService: NgbModal) {
    // router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((val) => {
    //   // see also
    //   console.log("val==",val)
    // // if(this.change)
    // //   this.afficherTransaction();
    // });
  }

  ngOnInit(): void {
   
    // window.location.reload()
  this.initDatatable();

  this.route.queryParams
    .pipe(filter(params => params.critere))
    .subscribe(params => {

      this.critere = params.critere;

      console.log("Critère =", this.critere);

      this.critereAlerteService.getById(Number(this.critere)).subscribe(
      (data)=> {
         this.pageInfo.updateTitle("Résultats de l'alerte("+data.data.description+")")
      }
    )
      this.reloadEvent.emit(true);

    });
    
  }
  initDatatable() {

  this.datatableConfig = {

    serverSide: true,
    // processing: true,
    // searchDelay: 500,
    ajax: (dataTablesParameters, callback) => {

      console.log("Critère envoyé :", this.critere);

      if (this.currentSearch) {
      this.currentSearch.unsubscribe();
    }

    this.currentSearch =this.entityService
          .datatable_Transaction(dataTablesParameters, this.critere)
           .subscribe({
        next: (resp) => {
          callback(resp.data);
        }
      });

    },

     columns: [
                {
                  title: 'Date opération', data: 'dateOperation', render: function (data, type, row) {
                    return moment(row.dateOperation).format('DD/MM/YYYY');
                  }
                },
                {
                  title: 'Dénomination', data: 'denomination', render: function (data, type, row) {
                    return row.denomination;
                  }
                }
                ,{
                title: 'Type FCP', data: 'denominationOpcvm', render: function (data, type, row) {
                  return row.denominationOpcvm;
                }
              }
                ,{
                title: 'Nature opération', data: 'libelleNatureOperation', render: function (data, type, row) {
                  return row.libelleNatureOperation;
                }
              },
                {
                  title: 'Montant', data: 'montant', render: function (data, type, row) {
                    return new Intl.NumberFormat('fr-FR').format(row.montant);
                  }
                },
                {
                  title: 'Qté part', data: 'qtePart', render: function (data, type, row) {
                    return row.qtePart;
                  }
                },
                {
                  title: 'Pays de résidence', data: 'nomPays', render: function (data, type, row) {
                    return row.nomPays;
                  }
                }
              ],

  };

}
  afficherTransaction()
  {
    // popular
    this.change=false

    this.route.queryParams.pipe(
      filter(params => params.critere))
      .subscribe(params => {
        console.log(params); // { order: "popular" }

        this.critere = params.critere;

        this.reloadEvent.emit(true);

        console.log("ettoi===", this.critere); // popular
      })
          this.datatableConfig = {
            serverSide: true,
            ajax: (dataTablesParameters: any, callback) => {
              console.log("PARAMS === ", dataTablesParameters);
              const sb= this.entityService.datatable_Transaction(dataTablesParameters,this.critere)
                
                .subscribe(resp => {
                  callback(resp.data);
                  console.log("critere=",resp)
                });

             
              this.subscriptions.push(sb);
            },
            columns: [
                {
                  title: 'Date opération', data: 'dateOperation', render: function (data, type, row) {
                    return moment(row.dateOperation).format('DD/MM/YYYY');
                  }
                },
                {
                  title: 'Dénomination', data: 'denomination', render: function (data, type, row) {
                    return row.denomination;
                  }
                }
                ,{
                title: 'Type FCP', data: 'denominationOpcvm', render: function (data, type, row) {
                  return row.denominationOpcvm;
                }
              }
                ,{
                title: 'Nature opération', data: 'libelleNatureOperation', render: function (data, type, row) {
                  return row.libelleNatureOperation;
                }
              },
                {
                  title: 'Montant', data: 'montant', render: function (data, type, row) {
                    return new Intl.NumberFormat('fr-FR').format(row.montant);
                  }
                },
                {
                  title: 'Qté part', data: 'qtePart', render: function (data, type, row) {
                    return row.qtePart;
                  }
                },
                {
                  title: 'Pays de résidence', data: 'nomPays', render: function (data, type, row) {
                    return row.nomPays;
                  }
                }
              ],
            createdRow: function (row, data, dataIndex) {
              // $('td:eq(0)', row).addClass('d-flex align-items-center');
            },
          };

    this.change=true
    return this.datatableConfig;
  }
  decode(content: string){
    return decodeURIComponent(content);
  }
  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  renderActionColumn(): void {
    const actionColumn = {
      sortable: false,
      title: 'Actions',
      class:'text-end min-w-70px',
      render: (data: any, type: any, full: any) => {
        const parentDivStart = `<div class="text-end min-w-70px">`;
        const viewButton = `
            <button class="btn btn-sm btn-info me-3" data-action="view" data-id="${full.idCritereAlerte}">
                 Afficher
            </button>
        `;

        const editButton = `
            <button class="btn btn-sm btn-primary me-3" data-action="edit" data-id="${full.idCritereAlerte}">
              Modifier
            </button>
        `;

        const deleteButton = `
            <button class="btn btn-sm btn-danger" data-action="delete" data-id="${full.idCritereAlerte}">
              Supprimer
            </button>
        `;

        const parentDivEnd = `</div>`;

        const buttons = [];
        buttons.push(parentDivStart);
        // buttons.push(viewButton);
        buttons.push(editButton);
        buttons.push(deleteButton);
        buttons.push(parentDivEnd);

        return buttons.join('');
      },
    };

    if (this.datatableConfig.columns) {
      this.datatableConfig.columns.push(actionColumn);
    }
  }

  supprimer(id: number) {
    const modalRef = this.modalService.open(DeleteCriterealerteModalComponent);
    modalRef.componentInstance.id = id;
    // modalRef.result.then(() => this.entityService.fetch(), () => {});
  }

  ngAfterViewInit(): void {
    // this.dtElement.dtInstance.then((dtInstance: any) => {

    //   const input = $('.dataTables_filter input')[0];

    //   if (!input) {
    //     return;
    //   }

    //   fromEvent(input, 'keyup')
    //     .pipe(
    //       map((event: any) => event.target.value),
    //       debounceTime(5000),
    //       distinctUntilChanged()
    //     )
    //     .subscribe(value => {
    //       dtInstance.search(value).draw();
    //     });

    // });
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn');
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

