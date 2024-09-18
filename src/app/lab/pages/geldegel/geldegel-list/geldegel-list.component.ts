import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Observable, of, Subscription} from "rxjs";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../core/modules/auth";
import {PersonneMoraleService} from "../../../../crm/services/personne/personne.morale.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  DeletePersonneMoraleJugeModalComponent
} from "../../personne-morale-juge/delete-personne-morale-juge-modal/delete-personne-morale-juge-modal.component";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {PersonnePhysiqueService} from "../../../../crm/services/personne/personne.physique.service";
import {GelDegelService} from "../../../services/geldegel.service";
import * as XLSX from "xlsx";
import {Personne} from "../../../../crm/models/personne/personne.model";
import {Config} from "datatables.net";

@Component({
  selector: 'app-geldegel-list',
  templateUrl: './geldegel-list.component.html',
  styleUrl: './geldegel-list.component.scss'
})
export class GeldegelListComponent implements OnInit, OnDestroy, AfterViewInit{
  isLoading: boolean;
  private subscriptions: Subscription[] = [];

  aEntity: Observable<any>;
  estGele:boolean;
  estNonGele:boolean;
  compteRendu: any;
  datatableConfig: Config = {};
  etat:any;
  id:any;
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  gelDegel:any;
  personne:any;
  personnes:Personne[];
  personnePhysique:any;
  personneMorale:any;
  swalOptions: SweetAlertOptions = {};
  buttonText:string;

  private clickListener: () => void;
  private idInAction: number;

  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private authService: AuthService,
    public gelDegelService: GelDegelService,
    public personneService: PersonneService,
    public entityService: PersonneService,
    public personnePhysiqueService: PersonnePhysiqueService,
    public personneMoraleService: PersonneMoraleService,
    private router: Router,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.estGele=true
    this.afficherGelDegel();
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  afficherPaysGafi()
  {
    // @ts-ignore
    let estGele=document.getElementById('estGele').value
    console.log(estGele)
    let valeur=false
    if(estGele==="oui")
      valeur=true;
    if(estGele==="")
    {
      this.gelDegelService.afficherCompteGeleNonGele().subscribe(
        (data) => {
          this.personnes = data
          const personneAafficher: Partial<Personne>[] = this.personnes.map(
            x => ({
              denomination: x.denomination,
              libelleFr: x.paysResidence?.libelleFr,
              estGele: x.estGele
            })
          )
          this.exportArrayToExcel(personneAafficher)
        }
      )
    }
    else {
      this.gelDegelService.afficherEtatCompte(valeur).subscribe(
        (data) => {
          this.personnes = data
          const personneAafficher: Partial<Personne>[] = this.personnes.map(
            x => ({
              denomination: x.denomination,
              libelleFr: x.paysResidence?.libelleFr,
              estGele: x.estGele
            })
          )
          this.exportArrayToExcel(personneAafficher)
        }
      )
    }
  }
  exportArrayToExcel(arr: any[]) {

    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(arr);
    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
    XLSX.writeFile(wb, `compte.xlsx`);
  }
  compteGeleChange(){
    // @ts-ignore
    this.estGele = document.getElementById("compteGele").checked;
    if(this.estGele)
    {
      this.estNonGele=false;
    }
    this.afficherGelDegel();
  }
  compteNonGeleChange(){
    // console.log("ok")
    // @ts-ignore
    this.estNonGele = document.getElementById("compteNonGele").checked;
    // console.log(this.personneExiste)
    if(this.estNonGele)
    {
      this.estGele=false;
    }
    this.afficherGelDegel();
  }
  afficherGelDegel(){
    // console.log(this.estGele)
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {

        // if(this.estGele){
          const sb = this.personneService.afficherCompteGeleNonGele(dataTablesParameters)
            .subscribe(resp => {
              callback(resp);
            });
          this.subscriptions.push(sb);
        // }
        // else
        // {
        //   console.log("pass")
        //   const sb = this.personneService.afficherCompteNonGele(dataTablesParameters)
        //     .subscribe(resp => {
        //       callback(resp);
        //       console.log("Personne=",resp)
        //     });
        //   this.subscriptions.push(sb);
        // }
      },
      columns: [
        {
          title: 'DENOMINATION', data: 'denomination', render: function (data, type, row) {
            return row.denomination || '';
          },
          orderData: [1],
          orderSequence: ['asc', 'desc'],
          type: 'string',
        },
        {
          title: 'PAYS DE RESIDENCE', data: 'paysResidence', render: function (data, type, row) {
            return row.paysResidence?.libelleFr || '';
          },
          orderData: [1],
          orderSequence: ['asc', 'desc'],
          type: 'string',
        },
        {
          title: 'est gelé', data: 'estGele', render: function (data, type, row) {
            // if(row.estGafi==false)
            return `<div class="badge ${row.estGele ? 'badge-danger' : 'badge-success'} fw-bold">${row.estGele ? 'OUI' : 'NON'}</div>`;
            // else
            //   return 'OUI';
          }
        }
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
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idPersonne}">Afficher</a>
                </li>`;
        const deGeler = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idPersonne}">Dégeler</a>
                </li>`;
        const geler = `
                <li>
                    <a type="button" class="dropdown-item" data-action="geler" data-id="${full.idPersonne}">Geler</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.idPersonne}">Supprimer</a>
                </li>`;
        const parentActionEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentActionStart);
        // actions.push(show);
        if(full.estGele){
          actions.push(deGeler);
          this.buttonText="Geler"
        }
        else
        {
          actions.push(geler);
          this.buttonText="Dégeler"
        }
        /*actions.push(separator);
        actions.push(delete1);*/
        actions.push(parentActionEnd);

        return actions.join('');
      }
    }
  }

  supprimer(id: number) {
    const modalRef = this.modalService.open(DeletePersonneMoraleJugeModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(() => this.gelDegelService.fetch(), () => {});
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

          case 'geler':
            this.saveEntity(id);
            // closestBtn.classList.addClass('d-none');
            break;
          case 'edit':
            this.updateEntity(id);
            // this.router.navigate(['edit', id], {relativeTo: this.route});
            break;

          case 'delete':
            this.supprimer(id);
            break;
        }
      }
    });
  }

  saveEntity(id:any) {
    let entity=null;

    const sb = this.entityService.getItemById(id)

      .subscribe((data)=>{
        this.personne=data;

        entity = {...this.id,
          personneDto:this.personne,
          estGele:true,
          dateFin:null
        };
        // return
        this.gelDegelService.createRow(entity)
          .subscribe();
        console.log(this.personne)
        if(this.personne.typePersonne=="PH"){
          this.personnePhysiqueService.getItemById(id)

            .subscribe((data)=>{
              this.personnePhysique=data;
              entity=null;
          entity = {...this.personnePhysique,
            id:this.personnePhysique.idPersonne,
            estGele:true
          };
          // return
          this.personnePhysiqueService.update(entity)
            .subscribe({
              next: (value) => {
                let currentUrl = this.router.url;
                this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                  this.router.navigate([currentUrl]);
                });
              },
              error: err => {

              }
            });
            });
        }
        else
        {
          this.personneMoraleService.getItemById(id)

            .subscribe((data)=>{
              this.personneMorale=data;
              entity=null;
              entity = {...this.personneMorale,
                id:this.personneMorale.idPersonne,
                estGele:true
              };
              // return
              this.personneMoraleService.update(entity)
                .subscribe({
                  next: (value) => {
                    let currentUrl = this.router.url;
                    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                      this.router.navigate([currentUrl]);
                    });
                  },
                  error: err => {

                  }
                });
            });
        }
        this.subscriptions.push(sb);
      });
  }

  updateEntity(id:any) {
    let entity=null;

    const sb = this.entityService.getItemById(id)

      .subscribe((data)=>{
        this.personne=data;

        entity = {...this.id,
          personneDto:this.personne,
          estGele:false,
          dateFin:null
        };
        console.log(entity)
        // return
        this.gelDegelService.updateGelDegel(entity,id)
          .subscribe();
        console.log("personne&&&=",this.personne.typePersonne)
        if(this.personne.typePersonne=="PH"){
          this.personnePhysiqueService.getItemById(id)

            .subscribe((data)=>{
              this.personnePhysique=data;
              entity=null;
              entity = {...this.personnePhysique,
                id:this.personnePhysique.idPersonne,
                estGele:false
              };
              console.log("personnePhysique=",entity)
              // return
              this.personnePhysiqueService.update(entity)
                .subscribe({
                  next: (value) => {
                    let currentUrl = this.router.url;
                    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                      this.router.navigate([currentUrl]);
                    });
                  },
                  error: err => {

                  }
                });
            });
        }
        else
        {
          this.personneMoraleService.getItemById(id)

            .subscribe((data)=>{
              this.personneMorale=data;
              entity=null;
              entity = {...this.personneMorale,
                id:this.personneMorale.idPersonne,
                estGele:false
              };
              console.log("personneMorale=",entity)
              // return
              this.personneMoraleService.update(entity)
                .subscribe({
                  next: (value) => {
                    let currentUrl = this.router.url;
                    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                      this.router.navigate([currentUrl]);
                    });
                  },
                  error: err => {

                  }
                });
            });
        }
        this.subscriptions.push(sb);
      });
  }
}


