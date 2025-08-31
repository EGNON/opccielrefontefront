import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Subscription, switchMap, tap} from "rxjs";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  DeleteCriterealerteModalComponent
} from "../../criterealerte/delete-criterealerte-modal/delete-criterealerte-modal.component";
import {filter, finalize, map} from "rxjs/operators";
import {CryptageService} from "../../../services/cryptage.service";
import {TransactionService} from "../../../services/transaction.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {Config} from "datatables.net";


@Component({
    selector: 'app-transaction-list',
    templateUrl: './transaction-list.component.html',
    styleUrl: './transaction-list.component.scss',
    standalone: false
})
export class TransactionListComponent implements OnInit, OnDestroy, AfterViewInit{
  isLoading: boolean;
  private subscriptions: Subscription[] = [];

  datatableConfig: Config = {};
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  critere:string;
  swalOptions: SweetAlertOptions = {};

  private clickListener: () => void;
  private idInAction: number;
  change:boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    public entityService: TransactionService,
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
    this.pageInfo.updateTitle("Résultats de l'alerte")
    // window.location.reload()

  }
  afficherTransaction()
  {
    // popular
    this.change=false
    // let columns: any[];
    // columns=[
    //   {
    //     title: 'Dénomination', data: 'denomination', render: function (data, type, row) {
    //       return row.denomination;
    //     }
    //   }
    //   ,{
    //   title: 'Type FCP', data: 'denominationOpcvm', render: function (data, type, row) {
    //     return row.denominationOpcvm;
    //   }
    // },
    //   {
    //     title: 'Montant', data: 'montant', render: function (data, type, row) {
    //       return new Intl.NumberFormat('fr-FR').format(row.montant);
    //     }
    //   },
    //   {
    //     title: 'Qté part', data: 'qtePart', render: function (data, type, row) {
    //       return row.qtePart;
    //     }
    //   },
    //   {
    //     title: 'Pays de résidence', data: 'nomPays', render: function (data, type, row) {
    //       return row.nomPays;
    //     }
    //   }
    // ]
    //
    // this.route.queryParams.pipe(
    //   filter(params => params.critere))
    //   .subscribe(params => {
    //     console.log(params); // { order: "popular" }
    //
    //     this.critere = params.critere;
    //     console.log("ettoi===", this.critere);
    //   })
    // console.log(this.critere)
    // // this.critere=this.route.snapshot.paramMap.get('critere');
    //     let config = {
    //       serverSide: true,
    //       ajax: (dataTablesParameters: any, callback: any) => {
    //         const sb= this.entityService.datatable_Transaction(dataTablesParameters,this.critere)
    //           .subscribe(resp => {
    //             callback(resp.data);
    //             console.log("data==",resp.data)
    //           });
    //         this.subscriptions.push(sb);
    //       },
    //       columns: columns,
    //       createdRow: function (row: any, data: any, dataIndex: any) {
    //         //console.log($(row));
    //         // $(row).find('input[type=checkbox]').on('click', () => {});
    //       },
    //     };
    //     this.datatableConfig = config;
    //     this.change=true
    //
    //     return config;



    this.route.queryParams.pipe(
      filter(params => params.critere))
      .subscribe(params => {
        console.log(params); // { order: "popular" }

        this.critere = params.critere;
        console.log("ettoi===", this.critere); // popular
      })
          this.datatableConfig = {
            serverSide: true,
            ajax: (dataTablesParameters: any, callback) => {
              console.log("PARAMS === ", dataTablesParameters);

              // @ts-ignore
              // this.critere = "U2FsdGVkX19hOdv1GAmnr/V3MT+HJ7td+eoNG2U8ptiPirOHxKFM1etOs+0Dm8DpI5vzTpZyAKB3XZgSbGVENw=="
              // this.critere = this.decode(this.critere.replaceAll(' ','+'))
              // console.log("decrypt=",this.critere)
              // let dCritere=this.cryptageService.decryptData(this.critere)
              // console.log("critere=",dCritere)
              // // @ts-ignore
              // this.critere=dCritere
              const sb= this.entityService.datatable_Transaction(dataTablesParameters,this.critere)
                // .pipe(
                //   finalize(() => {
                //     let currentUrl = this.router.url;
                //     this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
                //     this.router.navigate([`/${currentUrl}`]).then(()=>{
                //       console.log(`After navigation I am on:${this.router.url}`)
                //     })
                //   })
                //   //   location.href="/#"+this.router.url;
                //   })
                // )
                .subscribe(resp => {
                  callback(resp.data);
                  console.log("critere=",resp)
                });

              // .subscribe(
              //   {
              //     next: (resp) => {
              //       callback(resp.data);
              //       let currentUrl = this.router.url;
              //       console.log(currentUrl)
              //       this.router.navigateByUrl('/', {skipLocationChange: false}).then(() => {
              //         this.router.navigate([currentUrl]);
              //       });
              //     },
              //     error: err => {
              //     }
              //   }
              // )
              this.subscriptions.push(sb);
            },
            columns: [
                {
                  title: 'Dénomination', data: 'denomination', render: function (data, type, row) {
                    return row.denomination;
                  }
                }
                ,{
                title: 'Type FCP', data: 'denominationOpcvm', render: function (data, type, row) {
                  return row.denominationOpcvm;
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

