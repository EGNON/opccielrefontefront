import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DeleteQualiteModalComponent} from "../delete-qualite-modal/delete-qualite-modal.component";
import {ActivatedRoute, Router} from "@angular/router";
import {SweetAlertOptions} from "sweetalert2";
import * as $ from "jquery";
import {Qualite} from "../../../../crm/models/qualite.model";
import {QualiteService} from "../../../../crm/services/qualite.service";
import {KeeniconComponent} from "../../../../template/_metronic/shared/keenicon/keenicon.component";
import {Config} from "datatables.net";

@Component({
  selector: 'app-qualite-list',
  templateUrl: './qualite-list.component.html',
  styleUrls: ['./qualite-list.component.scss']
})
export class QualiteListComponent implements OnInit, OnDestroy, AfterViewInit{

  @ViewChild('actions') actions: ElementRef<HTMLInputElement>;
  el: ElementRef;

  isLoading: boolean;
  entities$: Observable<Qualite[]>;
  private subscriptions: Subscription[] = [];

  iconComponent!: any;

  datatableConfig: Config = {};
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  swalOptions: SweetAlertOptions = {};

  private clickListener: () => void;
  private idInAction: number;

  inputs: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    public entityService: QualiteService,
    private modalService: NgbModal) {
    this.el = elementRef;
  }

  ngOnInit(): void {
    this.iconComponent = KeeniconComponent;
    this.inputs = { name: 'dots-square', class: 'fs-1 text-gray300 me-n1' };
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const sb = this.entityService.afficherTous(dataTablesParameters)
          .subscribe(resp => {
            callback(resp);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'Libellé', data: 'libelleQualite', render: function (data, type, row) {
            return row.libelleQualite;
          },
        },
      ],
      createdRow: (row: any, data: any, dataIndex: any) =>  {
        // $('td:eq(0)', row).addClass('d-flex align-items-center');
        // $('td:last-child', row).addClass('actions');
        // $('td:last-child', row).addClass('text-end');
      }
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
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idQualite}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idQualite}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.idQualite}">Supprimer</a>
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
    const modalRef = this.modalService.open(DeleteQualiteModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(() => this.entityService.fetch(), () => {});
  }

  ngAfterViewInit(): void {
    this.renderActionColumn();
    // let elementRef = this.actions.elementRef;
    // console.log("Ref = ", this.el.nativeElement.getElementById('actions'));
    console.log("Renderer = ", this.renderer);
    // this.renderer.setStyle(this.input.nativeElement, 'background', '#d515a0');
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

    this.cdr.detectChanges();
  }
}
