import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Config, Api } from 'datatables.net';
import saveAs from 'file-saver';
import moment from 'moment';
import { Subject, Subscription, catchError, of, finalize } from 'rxjs';
import { AuthService } from '../../../../core/modules/auth';
import { JournalService } from '../../../../core/services/journal.service';
import { Personne } from '../../../../crm/models/personne/personne.model';
import { LibrairiesService } from '../../../../services/librairies.service';
import { LocalService } from '../../../../services/local.service';
import { ExerciceService } from '../../../services/exercice.service';
import * as XLSX from "xlsx";
import { ComptecomptableService } from '../../../../core/services/comptecomptable.service';
export interface GroupNode {
  label: string;
  children?: GroupNode[];
  debit?: number;
  credit?: number;
  solde?: number;
  expanded?: boolean;
}
@Component({
  selector: 'app-grandlivre',
  standalone: false,
  templateUrl: './grandlivre.html',
  styleUrl: './grandlivre.scss'
})
export class Grandlivre implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  form: FormGroup;

  currentOpcvm: any;
  currentSeance: any;
  currentUser: any;

  downloading = false;
  export = false;
  downloaded = false;
  submitting = false;
  submitted = false;
  dateDebut:any;
  dateFin:any;
  annee:number;
  //DataTable Config
  datatableConfig: Config = {};
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;

  isLoading: boolean = false;
  subscriptions: Subscription[] = [];
   public journalSettings = {};
  actionnaireSelectionne: Personne[];  
  exercice$: any;
  exercice: any;
  journal: any;
  codeJournal:any;
  actionnaire:any;
  compteComptable:any;
  numCompteComptable:any;
  data:any;

 public compteSettings = {};
  allData:any;
  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private localStore: LocalService,
    public compteComptableService: ComptecomptableService,
    private libService: LibrairiesService,
    private exerciceService: ExerciceService,
    public renderer: Renderer2) {
    this.currentUser = this.authService.currentUserValue;
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");

    this.afficherExercice();
   this.afficherCompte();
    this.compteSettings = {
      singleSelection: true,
      idField: 'numCompteComptable',
      textField: 'libelleCompteComptable',
      enableCheckAll: true,
      selectAllText: 'Sélectionnez tous',
      unSelectAllText: 'Ne pas tout sélectionné',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Rechercher un élément',
      noDataAvailablePlaceholderText: 'Aucune donnée à afficher',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
  }
  buildHierarchy(apiData: any[]): GroupNode[] {

  const result: GroupNode[] = [];

  // Dictionnaires pour retrouver rapidement les groupes
  const comptesMap = new Map<string, GroupNode>();
  const analytiquesMap = new Map<string, GroupNode>();

  apiData.forEach(item => {

    /** -------------------------
     * 1. Groupe principal : COMPTE
     * ------------------------- **/
    let compteNode = comptesMap.get(item.numCompteComptable);
    if (!compteNode) {
      compteNode = {
        label: "COMPTE: " + item.numCompteComptable,
        expanded: false,
        children: []
      };
      comptesMap.set(item.numCompteComptable, compteNode);
      result.push(compteNode);
    }

    /** -------------------------
     * 2. Sous-groupe ANALYTIQUE
     * ------------------------- **/
    const analyticKey = item.numCompteComptable + "-" + item.codeAnalytique;

    let analyticNode = analytiquesMap.get(analyticKey);
    if (!analyticNode) {
      analyticNode = {
        label: item.codeAnalytique + ":",
        expanded: false,
        children: []
      };
      analytiquesMap.set(analyticKey, analyticNode);
      compteNode.children!.push(analyticNode);
    }

    /** -------------------------
     * 3. Détail analytique
     * ------------------------- **/
    analyticNode.children!.push({
      label: item.codeAnalytique + ": " + item.reference,
      debit: item.debit,
      credit: item.credit,
      solde: item.solde
    });

  });

  return result;
}
buildTree(apiData: any[]): any[] {
  const comptesMap = new Map<string, any>();

  for (const line of apiData) {

    // --- 1. GROUPAGE PAR COMPTE ---
    if (!comptesMap.has(line.numCompteComptable)) {
      comptesMap.set(line.numCompteComptable, {
        label: `COMPTE: ${line.numCompteComptable}`,
        expanded: false,
        children: new Map<string, any>()  // map temporaire des analytiques
      });
    }

    const compteNode = comptesMap.get(line.numCompteComptable);

    // --- 2. GROUPAGE PAR ANALYTIQUE ---
    const analytiqueKey = line.codeAnalytique ?? "SANS ANALYTIQUE";

    if (!compteNode.children.has(analytiqueKey)) {
      compteNode.children.set(analytiqueKey, {
        label: `ANALYTIQUE: ${analytiqueKey}`,
        expanded: false,
        children: []
      });
    }

    const analytiqueNode = compteNode.children.get(analytiqueKey);

    // --- 3. AJOUT DE LA LIGNE DE DONNÉES ---
    analytiqueNode.children.push({
      date: moment(line.dateOp).format('DD/MM/YYYY'),
      journal: line.journal,
      reference: line.reference,
      debit: line.debit,
      credit: line.credit,
      solde: line.solde,
      libelle: line.libelle
    });
  }

  // --- 4. CONVERSION DES MAPS EN TABLEAUX ---
  const tree = [];

  for (const compte of comptesMap.values()) {
    compte.children = Array.from(compte.children.values());
    tree.push(compte);
  }

  return tree;
}

 afficherCompte(){
  this.compteComptableService.afficherTousCompte().subscribe
  ((data)=>{
    this.compteComptable=data.data
  })
 }
 public onItemSelect2(item: any) {
    // console.log('onItemSelect', item);
     this.numCompteComptable=item.numCompteComptable;
    
  }
  public onDeSelect2(item: any) {
    // console.log('onDeSelect', item);
     this.numCompteComptable=null;
    /* this.personneMoraleService.afficherPersonneMoraleSelonId(idPersonne).subscribe(
      (data)=>{
        this.personneMorale=data;
        this.loadFormValuesNew(data)}); */
    
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

afficherExercice(){
    this.exerciceService.afficherExercice(this.localStore.getData("currentOpcvm").idOpcvm
    ).subscribe(
      (data)=>{
        this.exercice$=data;
        this.exercice=data;
       console.log("exercice=",data)
      }
    )
  }
  exerciceChange(){
  //   console.log("date",this.form.value.exercice2.codeExercice)
  //   this.annee = Number(this.form.value.exercice2.codeExercice);
  //  if (this.form.value.exercice2?.dateDebut) {
  //     const raw = this.form.value.exercice2.dateDebut;
  //     const fixed = raw.replace(/(\.\d{2})$/, '$10'); // ajoute un zéro si besoin
  //     this.dateDebut = new Date(fixed);
  //   }

  //   if (this.form.value.exercice2?.dateFin) {
  //     const raw = this.form.value.exercice2.dateFin;
  //     const fixed = raw.replace(/(\.\d{2})$/, '$10');
  //     this.dateFin = new Date(fixed);
  //   }
    console.log("date", this.form.value.exercice2.codeExercice);

    this.annee = Number(this.form.value.exercice2.codeExercice);

    // Date début = 01/01/année
    this.dateDebut = new Date(this.annee, 11, 31);   // mois = 0 → Janvier

    // Date fin = 31/12/année
    this.dateFin = new Date(this.annee, 11, 31); 
    this.form.patchValue({
    dateDebut:new NgbDate(this.dateDebut.getFullYear(), this.dateDebut.getMonth()+1, this.dateDebut.getDate())
    });
    this.form.patchValue({
    dateFin:new NgbDate(this.dateFin.getFullYear(), this.dateFin.getMonth()+1, this.dateFin.getDate())
    });
    //this.afficherListeVide("l");
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
      exercice2:[null],
      compteComptable:[null],
      estCocher:[false],
      dateFin: [
        new NgbDate(dateFin.getFullYear(), dateFin.getMonth()+1, dateFin.getDate()), Validators.required
      ],
      dateDebut: [
       new NgbDate(this.dateDebut.getFullYear(), this.dateDebut.getMonth()+1, this.dateDebut.getDate()), Validators.required
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
    //this.actualiser();
  }

  afficherListe(prefix: string) {
    const self = this;
    let columns: any[] = [
     
      {
        title: 'N°', data: 'num', render: function (data, type, row) {
          return row.num
        },
      },
      {
        title: 'DATE ESTIMATION', data: 'dateEstimation', render: function (data, type, row) {
          return moment(row.dateEstimation).format("DD/MM/YYYY")
        },
      },
      {
        title: 'ACTIONS', data: 'actions', render: function (data, type, row) {
          return row.actions;
        },
      },
      {
        title: 'OBLIGATIONS', data: 'obligations', render: function (data, type, row) {
          return row.obligations;
        },
      },
      {
        title: 'OPC', data: 'partOPC', render: function (data, type, row) {
          return row.partOPC;
        },
      },
      {
        title: 'AUTRES', data: 'autres', render: function (data, type, row) {
          return row.autres;
        },
      },
      {
        title: 'Total Hors part OPC', data: 'totalHorsPartOPC', render: function (data, type, row) {
          return row.totalHorsPartOPC;
        },
      },
      {
        title: 'TOTAL GENERAL', data: 'totalGeneral', render: function (data, type, row) {
          return row.totalGeneral;
        },
      },
      {
        title: 'COMMISSIONS', data: 'commission', render: function (data, type, row) {
          return row.commission;
        },
      },

    ];
    this.datatableConfig = {
      processing: true,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        let idOpcvm = this.currentOpcvm?.idOpcvm;
        let param = {
          idActionnaire:this.codeJournal,
          idOpcvm: idOpcvm,
          ...this.form.value,
          datatableParameters: dataTablesParameters
        };
        if (prefix.toLowerCase() === "l") {
          param = {
            ...param,
            anneeExo:this.annee,
            taux:param.taux.replace(',','.'),
            dateDebut: new Date(param.dateDebut.year, param.dateDebut.month-1, param.dateDebut.day+1),
            dateFin: new Date(param.dateFin.year, param.dateFin.month-1, param.dateFin.day+1),
          };
          console.log(param);
          const sb = this.libService.declarationCommissionSurActif(param)
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
  exportExcel() {
    this.export=true
    let columns: any[] = [
     
      {
        title: 'N°', data: 'num', render: function (data, type, row) {
          return row.num
        },
      },
      {
        title: 'DATE ESTIMATION', data: 'dateEstimation', render: function (data, type, row) {
          return moment(row.dateEstimation).format("DD/MM/YYYY")
        },
      },
      {
        title: 'ACTIONS', data: 'actions', render: function (data, type, row) {
          return row.actions;
        },
      },
      {
        title: 'OBLIGATIONS', data: 'obligations', render: function (data, type, row) {
          return row.obligations;
        },
      },
      {
        title: 'OPC', data: 'partOPC', render: function (data, type, row) {
          return row.partOPC;
        },
      },
      {
        title: 'AUTRES', data: 'autres', render: function (data, type, row) {
          return row.autres;
        },
      },
      {
        title: 'Total Hors part OPC', data: 'totalHorsPartOPC', render: function (data, type, row) {
          return row.totalHorsPartOPC;
        },
      },
      {
        title: 'TOTAL GENERAL', data: 'totalGeneral', render: function (data, type, row) {
          return row.totalGeneral;
        },
      },
      {
        title: 'COMMISSIONS', data: 'commission', render: function (data, type, row) {
          return row.commission;
        },
      },

    ];
    // 1️⃣ Définir les entêtes
    const headers = ['N°','DATE ESTIMATION','ACTIONS','OBLIGATIONS','OPC','AUTRES','Total Hors part OPC',
      'TOTAL GENERAL','COMMISSIONS'
    ];
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
      param = {
        ...param,
        taux:param.taux.replace(',','.'),
        anneeExo:this.annee,
        dateDebut: new Date(param.dateDebut.year, param.dateDebut.month - 1, param.dateDebut.day + 1),
        dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
      }
    this.libService.declarationCommissionSurActifListe(param).subscribe(
      (data)=>{
        this.allData=data.data;
        const exportData = this.allData.map(item => ({
          'N°': item.num,
          'DATE ESTIMATION':moment(item.dateEstimation).format('DD/MM/YYYY'),
          'ACTIONS': item.actions,
          'OBLIGATIONS': item.obligations,
          'OPC': item.partOPC,
          'AUTRES': item.autres,
          'Total Hors part OPC': item.totalHorsPartOPC,
          'TOTAL GENERAL': item.totalGeneral,
          'COMMISSIONS': item.commission,
        }));

        // 3️⃣ Convertir en feuille Excel
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { header: headers });

        // 4️⃣ Créer le classeur
        const wb: XLSX.WorkBook = { Sheets: { 'Données': ws }, SheetNames: ['Données'] };

        // 5️⃣ Exporter
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'declaration_commission_sur_actif.xlsx');
        this.export=false
      }
    )
    // 2️⃣ Mapper les données avec les entêtes

  }

  actualiser() {
    let idOpcvm = this.currentOpcvm?.idOpcvm;
        let param = {
          idActionnaire:this.codeJournal,
          idOpcvm: idOpcvm,
          ...this.form.value,
        };
        
          param = {
            ...param,
            codePlan:param.exercice2.plan.codePlan,
            codeAnalytique:null,
            typeAnalytique:null,
            numCompteComptable:param.estCocher===true?null:this.numCompteComptable,
            dateDebut: new Date(param.dateDebut.year, param.dateDebut.month-1, param.dateDebut.day+1),
            dateFin: new Date(param.dateFin.year, param.dateFin.month-1, param.dateFin.day+1),
          };
          console.log(param);
          const sb = this.libService.grandlivreListe(param)
            .subscribe(resp => {
              console.log("retour",resp.data)
              //this.data = this.buildHierarchy(resp.data);
              this.data = this.buildTree(resp.data);
            });
  }
 exportExcel2() {
    this.export=true
    // 1️⃣ Définir les entêtes
    // const headers = ['ID','N°COMPTE SGI','NOM / SIGLE','PRENOMS / RAISON SOCIALE'];

    let idOpcvm = this.currentOpcvm?.idOpcvm;
        let param = {
          idActionnaire:this.codeJournal,
          idOpcvm: idOpcvm,
          ...this.form.value,
        };
        
          param = {
            ...param,
            codePlan:param.exercice2.plan.codePlan,
            codeAnalytique:null,
            typeAnalytique:null,
            numCompteComptable:param.estCocher===true?null:this.numCompteComptable,
            dateDebut: new Date(param.dateDebut.year, param.dateDebut.month-1, param.dateDebut.day+1),
            dateFin: new Date(param.dateFin.year, param.dateFin.month-1, param.dateFin.day+1),
          };
          console.log(param);
          const sb = this.libService.grandlivreEtatExcel(param).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "grand_livre"+"_" + moment(new Date()).format("DD MM YYYY") +".xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      this.export=false
    });
  }
  telecharger() {
    this.downloading = true;
    const formValue = this.form.value;
   let idOpcvm = this.currentOpcvm?.idOpcvm;
        let param = {
          idActionnaire:this.codeJournal,
          idOpcvm: idOpcvm,
          ...this.form.value,
        };
        
          param = {
            ...param,
            codePlan:param.exercice2.plan.codePlan,
            codeAnalytique:null,
            typeAnalytique:null,
            numCompteComptable:param.estCocher===true?null:this.numCompteComptable,
            dateDebut: new Date(param.dateDebut.year, param.dateDebut.month-1, param.dateDebut.day+1),
            dateFin: new Date(param.dateFin.year, param.dateFin.month-1, param.dateFin.day+1),
          };
    //.subscribe
    const sb = this.libService.grandlivreEtat(param)
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
        a.download = 'grand_livre.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
}
