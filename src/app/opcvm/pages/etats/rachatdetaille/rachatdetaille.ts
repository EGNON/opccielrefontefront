import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Config, Api } from 'datatables.net';
import saveAs from 'file-saver';
import moment from 'moment';
import { Subject, Subscription, catchError, of, finalize } from 'rxjs';
import { AuthService } from '../../../../core/modules/auth';
import { Personne } from '../../../../crm/models/personne/personne.model';
import { PersonneMoraleService } from '../../../../crm/services/personne/personne.morale.service';
import { LibrairiesService } from '../../../../services/librairies.service';
import { LocalService } from '../../../../services/local.service';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-rachatdetaille',
  standalone: false,
  templateUrl: './rachatdetaille.html',
  styleUrl: './rachatdetaille.scss'
})
export class Rachatdetaille implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
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

  isLoading: boolean = false;
  subscriptions: Subscription[] = [];
   public distributeurSettings = {};
  actionnaireSelectionne: Personne[];  
  distributeur$: any;
  distributeur: any;
  codePlan:number;
  actionnaire:any;

  allData:any;
  dateDebut:Date;
  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private localStore: LocalService,
    public distributeurService: PersonneMoraleService,
    private libService: LibrairiesService,
    public renderer: Renderer2) {
    this.currentUser = this.authService.currentUserValue;
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");

    this.afficherdistributeur();
    this.actionnaireSelectionne=[]
    // this.distributeurSettings = {
    //   singleSelection: true,
    //   idField: 'codePlan',
    //   textField: 'codePlan',
    //   enableCheckAll: true,
    //   selectAllText: 'Sélectionnez tous',
    //   unSelectAllText: 'Ne pas tout sélectionné',
    //   allowSearchFilter: true,
    //   limitSelection: -1,
    //   clearSearchFilter: true,
    //   maxHeight: 197,
    //   itemsShowLimit: 3,
    //   searchPlaceholderText: 'Rechercher un élément',
    //   noDataAvailablePlaceholderText: 'Aucune donnée à afficher',
    //   closeDropDownOnSelection: false,
    //   showSelectedItemsAtTop: false,
    //   defaultOpen: false,
    // };
    
  }
  public onItemSelect2(item: any) {
    // console.log('onItemSelect', item);
    let codePlan=item.codePlan;
    this.codePlan=item.plan.codePlan
    this.actionnaire=item.denomination
  }
  public onDeSelect2(item: any) {
    // console.log('onDeSelect', item);
    let codePlan=item.codePlan;
    this.codePlan=0
    this.actionnaire="";
   
    
  }

  public onSelectAll2(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAll2(items: any) {
    // console.log('onDeSelectAll', items);
  }

  public onFilterChange2(item: any) {
    // console.log('onFilterChange', item);
  }
  public onDropDownClose2(item: any) {
    // console.log('onDropDownClose', item);
  }

afficherdistributeur(){
    this.distributeurService.afficherPersonneSelonQualite("distributeurs"
    ).subscribe(
      (data)=>{
        this.distributeur$=data;
        this.distributeur=data;
       console.log("distributeur=",data)
      }
    )
  }
  ngAfterContentInit(): void {
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  ngOnInit(): void {

    const dateOuv = new Date(this.currentSeance?.dateOuverture);
    this.dateDebut=new Date(this.currentSeance?.dateFermeture);
    const dateFin = new Date(this.currentSeance?.dateFermeture);
    this.form = this.fb.group({
      dateFin: [
        new NgbDate(dateFin.getFullYear(), dateFin.getMonth()+1, dateFin.getDate()), Validators.required
      ],
      dateDebut: [
        new NgbDate(this.dateDebut.getFullYear(), 1, 1), Validators.required
      ],
      distributeur:[]
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
    this.afficherListeVide("l");
    // this.actualiser();
  }

  afficherListe(prefix: string) {
    const self = this;
     let columns: any[] = [
    
      {
        title: 'DISTRIBUTEUR', data: 'raisonSociale', render: function (data, type, row) {
          return row.raisonSociale;
        },
      },
      {
        title: 'DATE OPER.', data: 'dateOperation', render: function (data, type, row) {
          return moment(row.dateOperation).format("DD/MM/YYYY");
        },
      },
      {
        title: 'TYPE', data: 'libelleTypePersonne', render: function (data, type, row) {
          return row.libelleTypePersonne;
        },
      },
      {
        title: 'ACTIONNAIRE', data: 'personne', render: function (data, type, row) {
          return row.personne;
        },
      },
      {
        title: 'MT. RACHAT', data: 'montantSousALiquider', render: function (data, type, row) {
          return row.montantSousALiquider;
        },
      },
      {
        title: 'PART', data: 'nombrePartSousRachat', render: function (data, type, row) {
          return row.nombrePartSousRachat;
        },
      },
      {
        title: 'COMMISSION', data: 'commisiionSousRachat', render: function (data, type, row) {
          return row.commisiionSousRachat;
        },
      },
      {
        title: 'RETROCESSION', data: 'retrocessionSousRachat', render: function (data, type, row) {
          return row.retrocessionSousRachat;
        },
      },
    ];
    this.datatableConfig = {
      processing: true,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        let idOpcvm = this.currentOpcvm?.idOpcvm;
        let param = {
          idActionnaire:this.codePlan,
          idOpcvm: idOpcvm,
          ...this.form.value,
          datatableParameters: dataTablesParameters
        };
        if (prefix.toLowerCase() === "l") {
          param = {
            ...param,
            idPersonne:this.form.value.distributeur==null?null:this.form.value.distributeur.idPersonne,
            dateDebut: new Date(param.dateDebut.year, param.dateDebut.month-1, param.dateDebut.day+1),
            dateFin: new Date(param.dateFin.year, param.dateFin.month-1, param.dateFin.day+1),
          };
          console.log(param);
          const sb = this.libService.rachatDetaille(param)
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
      // drawCallback: function(settings) {
      //   // @ts-ignore
      //   let api = this.api();
      //   let rows = api.rows({ page: 'current' }).nodes();
      //   let last = null;

      //   api.column(0, { page: 'current' }).data().each(function(group, i) {
      //     if (last !== group) {
      //       $(rows).eq(i).before(
      //         `<tr class="group"><td colspan="${api.columns().count()}"><b>${group}</b></td></tr>`
      //       );
      //       last = group;
      //     }
      //   });
      // },
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
afficherListeVide(prefix: string) {
    const self = this;
     let columns: any[] = [
    
      {
        title: 'DISTRIBUTEUR', data: 'raisonSociale', render: function (data, type, row) {
          return row.raisonSociale;
        },
      },
      {
        title: 'DATE OPER.', data: 'dateOperation', render: function (data, type, row) {
          return moment(row.dateOperation).format("DD/MM/YYYY");
        },
      },
      {
        title: 'TYPE', data: 'libelleTypePersonne', render: function (data, type, row) {
          return row.libelleTypePersonne;
        },
      },
      {
        title: 'ACTIONNAIRE', data: 'personne', render: function (data, type, row) {
          return row.personne;
        },
      },
      {
        title: 'MT. RACHAT', data: 'montantSousALiquider', render: function (data, type, row) {
          return row.montantSousALiquider;
        },
      },
      {
        title: 'PART', data: 'nombrePartSousRachat', render: function (data, type, row) {
          return row.nombrePartSousRachat;
        },
      },
      {
        title: 'COMMISSION', data: 'commisiionSousRachat', render: function (data, type, row) {
          return row.commisiionSousRachat;
        },
      },
      {
        title: 'RETROCESSION', data: 'retrocessionSousRachat', render: function (data, type, row) {
          return row.retrocessionSousRachat;
        },
      },
    ];
    this.datatableConfig = {
      processing: true,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        let idOpcvm = this.currentOpcvm?.idOpcvm;
        let param = {
          idActionnaire:this.codePlan,
          idOpcvm: idOpcvm,
          ...this.form.value,
          datatableParameters: dataTablesParameters
        };
        if (prefix.toLowerCase() === "l") {
          param = {
            ...param,
            idPersonne:-1,
            dateDebut: new Date(param.dateDebut.year, param.dateDebut.month-1, param.dateDebut.day+1),
            dateFin: new Date(param.dateFin.year, param.dateFin.month-1, param.dateFin.day+1),
          };
          console.log(param);
          const sb = this.libService.rachatDetaille(param)
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
      // drawCallback: function(settings) {
      //   // @ts-ignore
      //   let api = this.api();
      //   let rows = api.rows({ page: 'current' }).nodes();
      //   let last = null;

      //   api.column(0, { page: 'current' }).data().each(function(group, i) {
      //     if (last !== group) {
      //       $(rows).eq(i).before(
      //         `<tr class="group"><td colspan="${api.columns().count()}"><b>${group}</b></td></tr>`
      //       );
      //       last = group;
      //     }
      //   });
      // },
      createdRow: function (row, data: any, dataIndex) {},
    };
    this.dtOptions = {
      ...this.dtOptions,
      ...this.datatableConfig,
    };
    this.rerender();
  }
 
  exportExcel() {
    this.export=true
    
    // 1️⃣ Définir les entêtes
    const headers = ['DISTRIBUTEUR','DATE OPER.','TYPE','ACTIONNAIRE',
      'MT. RACHAT','PART','COMMISSION','RETROCESSION'];
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
      param = {
        ...param,
        idPersonne:this.form.value.distributeur==null?null:this.form.value.distributeur.idPersonne,
        dateDebut: new Date(param.dateDebut.year, param.dateDebut.month - 1, param.dateDebut.day + 1),
         dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
      }
    this.libService.rachatDetailleListe(param).subscribe(
      (data)=>{
        this.allData=data.data;
        const exportData = this.allData.map(item => ({
          'DISTRIBUTEUR': item.raisonSociale,
          'DATE OPER.': moment(item.dateOperation).format('DD/MM/YYYY'),
          'TYPE': item.libelleTypePersonne,
          'ACTIONNAIRE': item.personne,
          'MT. RACHAT': item.montantSousALiquider,
          'PART': item.nombrePartSousRachat,
          'COMMISSION': item.commisiionSousRachat,
          'RETROCESSION': item.retrocessionSousRachat,
          
        }));

        // 3️⃣ Convertir en feuille Excel
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { header: headers });

        // 4️⃣ Créer le classeur
        const wb: XLSX.WorkBook = { Sheets: { 'Données': ws }, SheetNames: ['Données'] };

        // 5️⃣ Exporter
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'rachat_detaillé.xlsx');
        this.export=false
      }
    )
    // 2️⃣ Mapper les données avec les entêtes

  }

  actualiser() {
    this.afficherListe("l");
  }
  distributeurChange(){
    // console.log("date",this.form.value.distributeur.codedistributeur)
    // const annee = Number(this.form.value.distributeur.codedistributeur);
    // this.form.patchValue({
    //   dateDebut: new NgbDate(annee, 1, 1)
    // });
    // this.form.patchValue({
    //   dateFin: new NgbDate(annee, 12, 31)
    // });
    //this.afficherListeVide("l");
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
      idPersonne:this.form.value.distributeur==null?null:this.form.value.distributeur.idPersonne,
      // actionnaire:this.actionnaire,
      dateDebut: new Date(param.dateDebut.year, param.dateDebut.month - 1, param.dateDebut.day + 1),
       dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    //.subscribe
    console.log(param);
    const sb = this.libService.rachatDetailleEtat(param)
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
        a.download = 'rachat_detaille.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
}
