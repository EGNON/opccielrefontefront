import {Component, EventEmitter, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as xls from "xlsx";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {delay, forkJoin, of, Subject, Subscription} from "rxjs";
import {concatMap, map, switchMap, tap} from "rxjs/operators";
import {LoaderService} from "../../../loader.service";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DataTableDirective} from "angular-datatables";
import {UniqueNumCpteDepositValidators} from "../../../validators/unique-num-cpte-deposit-validators";

@Component({
  selector: 'app-importationdepot',
  templateUrl: './importationdepot.component.html',
  styleUrl: './importationdepot.component.scss'
})
export class ImportationdepotComponent implements OnInit, OnDestroy{
  submitting = false;
  submitted = false;
  filterForm: FormGroup;

  isLoading: boolean = false;
  subscriptions: Subscription[] = [];

  //DataTable Config
  datatableConfigInit: any = {};
  datatableConfigPh: any = {};
  datatableConfigPm: any = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  changeTableEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private loadingService: LoaderService,
    private fb: FormBuilder,
    private uniqueNumCpteDepositValidators: UniqueNumCpteDepositValidators,) {
  }

  ngOnInit(): void {
    const opcvm = JSON.parse(window.localStorage.getItem("currentOpcvm"));
    console.log("Opcvm === ", opcvm);
    this.filterForm = this.fb.group({
      fichier: new FormControl(null),
      phList: this.fb.array([this.createPhForm()]),
      pmList: this.fb.array([this.createPmForm()]),
    });
    //Initialize datatable option
    this.datatableConfigInit = {
      dom: "<'row'<'col-sm-12'tr>>",
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
  }

  ngOnDestroy(): void {
  }

  get phList(): FormArray { return <FormArray>this.filterForm.get('phList'); }

  get pmList(): FormArray { return <FormArray>this.filterForm.get('pmList'); }

  createStatutPersonneForm() {
    return this.fb.group({
      idStatutPersonne: new FormGroup({
        idPersonne: new FormControl(null),
        idQualite: new FormControl(null),
      }),
      personne: new FormControl(null),
      personnel: new FormControl(null),
      qualite: new FormControl(null),
    });
  }

  createPmForm() {
    return this.fb.group({
      //Champs communs
      id: [0],
      idPersonne: [0],
      degre: [null, Validators.required],
      mobile1: [null, Validators.required],
      mobile2: [null],
      fixe1: [null],
      fixe2: [null],
      ifu: [null, Validators.required],
      bp: [null],
      distributeur: [null],
      secteur: [null, Validators.required],
      emailPerso: [null, Validators.email],
      emailPro: [null, Validators.email],
      numeroCpteDeposit: [
        null,
        [Validators.required], //sync validators
        [this.uniqueNumCpteDepositValidators.numeroCompteDepositValidators(0)] //async validators
      ],
      paysResidence: [null, Validators.required],
      domicile: [null],
      nomContact: [null, Validators.required],
      prenomContact: [null, Validators.required],
      telContact: [null, Validators.required],
      emailContact: [null, [Validators.required, Validators.email]],
      titreContact: [null, Validators.required],
      estConvertie: [false],
      statutPersonnes: this.fb.array([this.createStatutPersonneForm()]),
      sousTypeClient: [null],
      categorieClient: [null],
      //Champs PersonneMorale
      sigle: [null, Validators.required],
      raisonSociale: [null, Validators.required],
      siteWeb: [null],
    });
  }

  createPhForm() {
    return this.fb.group({
      //Champs communs
      id: [null],
      idPersonne: [null],
      secteur: [null],
      degre: [null, Validators.required],
      mobile1: [null, Validators.required],
      mobile2: [null],
      fixe1: [null],
      fixe2: [null],
      ifu: [null],
      bp: [null],
      typePiece: [null],
      numeroPiece: [null],
      dateExpirationPiece: [null],
      modeEtablissement: [null],
      modeEtablissementDto: [null],
      emailPerso: [null, Validators.email],
      emailPro: [null, Validators.email],
      domicile: [null],
      distributeur: [null],
      documents: this.fb.array([]),
      // statutPersonnes: this.fb.array([]),
      statutPersonnes: this.fb.array([this.createStatutPersonneForm()]),
      estsgi: [false],
      ppe1: [false],
      ppe2: [false],
      ppe3: [false],
      ppe4: [false],
      //Champs PersonnePhysique
      nom: [null, Validators.required],
      prenom: [null, Validators.required],
      sexe: [null, Validators.required],
      dateNaissance: [null, Validators.required],
      civilite: [null],
      lieuTravail: [null],
      autresRevenus: [0],
      periodicite: [null],
      statutMatrimonial: [null],
      nbrEnfant: [0],
      nbrPersonneACharge: [0],
      paysResidence: [null],
      nomEmployeur: [null],
      adressePostaleEmp: [null],
      adresseGeoEmp: [null],
      telEmp: [null],
      emailEmp: [null, Validators.email],
      nomPere: [null],
      prenomsPere: [null],
      dateNaissancePere: [null],
      paysPere: [null],
      nomMere: [null],
      prenomsMere: [null],
      dateNaissanceMere: [null],
      paysMere: [null],
      nomConjoint: [null],
      prenomConjoint: [null],
      dateNaissanceConjoint: [null],
      paysConjoint: [null],
      origineFonds: [null],
      transactionEnvisagee: [null],
      immobilier: [null],
      autresBiens: [null],
      surfaceTotale: [0],
      salaire: [0],
      numeroCpteDeposit: [
        null,
        [Validators.required], //sync validators
        [this.uniqueNumCpteDepositValidators.numeroCompteDepositValidators(0)] //async validators
      ],
      profession: [null, Validators.required],
      secteurEmp: [null],
      paysNationalite: [null, Validators.required],
      langue: [null],
      teint: [null],
      exposeMotif: [null],
      sousTypeClient: [null],
      categorieClient: [null],
    });
  }

  importCours(file: HTMLElement, event: any) {
    file.click();
  }

  onImagePicked($event: Event) {
    const self = this;
    // self.loadingService.setLoading(true);
    const files = ($event.target as HTMLInputElement).files;
    if (files && files[0]) {
      const file = (event.target as HTMLInputElement).files[0];
      this.filterForm.patchValue({ fichier: file});
      this.changeTableEvent.emit(true);
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        this.isLoading = true;
        // this.refreshTable();
        let data = reader.result;
        let workbook = xls.read(data, {type:'binary', cellDates: true});
        // const sheetname = workbook.SheetNames[0];
        workbook.SheetNames.forEach(value => {
          const sheet = workbook.Sheets[value];
          let arrs: [][] = xls.utils.sheet_to_json(sheet, {header:1});
          arrs = arrs.filter((value, index) => index > 0);
          console.log("Tab ===", arrs);
          if(value.toLowerCase().trim() === "personne physique") {
            /*this.phList.clear();
            arrs.forEach((ph: any[]) => {
              const phForm = self.createPhForm();
              phForm.patchValue({
                nom: ph[3],
                prenom: ph[4],
                sexe: ph[9]
              });
              this.phList.push(phForm);
            });*/

            const arraySource = of(true).pipe(
              concatMap(() => {
                return forkJoin(self.loadPhExcelData(arrs));
              })
            );

            this.datatableConfigPh = {
              ...this.datatableConfigInit,
              paging: false,
              processing: true,
              ajax: (dataTablesParameters: any, callback: any) => {
                arraySource
                  .subscribe((phList) => {
                    callback({
                      data: phList,
                      draw: dataTablesParameters.draw,
                      recordsFiltered: phList.length,
                      recordsTotal: phList.length
                    });
                    // self.loadingService.setLoading(false);
                  });
              },
              columns: [
                {
                  title: 'N° Compte SGI', data: 'numeroCpteDeposit', render: function (data:any, type:any, row:any) {
                    const numeroCpteDeposit = row.numeroCpteDeposit;
                    return numeroCpteDeposit || '';
                  },
                  orderData: [1],
                  orderSequence: ['asc', 'desc'],
                  type: 'string',
                },
                {
                  title: 'Civilité', data: 'civilite', render: function (data:any, type:any, full:any) {
                    return full.civilite || '';
                  }
                },
                {
                  title: 'Dénomination', data: 'nom', render: function (data:any, type:any, full:any) {
                    return full.denomination || '';
                  }
                },
                {
                  title: 'Mobile 1', data: 'mobile1', render: function (data: any, type: any, row: any) {
                    const roleName = row.mobile1;
                    return roleName || '';
                  },
                  orderData: [1],
                  orderSequence: ['asc', 'desc'],
                  type: 'string',
                },
                {
                  title: 'Nationalité', data: 'paysNationalite', render: function (data: any, type: any, row: any) {
                    const pays = row.paysNationalite;
                    if(!pays)
                      return '';

                    return pays.libelleFr;
                  },
                  orderData: [1],
                  orderSequence: ['asc', 'desc'],
                  type: 'string',
                },
                {
                  title: 'Mode d\'établissement', data: 'modeEtablissementDto', render: function (data:any, type:any, full:any) {
                    const mode = full.modeEtablissementDto;
                    if(!mode)
                      return '';

                    return mode.libelle;
                  }
                },
              ],
              createdRow: function (row, data, dataIndex, cells) {
                /*const coursTitreForm = self.createCoursTitreForm();
                const coursClone: any = data;
                coursTitreForm.patchValue(coursClone);
                self.cours.push(coursTitreForm);
                $('td', row).find('input').on('change', (e) => {
                  self.filterForm.patchValue({[e.target.name]: +e.target.value!});
                });*/
              },
            };
            this.datatableElement.dtInstance.then(dtInstance => {
              dtInstance.ajax.reload();
            });
          }
        });
        debugger;
      };
      console.log("Form Init === ", this.filterForm);
    }
    else {
      console.log("Aucun fichier sélectionné");
    }
  }

  loadPhExcelData = (phList: any[]) => {
    return phList.map((i) =>
      of({
        id: null,
        idPersonne: null,
        denomination: i[3] + " " + i[4],
        mobile1: i[15],
        mobile2: null,
        fixe1: i[14],
        fixe2: null,
        emailPerso: i[16],
        emailPro: null,
        typePiece: i[17],
        numeroPiece: i[18],
        distributeur: null,
        //Champs PersonnePhysique
        nom: i[3],
        prenom: i[4],
        sexe: i[9],
        dateNaissance: null,
        lieuNaissance: i[8],
        nomMere: i[12],
        prenomsMere: null,
        numeroCpteDeposit: i[2],
        profession: null,
        paysNationalite: null
      })
      .pipe(
        delay(500),
        tap(x => console.log("X === ", x)),
      )
    );
  }

  loadPmExcelData = (pmList: any[]) => {
    return null;
  }

  save() {
    return null;
  }
}
