/* eslint-disable @angular-eslint/component-class-suffix */
import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Config, Api } from 'datatables.net';
import saveAs from 'file-saver';
import { Subject, Subscription, catchError, of, finalize } from 'rxjs';
import { ExerciceService } from '../../../../opcvm/services/exercice.service';
import { LibrairiesService } from '../../../../services/librairies.service';
import { LocalService } from '../../../../services/local.service';
import { AuthService } from '../../../modules/auth';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-evolutionvl',
  standalone: false,
  templateUrl: './evolutionvl.html',
  styleUrl: './evolutionvl.scss'
})
export class Evolutionvl implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  form: FormGroup;

  currentOpcvm: any;
  currentSeance: any;
  currentUser: any;

  downloading = false;
  export = false;
  downloaded = false;
  submitting = false;
  submitted = false;

  //DataTable Config
  datatableConfig: Config = {};
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  private clickListener: () => void;
  private idInAction: number;

  isLoading: boolean = false;
  subscriptions: Subscription[] = [];
  allData:any;
  dateDebut:Date;
  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private localStore: LocalService,
    private libService: LibrairiesService,
    private router: Router,
    private route: ActivatedRoute,
    private exerciceService: ExerciceService,
    public renderer: Renderer2) {
    this.currentUser = this.authService.currentUserValue;
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
    // this.exerciceService.afficherExerciceCourant(this.currentOpcvm?.idOpcvm).subscribe(
    //   (data)=>{
    //     if(data.data.length==0)
    //       this.dateDebut=new Date(this.currentSeance?.dateFermeture);
    //     else
    //       this.dateDebut=new Date(data.data.dateDebut);
    //   }
    // )
  }

  ngAfterContentInit(): void {
  }



  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  ngOnInit(): void {

    const dateOuv = new Date(this.currentSeance?.dateOuverture);
    this.dateDebut=new Date();
    const dateFin = new Date();
    this.form = this.fb.group({
      mois1: [
        'Janvier', Validators.required
      ],
      mois2: [
        'Février', Validators.required
      ],
    });
    this.dtOptions = {
      // dom: 'Bfrtip',
      dom: "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      /*order: [0, 'desc'],*/
      pagingType: "simple_numbers",
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
      lengthChange: false,
      responsive: true,
      buttons: [
        {
          extend:    'copy',
          text:      '<i class="fa fa-files-o"></i> Copier',
          titleAttr: 'Copy',
          className: 'btn btn-default btn-sm d-none'
        },
        {
          extend:    'csv',
          text:      '<i class="fa fa-files-o"></i> CSV',
          titleAttr: 'CSV',
          className: 'btn btn-default btn-sm d-none',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'excel',
          text:      '<i class="fa fa-files-o"></i> Excel',
          titleAttr: 'Excel',
          className: 'btn btn-default btn-sm d-none',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'pdf',
          text:      '<i class="fa fa-file-pdf"></i> PDF',
          titleAttr: 'PDF',
          className: 'btn btn-default btn-sm d-none',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'print',
          text:      '<i class="fa fa-print"></i> Imprimer',
          titleAttr: 'Print',
          className: 'btn btn-default btn-sm d-none',
          /*autoPrint: false,*/
          exportOptions: {
            columns: ':visible',
            "modifier": {
              "page": 'all'
            }
          }
        },
      ],
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
    };
    this.actualiser();
  }

  afficherListe(prefix: string) {
    const self = this;
    let columns: any[] = [
      {
        title: 'DESIGNATION', data: 'denominationOpcvm', render: function (data, type, row) {
          return row.denominationOpcvm
        },
      },
      {
        title: 'VL.ORIGINE', data: 'vlOrigine', render: function (data, type, row) {
          return row.vlOrigine
        },
      },
      {
        title: 'VL.MOIS1', data: 'vlmois1', render: function (data, type, row) {
          return row.vlmois1;
        },
      },
      {
        title: 'VL.MOIS2', data: 'vlmois2', render: function (data, type, row) {
          return row.vlmois2;
        },
      },
      {
        title: 'RENDEMENT MOIS (%)', data: 'rendementMois', render: function (data, type, row) {
          return row.rendementMois;
        },
      },
      {
        title: 'RENDEMENT A L\'ORIGINE (%)', data: 'rendementOrigine', render: function (data, type, row) {
          return row.rendementOrigine;
        },
      },
      // {
      //   title: 'Actions', data: '', render: function (data, type, row) {
      //     // return row.prenomRaison;
      //   },
      // },

    ];
    this.datatableConfig = {
      processing: true,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        let idOpcvm = this.currentOpcvm?.idOpcvm;
        let param = {
          idOpcvm: idOpcvm,
          ...this.form.value,
          datatableParameters: dataTablesParameters
        };
        if (prefix.toLowerCase() === "l") {
          param = {
            ...param,
            /* dateDebut: new Date(param.startDate.year, param.startDate.month-1, param.startDate.day+1),
            dateFin: new Date(param.endDate.year, param.endDate.month-1, param.endDate.day+1), */
          };
          console.log(param);
          const sb = this.libService.evolutionVL(param)
            .subscribe(resp => {
              console.log("Retour releve === ", resp.data);
              callback(resp.data);
            });
          this.subscriptions.push(sb);
        }
        else {
          callback({
            draw: dataTablesParameters.draw,
            recordsTotal: 1,
            recordsFiltered: 1,
            data: []
          });
        }
      },
      columns: columns,
      createdRow: function (row, data: any, dataIndex) {},
    };
    this.dtOptions = {
      ...this.dtOptions,
      ...this.datatableConfig,
    };
    this.rerender();
  }

  rerender(): void {
    try {
      this.datatableElement.dtInstance.then((dtInstance: Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(null);
      });
    } catch (err) {
      // console.log(err);
    }
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
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idActionnaire}">Afficher</a>
                </li>`;
        // const edit = `
        //         <li>
        //             <a type="button" class="dropdown-item" data-action="edit" data-id="${full.codeFormeJuridique}">Modifier</a>
        //         </li>`;
        // const separator = `<li><hr class="dropdown-divider"></li>`;
        // const delete1 = `<li>
        //             <a type="button" class="dropdown-item" data-action="delete" data-id="${full.codeFormeJuridique}">Supprimer</a>
        //         </li>`;
        const parentActionEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentActionStart);
        actions.push(show);
        // actions.push(edit);
        // actions.push(separator);
        // actions.push(delete1);
        actions.push(parentActionEnd);

        return actions.join('');
      }
    }
  }
  exportExcel() {
    this.export=true
    // 1️⃣ Définir les entêtes
let columns: any[] = [
      {
        title: 'DESIGNATION', data: 'denominationOpcvm', render: function (data, type, row) {
          return row.denominationOpcvm
        },
      },
      {
        title: 'VL.ORIGINE', data: 'vlOrigine', render: function (data, type, row) {
          return row.vlOrigine
        },
      },
      {
        title: 'VL.MOIS1', data: 'vlmois1', render: function (data, type, row) {
          return row.vlmois1;
        },
      },
      {
        title: 'VL.MOIS2', data: 'vlmois2', render: function (data, type, row) {
          return row.vlmois2;
        },
      },
      {
        title: 'RENDEMENT MOIS (%)', data: 'rendementMois', render: function (data, type, row) {
          return row.rendementMois;
        },
      },
      {
        title: 'RENDEMENT A L\'ORIGINE (%)', data: 'rendementOrigine', render: function (data, type, row) {
          return row.rendementOrigine;
        },
      },
      // {
      //   title: 'Actions', data: '', render: function (data, type, row) {
      //     // return row.prenomRaison;
      //   },
      // },

    ];
    const headers = ['DESIGNATION','VL.ORIGINE','VL.MOIS1','VL.MOIS2',
      'RENDEMENT MOIS (%)','RENDEMENT A L\'ORIGINE (%)'];
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      /* dateDebut: new Date(param.startDate.year, param.startDate.month - 1, param.startDate.day + 1),
      dateFin: new Date(param.endDate.year, param.endDate.month - 1, param.endDate.day + 1), */
    }
    this.libService.evolutionVLListe(param).subscribe(
      (data)=>{
        this.allData=data.data;
        const exportData = this.allData.map(item => ({
          'DESIGNATION': item.denominationOpcvm,
          'VL.ORIGINE':item.vlOrigine,
          'VL.MOIS1': item.vlmois1,
          'VL.MOIS2': item.vlmois2,
          'RENDEMENT MOIS (%)': item.rendementMois,
          'RENDEMENT A L\'ORIGINE (%)': item.rendementOrigine,
        }));

        // 3️⃣ Convertir en feuille Excel
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { header: headers });

        // 4️⃣ Créer le classeur
        const wb: XLSX.WorkBook = { Sheets: { 'Données': ws }, SheetNames: ['Données'] };

        // 5️⃣ Exporter
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'evolutionvl.xlsx');
        this.export=false
      }
    )
    // 2️⃣ Mapper les données avec les entêtes

  }

  actualiser() {
    this.afficherListe("l");
  }

  telecharger() {
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      /* dateDebut: new Date(param.startDate.year, param.startDate.month - 1, param.startDate.day + 1),
      dateFin: new Date(param.endDate.year, param.endDate.month - 1, param.endDate.day + 1), */
    }
    //.subscribe
    const sb = this.libService.evolutionVLEtat(param)
      .pipe(
        catchError((err) => {
          this.downloading = false;
          return of(err.message);
        }),
        finalize(() => {
          this.downloading = false;
          this.downloaded = false;
        })
      )
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'evolution_vl.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    // this.renderActionColumn();
    // this.clickListener = this.renderer.listen(document, 'click', (event) => {
    //   const closestBtn = event.target.closest('.btn, .dropdown-item');
    //   if (closestBtn) {
    //     const {action, id} = closestBtn.dataset;
    //     this.idInAction = id;
    //     switch (action) {
    //       case 'view':
    //         this.router.navigate(['show', id], {relativeTo: this.route});
    //         break;
    //
    //       // case 'create':
    //       //   this.router.navigate(['new'], {relativeTo: this.route});
    //       //   break;
    //       //
    //       // case 'edit':
    //       //   this.router.navigate(['edit', id], {relativeTo: this.route});
    //       //   break;
    //
    //
    //     }
    //   }
    // });
  }
}
