import {Component, EventEmitter, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import * as xls from "xlsx";
import {delay, forkJoin, of, Subject, Subscription} from "rxjs";
import {concatMap, map, switchMap, tap} from "rxjs/operators";
import {LoaderService} from "../../../loader.service";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DataTableDirective} from "angular-datatables";
import {UniqueNumCpteDepositValidators} from "../../../validators/unique-num-cpte-deposit-validators";
import {PersonneService} from "../../../crm/services/personne/personne.service";
import {LocalService} from "../../../services/local.service";

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
  // @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  @ViewChildren(DataTableDirective) datatableElements: QueryList<DataTableDirective>;
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  changeTableEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private localStore: LocalService,
    private loadingService: LoaderService,
    private pers: PersonneService,
    private fb: FormBuilder,
    private uniqueNumCpteDepositValidators: UniqueNumCpteDepositValidators,) {
  }

  ngOnInit(): void {
    const opcvm = this.localStore.getData("currentOpcvm");
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
    this.dtTrigger.unsubscribe();
    this.subscriptions.forEach((sb) => sb.unsubscribe());
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
      //Champs DepotRachat
      idSeance: [null],
      opcvm: [null],
      quantite: [0],
      modeVL: ["CONNU"],
      type: ["S"],
      dateOperation: [null],
      natureOperation: [null],
      valeurCodeAnalytique: [null],
      valeurFormule: [null],
      estGenere: [false],
      estVerifier: [false],
      nomVerificateur: [null],
      dateVerification: [null],
      montantSouscrit: [null],
      titre: [null],
      qte: [0],
      cours: [0],
      commission: [0],
      interetCouru: [0],
      intererPrecompte: [0],
      //Champs communs
      id: [0],
      idPersonne: [0],
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
      statutPersonnes: this.fb.array([this.createStatutPersonneForm()]),
      //Champs PersonneMorale
      sigle: [null, Validators.required],
      raisonSociale: [null, Validators.required]
    });
  }

  createPhForm() {
    return this.fb.group({
      //Champs DepotRachat
      idSeance: [null],
      opcvm: [null],
      quantite: [0],
      modeVL: ["CONNU"],
      type: ["S"],
      dateOperation: [null],
      natureOperation: [null],
      valeurCodeAnalytique: [null],
      valeurFormule: [null],
      estGenere: [false],
      estVerifier: [false],
      nomVerificateur: [null],
      dateVerification: [null],
      montantSouscrit: [null],
      titre: [null],
      qte: [0],
      cours: [0],
      commission: [0],
      interetCouru: [0],
      intererPrecompte: [0],
      //Champs communs
      id: [null],
      idPersonne: [null],
      secteur: [null],
      mobile1: [null, Validators.required],
      mobile2: [null],
      fixe1: [null],
      fixe2: [null],
      ifu: [null],
      typePiece: [null],
      numeroPiece: [null],
      dateExpirationPiece: [null],
      emailPerso: [null, Validators.email],
      emailPro: [null, Validators.email],
      distributeur: [null],
      statutPersonnes: this.fb.array([this.createStatutPersonneForm()]),
      //Champs PersonnePhysique
      nom: [null, Validators.required],
      prenom: [null, Validators.required],
      sexe: [null, Validators.required],
      dateNaissance: [null, Validators.required],
      lieuNaissance: [null, Validators.required],
      paysResidence: [null],
      nomMere: [null],
      prenomsMere: [null],
      numeroCpteDeposit: [
        null,
        [Validators.required], //sync validators
        [this.uniqueNumCpteDepositValidators.numeroCompteDepositValidators(0)] //async validators
      ],
      profession: [null, Validators.required],
      paysNationalite: [null, Validators.required]
    });
  }

  importCours(file: HTMLElement, event: any) {
    file.click();
  }

  refreshTable() {
    if(this.changeTableEvent) {
      debugger;
      this.changeTableEvent.subscribe(data => {
        this.datatableElements.forEach((dtElement: DataTableDirective) => {
          if(dtElement.dtInstance)
          {
            dtElement.dtInstance.then((dtInstance: any) => {
              dtInstance.ajax.reload();
            });
          }
        });
      });
    }
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
        this.refreshTable();
        let data = reader.result;
        let workbook = xls.read(data, {type:'binary', cellDates: true});
        workbook.SheetNames.forEach(value => {
          const sheet = workbook.Sheets[value];
          let arrs: [][] = xls.utils.sheet_to_json(sheet, {header:1});
          arrs = arrs.filter((value, index) => index > 0);
          if(value.toLowerCase().trim() === "personne physique") {
            const arraySource = of(true).pipe(
              concatMap(() => {
                return forkJoin(self.loadPhExcelData(arrs));
              })
            );
            console.log("Tab ===", arrs);
            this.datatableConfigPh = {
              ...this.datatableConfigInit,
              paging: false,
              processing: true,
              ajax: (dataTablesParameters: any, callback: any) => {
                arraySource.subscribe((phList) => {
                  console.log("C'est le retour des résultats === ", phList);
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
                  title: 'DISTRIBUTEUR', data: 'distributeur', render: function (data: any, type: any, row: any) {
                    const distributeur = row.distributeur;
                    if(!distributeur)
                      return '';

                    return `<select class="form-select form-select-sm mb-2" formControlName="distributeur">
                              <option disabled [defaultSelected]="true" [ngValue]="${distributeur}">
                                ${ distributeur.denomination }
                              </option>
                            </select>`;
                  },
                  orderData: [1],
                  orderSequence: ['asc', 'desc'],
                  type: 'string',
                },
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
                  title: 'MONTANT SOUSCRIT (MS)', data: 'montantSouscrit', render: function (data:any, type:any, full:any) {
                    return `<input readonly name="montantSouscrit" class="form-control form-control-sm" value="${full.montantSouscrit || 0}"/>`;
                  }
                },
              ],
              createdRow: function (row, data, dataIndex, cells) {
                const phForm = self.createPhForm();
                const phClone: any = data;
                phForm.patchValue(phClone);
                self.phList.push(phForm);
                $('td', row).find('input').on('change', (e) => {
                  self.filterForm.patchValue({[e.target.name]: +e.target.value!});
                });
              },
            };
          }
          if(value.toLowerCase().trim() === "personne morale") {
            const arraySource = of(true).pipe(
              concatMap(() => {
                return forkJoin(self.loadPmExcelData(arrs));
              })
            );
            this.datatableConfigPm = {
              ...this.datatableConfigInit,
              paging: false,
              processing: true,
              ajax: (dataTablesParameters: any, callback: any) => {
                arraySource.subscribe((pmList) => {
                  console.log("C'est le retour des résultats === ", pmList);
                  callback({
                    data: pmList,
                    draw: dataTablesParameters.draw,
                    recordsFiltered: pmList.length,
                    recordsTotal: pmList.length
                  });
                  // self.loadingService.setLoading(false);
                });
              },
              columns: [
                {
                  title: 'DISTRIBUTEUR', data: 'distributeur', render: function (data: any, type: any, row: any) {
                    const distributeur = row.distributeur;
                    if(!distributeur)
                      return '';

                    return distributeur.denomination;
                  },
                  orderData: [1],
                  orderSequence: ['asc', 'desc'],
                  type: 'string',
                },
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

                    // return pays.libelleFr;
                    return pays.libelleFr;
                  },
                  orderData: [1],
                  orderSequence: ['asc', 'desc'],
                  type: 'string',
                },
                {
                  title: 'MONTANT SOUSCRIT (MS)', data: 'montantSouscrit', render: function (data:any, type:any, full:any) {
                    return `<input readonly name="montantSouscrit" class="form-control form-control-sm" value="${full.montantSouscrit || 0}"/>`;
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
            // this.datatableElement.dtInstance.then(dtInstance => {
            //   dtInstance.ajax.reload();
            // });
          }
        });
      };
      this.changeTableEvent.emit(true);
      this.refreshTable();
    }
    else {
      console.log("Aucun fichier sélectionné");
    }
  }

  loadPhExcelData = (phList: any[]) => {
    return phList.map((i) =>
      of(i).pipe(
        // delay(500),
        switchMap((j: any[]) => {
          return this.pers.rechercherParSigle(j[0]).pipe(
            map(resp => ({
              id: null,
              idPersonne: null,
              denomination: j[3] + " " + j[4],
              mobile1: j[15],
              mobile2: null,
              fixe1: j[14],
              fixe2: null,
              emailPerso: j[16],
              emailPro: null,
              typePiece: j[17],
              numeroPiece: j[18],
              distributeur: {
                idPersonne: resp.data.idPersonne,
                denomination: resp.data.denomination
              },
              //Champs PersonnePhysique
              nom: j[3],
              prenom: j[4],
              sexe: j[9],
              dateNaissance: null,
              lieuNaissance: j[8],
              nomMere: j[12],
              prenomsMere: null,
              numeroCpteDeposit: j[2],
              profession: null,
              paysNationalite: null,
              montantSouscrit: j[6]
            }))
          )
        }),
        tap(x => console.log("X === ", x)),
      )
    );
  }

  loadPmExcelData = (pmList: any[]) => {
    return pmList.map((i) =>
      of(i)
        .pipe(
          // delay(500),
          switchMap((j: any[]) => {
            return this.pers.rechercherParSigle(j[0]).pipe(
              map(resp => ({
                  //Champs communs
                  id: null,
                  idPersonne: null,
                  denomination: j[3],
                  mobile1: j[10],
                  mobile2: null,
                  fixe1: j[9],
                  fixe2: null,
                  ifu: null,
                  bp: null,
                  distributeur: {
                    idPersonne: resp.data.idPersonne,
                    denomination: resp.data.denomination
                  },
                  emailPerso: j[11],
                  emailPro: j[11],
                  numeroCpteDeposit: j[2],
                  paysResidence: null,
                  //Champs PersonneMorale
                  sigle: null,
                  raisonSociale: null,
                  montantSouscrit: j[6]
                }))
            )
          }),
          // tap(x => console.log("X === ", x)),
        )
    );
  }

  save() {
    return null;
  }
}
