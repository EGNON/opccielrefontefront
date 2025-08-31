import {
  AfterViewInit,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalOptions, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {DataTableDirective} from 'angular-datatables';
import {fromEvent, Subject} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {SweetAlertOptions} from 'sweetalert2';
declare var $: any;
import {Config} from "datatables.net";

export interface Action {
  name: string;
  path: string;
  parameters: Array<{key: any, value: any}>;
}

@Component({
    selector: 'app-entity-crud',
    templateUrl: './entity-crud.component.html',
    styleUrls: ['./entity-crud.component.scss'],
    standalone: false
})
export class EntityCrudComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() datatableConfig: Config = {};
  @Input() changeTable: EventEmitter<boolean>;
  dtTrigger: Subject<any> = new Subject();

  @Input() route: string = '/';

  // Reload emitter inside datatable
  @Input() reload: EventEmitter<boolean>;

  @Input() modal: TemplateRef<any>;

  @Output() viewEvent = new EventEmitter<number>();
  @Output() deleteEvent = new EventEmitter<number>();
  @Output() editEvent = new EventEmitter<number>();
  @Output() createEvent = new EventEmitter<boolean>();

  dtOptions: any = {};

  @ViewChild(DataTableDirective, {static: false})
  private datatableElement: DataTableDirective;

  @Output() @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  @Output() @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  private idInAction: number;

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  swalOptions: SweetAlertOptions = {buttonsStyling: false};

  private modalRef: NgbModalRef;

  private clickListener: () => void;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.dtOptions = {
      dom: "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      // dom: 'Bfrtip',
      // buttons: [
      //   // { extend: 'copy', text: 'Copier dans le presse-papiers' },
      //   { extend: 'print', text: 'Imprimer' },
      //   { extend: 'csv', text: 'Exporter en CSV' },
      //   { extend: 'excel', text: 'Exporter en Excel' },
      //   { extend: 'pdf', text: 'Exporter en Pdf' }
      // ],
      pagingType: 'simple_numbers',
      buttons: [
        {
          extend:    'copy',
          text:      '<i class="fa fa-files-o"></i> Copier',
          titleAttr: 'Copy',
          className: 'btn btn-default btn-sm'
        },
        {
          extend:    'csv',
          text:      '<i class="fa fa-files-o"></i> Exporter en CSV',
          titleAttr: 'CSV',
          className: 'btn btn-default btn-sm',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'excel',
          text:      '<i class="fa fa-files-o"></i> Exportez en Excel',
          titleAttr: 'Excel',
          className: 'btn btn-default btn-sm',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'pdf',
          text:      '<i class="fa fa-file-pdf"></i> PDF',
          titleAttr: 'PDF',
          className: 'btn btn-default btn-sm',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'print',
          text:      '<i class="fa fa-print"></i> Imprimer',
          titleAttr: 'Print',
          className: 'btn btn-default btn-sm',
          /*autoPrint: false,*/
          exportOptions: {
            columns: ':visible',
            "modifier": {
              "page": 'all'
            }
          }
        },
      ],
      serverSide: true,
      processing: true,
      language: {
        processing: '<span class="spinner-border spinner-border-sm align-middle"></span> Chargement...',
        search: "Rechercher&nbsp;:",
        lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
        info: "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
        infoEmpty: "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
        infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
        infoPostFix: "",
        loadingRecords: "Chargement en cours...",
        zeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
        emptyTable: "Aucune donnée disponible dans le tableau",
        paginate: {
          first: "Premier",
          previous: "Pr&eacute;c&eacute;dent",
          next: "Suivant",
          last: "Dernier"
        },
        aria: {
          sortAscending: ": activer pour trier la colonne par ordre croissant",
          sortDescending: ": activer pour trier la colonne par ordre décroissant"
        }
      },
      ...this.datatableConfig
    };
    this.renderActionColumn();
    this.setupSweetAlert();

    if(this.changeTable) {
      this.changeTable.subscribe(data => {
        console.log("On y est !!!");
        this.datatableElement.dtInstance.then(dtInstance => {
          dtInstance.ajax.reload();
        });
      });
    }

    /*if (this.reload) {
      this.reload.subscribe(data => {
        this.modalService.dismissAll();
        this.datatableElement.dtInstance.then(dtInstance => {
          dtInstance.ajax.reload();
        });
      });
    }*/
  }

  renderActionColumn(): void {
    const actionColumn = {
      sortable: false,
      title: 'Actions',
      class:'text-end min-w-70px',
      render: (data: any, type: any, full: any) => {
        const actions = `
            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                Action
              </button>
              <ul class="dropdown-menu"></ul>
            </div>
        `;

        const buttons = [];
        buttons.push(actions);

        return buttons.join('');
      },
    };

    if (this.dtOptions.columns) {
      let actions = this.dtOptions.columns[this.dtOptions.columns?.length-1];
      if(!(actions != null && actions?.title?.toLowerCase() === "actions"))
        this.dtOptions.columns.push(actionColumn);
    }
  }

  ngAfterViewInit(): void {
    // console.log("Lol = ", this.el.nativeElement.getElementsByTagName("*"));
    /*this.clickListener = this.renderer.listen(document, 'click', (event) => {
      //alert("Lol !!!");
      // console.log("RENDERER === ", this.renderer);
      const closestBtn = event.target.closest('.btn') as HTMLElement;
      if (closestBtn) {
        // closestBtn.target.classList.addClass('show');
        // closestBtn.target.classList.addClass('menu-dropdown');
        // console.log("Parent = ", closestBtn.nextSibling);
        const { action, id } = closestBtn.dataset;
        // this.idInAction = id;
        // switch (action) {
        //   case 'view':
        //     this.router.navigate([`${this.route}/${id}`]);
        //     break;
        //
        //   case 'create':
        //     this.createEvent.emit(true);
        //     this.router.navigate(['new'], {relativeTo: this._route});
        //     // this.modalRef = this.modalService.open(this.modal, this.modalConfig);
        //     break;
        //
        //   case 'edit':
        //     this.editEvent.emit(this.idInAction);
        //     this.router.navigate(['edit', `${id}`], {relativeTo: this._route});
        //     // this.modalRef = this.modalService.open(this.modal, this.modalConfig);
        //     break;
        //
        //   case 'delete':
        //     this.deleteSwal.fire().then((clicked) => {
        //       if (clicked.isConfirmed) {
        //         this.successSwal.fire();
        //       }
        //     });
        //     break;
        // }
      }
    });*/

    /*var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
    var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
      return new bootstrap.Dropdown(dropdownToggleEl)
    })*/
    this.triggerFilter();
    this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.reload.unsubscribe();
    if (this.clickListener) {
      this.clickListener();
    }
    this.modalService.dismissAll();
  }

  triggerDelete() {
    this.deleteEvent.emit(this.idInAction);
  }

  triggerFilter() {
    fromEvent<KeyboardEvent>(document, 'keyup')
      .pipe(
        //debounceTime(50),
        map(event => {
          const target = event.target as HTMLElement;
          const action = target.getAttribute('data-action');
          const value = (target as HTMLInputElement).value?.trim().toLowerCase();

          return {action, value};
        })
      )
      .subscribe(({action, value}) => {
        if (action === 'filter') {
          // console.log("RECHERCHE === ", value);
          this.datatableElement.dtInstance.then(dtInstance => dtInstance.search(value).draw());
        }
      });
  }

  setupSweetAlert() {
    this.swalOptions = {
      buttonsStyling: false,
    };
  }
}
