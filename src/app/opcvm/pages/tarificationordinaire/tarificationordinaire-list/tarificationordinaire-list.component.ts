import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Subscription, switchMap, tap} from "rxjs";
import {Config} from "datatables.net";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../core/modules/auth";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TarificationordinaireService} from "../../../services/tarificationordinaire.service";
import {
  DeleteTarificationordinaireModalComponent
} from "../delete-tarificationordinaire-modal/delete-tarificationordinaire-modal.component";
import {filter, map} from "rxjs/operators";
import {Action} from "../../../../core/modules/entity-crud/entity-crud.component";

@Component({
  selector: 'app-tarificationordinaire-list',
  templateUrl: './tarificationordinaire-list.component.html',
  styleUrl: './tarificationordinaire-list.component.scss'
})
export class TarificationordinaireListComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  newButtonTitle:string;
  qualite:string;
  datatableConfig: Config = {};
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  actions: Action[];
  swalOptions: SweetAlertOptions = {};

  private clickListener: () => void;
  private idInAction: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    public entityService: TarificationordinaireService,
    public authService: AuthService,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    // console.log("currentOpcvm=",this.authService.LocalStorageManager.getValue("currentOpcvm"))
    // console.log("idOpcvm=",this.authService.LocalStorageManager.getValue("currentOpcvm")?.idOpcvm)
    this.actions = [
      {
        name: 'Afficher',
        path: `/opcvm/standard/tarification/${this.qualite}/show/:id`,
        parameters: [{key: 'id', value: null}]
      },
      {
        name: 'Modifier',
        path: `/opcvm/standard/tarification/${this.qualite}/edit/:id`,
        parameters: [{key: 'id', value: null}]
      },
    ];
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const sb = this.route.paramMap
          .pipe(
            filter(paramMap => paramMap.has('qualite')),
            map(paramMap => paramMap.get('qualite')!),
            tap((qualite) => {
              const voyelles = ['a', 'e', 'y', 'u', 'i', 'o'];
              this.qualite = qualite;
              console.log("this.qualite",this.qualite)
              this.newButtonTitle = this.qualite ? ((voyelles.includes(this.qualite[0]) ? 'Nouvel ' : 'Nouveau ') + `${this.qualite}`) : this.newButtonTitle;
            }),
            switchMap((qualite) => this.entityService.datatable_TarificationOPC(dataTablesParameters,this.authService.LocalStorageManager.getValue("currentOpcvm")?.idOpcvm,qualite))
          ).subscribe(resp => {
             console.log("DataTable Param = ", resp.data);
            callback(resp.data);
          });
        this.subscriptions.push(sb);
      },
      columns: this.getColumns(),
      createdRow: function (row, data, dataIndex) {
        // $('td:eq(0)', row).addClass('d-flex align-items-center');
      },
    };
  }
  getColumns(){
    let columns: any[];
    let lib="";
    const sb = this.route.paramMap
      .pipe(
        filter(paramMap => paramMap.has('qualite')),
        map(paramMap => paramMap.get('qualite')!),
        tap((mQualite) => {
          lib = mQualite;
         // console.log("bouton",this.newButtonTitle)

          /*switch (lib) {
            case 'sgi':
              columns = [
                {
                  title: 'SGI', data: 'denomination', render: function (data:any, type:any, full:any) {
                    return full.registraire.denomination || '';
                  }
                },
                {
                  title: 'Classe', data: 'libelleClasseTitre', render: function (data:any, type:any, full:any) {
                    return full.classeTitre.libelleClasseTitre || '';
                  }
                },
                {
                  title: 'Role', data: 'codeRole', render: function (data: any, type: any, row: any) {
                    const roleName = row.codeRole;
                    return roleName || '';
                  }
                },
                {
                  title: 'Borne inférieur', data: 'borneInferieur', render: function (data: any, type: any, row: any) {

                    return row.borneInferieur;
                  }
                },
                {
                  title: 'Borne supérieur', data: 'borneSuperieur', render: function (data:any, type:any, full:any) {

                    return full.borneSuperieur;
                  }
                },
                {
                  title: 'Taux', data: 'taux', render: function (data:any, type:any, full:any) {

                    return full.taux;
                  }
                },
                {
                  title: 'Forfait', data: 'forfait', render: function (data:any, type:any, full:any) {

                    return full.forfait;
                  }
                },
              ];
              break;
            case 'depositaire':
              console.log("passez")
              columns = [
                {
                  title: 'Dépositaire', data: 'denomination', render: function (data:any, type:any, full:any) {
                    return full.depositaire.denomination || '';
                  }
                },
                {
                  title: 'Classe', data: 'libelleClasseTitre', render: function (data:any, type:any, full:any) {
                    return full.classeTitre.libelleClasseTitre || '';
                  }
                },
                {
                  title: 'Role', data: 'codeRole', render: function (data: any, type: any, row: any) {
                    const roleName = row.codeRole;
                    return roleName || '';
                  }
                },
                {
                  title: 'Borne inférieur', data: 'borneInferieur', render: function (data: any, type: any, row: any) {

                    return row.borneInferieur;
                  }
                },
                {
                  title: 'Borne supérieur', data: 'borneSuperieur', render: function (data:any, type:any, full:any) {

                    return full.borneSuperieur;
                  }
                },
                {
                  title: 'Taux', data: 'taux', render: function (data:any, type:any, full:any) {

                    return full.taux;
                  }
                },
                {
                  title: 'Forfait', data: 'forfait', render: function (data:any, type:any, full:any) {

                    return full.forfait;
                  }
                },
              ];
              break;
            default:
              columns = [
                {
                  title: 'Place', data: 'libellePlace', render: function (data:any, type:any, full:any) {
                    return full.place.libellePlace || '';
                  }
                },
                {
                  title: 'Classe', data: 'libelleClasseTitre', render: function (data:any, type:any, full:any) {
                    return full.classeTitre.libelleClasseTitre || '';
                  }
                },
                {
                  title: 'Role', data: 'codeRole', render: function (data: any, type: any, row: any) {
                    const roleName = row.codeRole;
                    return roleName || '';
                  }
                },
                {
                  title: 'Borne inférieur', data: 'borneInferieur', render: function (data: any, type: any, row: any) {

                    return row.borneInferieur;
                  }
                },
                {
                  title: 'Borne supérieur', data: 'borneSuperieur', render: function (data:any, type:any, full:any) {

                    return full.borneSuperieur;
                  }
                },
                {
                  title: 'Taux', data: 'taux', render: function (data:any, type:any, full:any) {

                    return full.taux;
                  }
                },
                {
                  title: 'Forfait', data: 'forfait', render: function (data:any, type:any, full:any) {

                    return full.forfait;
                  }
                },
              ];
              break;
          }*/

        })
      ).subscribe(resp => {

      });
    this.subscriptions.push(sb);
    console.log("lib",lib)
    let titre=""
    if(lib==='sgi')
      titre="SGI";
    else
      if(lib==='depositaire')
        titre="Dépositaire"
    else
      titre="place"
    columns = [
      {
        title: 'Dénominaton', data: 'denomination', render: function (data:any, type:any, full:any) {
          if(lib==='sgi')
            return full.personne?.denomination || '';
          else if(lib==='depositaire')
            return full.personne?.denomination || '';
          else
            return full.place?.libellePlace;
        }
      },
      {
        title: 'Classe', data: 'libelleClasseTitre', render: function (data:any, type:any, full:any) {
          return full.classeTitre?.libelleClasseTitre || '';
        }
      },
      {
        title: 'Role', data: 'codeRole', render: function (data: any, type: any, row: any) {
          const roleName = row.codeRole;
          return roleName || '';
        }
      },
      {
        title: 'Borne inférieur', data: 'borneInferieur', render: function (data: any, type: any, row: any) {

          return row.borneInferieur;
        }
      },
      {
        title: 'Borne supérieur', data: 'borneSuperieur', render: function (data:any, type:any, full:any) {

          return full.borneSuperieur;
        }
      },
      {
        title: 'Taux', data: 'taux', render: function (data:any, type:any, full:any) {

          return full.taux;
        }
      },
      {
        title: 'Forfait', data: 'forfait', render: function (data:any, type:any, full:any) {

          return full.forfait;
        }
      },
    ];
    return columns;

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
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idTarificationOrdinaire}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.idTarificationOrdinaire}">Supprimer</a>
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
    const modalRef = this.modalService.open(DeleteTarificationordinaireModalComponent);
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
