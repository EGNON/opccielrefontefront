import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Config} from "datatables.net";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {of, Subject, Subscription} from "rxjs";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {LocalService} from "../../../../services/local.service";
import {DepotsouscriptionService} from "../../../services/depotsouscription.service";
import {DataTableDirective} from "angular-datatables";
import {catchError, finalize} from "rxjs/operators";
import {LoaderService} from "../../../../loader.service";
import {AuthService} from "../../../../core/modules/auth";

@Component({
  selector: 'app-depotsouscription-generate',
  templateUrl: './depotsouscription-generate.component.html',
  styleUrl: './depotsouscription-generate.component.scss'
})
export class DepotsouscriptionGenerateComponent implements OnInit, OnDestroy{
  form: FormGroup;

  currentOpcvm: any;
  currentSeance: any;
  currentUser: any;

  submitting = false;
  precalculer = false;
  submitted = false;
  depotRachat$:any;
  //DataTable Config
  datatableConfigInit: any = {};
  datatableConfig: Config = {};
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  @ViewChild('mySelect4') mySelect!: ElementRef<HTMLSelectElement>;
  changeTableEvent: EventEmitter<boolean> = new EventEmitter();

  isLoading: boolean = false;
  subscriptions: Subscription[] = [];

  [key: string]: any;

  constructor(
    private authService: AuthService,
    private loadingService: LoaderService,
    private entityService: DepotsouscriptionService,
    private localStore: LocalService,
    private personneService: PersonneService,
    private fb: FormBuilder,) {
  }

  get sous(): FormArray {
    return <FormArray>this.form.get('sous');
  }

  createListeOpSouscRachatForm() {
    return this.fb.group({});
  }

  ajouterFormControl(elt: any, fieldName: string, fieldValue: any, validators: any[] = []) {
    elt.addControl(fieldName, this.fb.control(fieldValue, validators));
  }

  getPersonnesAll(qualite: any = null)
  {
    const name = qualite[qualite.length-1] === "s" ? `${qualite}$` : `${qualite}s$`;
    this[name] = this.personneService.afficherPersonneSelonQualite(qualite.toUpperCase().trim());
  }

  precalcul() {
    console.log("Form === ", this.form);
    const distributeur = this.form.get("distributeur").value;
    // this.changeTableEvent.emit(true);
    if(distributeur !== null) {
      this.isLoading = true;
      this.afficherListe();
      this.changeTableEvent.emit(true);
      this.refreshTable();
    }
  }

  refreshTable() {
    if(this.changeTableEvent) {
      this.changeTableEvent.subscribe(data => {
        this.datatableElement.dtInstance.then(dtInstance => {
          // dtInstance.clear().destroy();
          // dtInstance.destroy();
          dtInstance.ajax.reload();
        });
      });
    }
  }

  afficherListeVide() {
    this.isLoading = true;
    this.datatableConfig = {
      ...this.datatableConfigInit,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback: any) => {
        console.log("Table === ", dataTablesParameters);
        callback({
          data: [],
          draw: dataTablesParameters.draw,
          recordsFiltered: 0,
          recordsTotal: 0
        });
      },
      columns: [
        {
          title: 'ID', data: 'idSeance', render: function (data, type, row) {
            return 0;
          },
        },
        {
          title: 'N° Compte SGI', data: 'numCompteSgi', render: function (data, type, row) {
            return '';
          },
        },
        {
          title: 'Nom / Sigle', data: 'nomSigle', render: function (data, type, row) {
            return '';
          },
        },
        {
          title: 'Prénom(s) / Raison sociale', data: 'prenomRaison', render: function (data, type, row) {
            return '';
          },
        },
        {
          title: 'Montant Dépôt', data: 'montantDepose', render: function (data, type, row) {
            return 0;
          },
        },
      ],
    };
  }

  afficherListe() {
    const self = this;
    self.sous.clear();
    this.precalculer=true
    this.datatableConfig = {
      ...this.datatableConfigInit,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        const precalculRequest = {
          idSeance: this.currentSeance?.idSeanceOpcvm?.idSeance,
          idOpcvm: this.currentOpcvm?.idOpcvm,
          idPersonne: this.form.value.distributeur?.idPersonne,
          datatableParameters: dataTablesParameters
        };
        console.log("Génération response === ", dataTablesParameters);
        const sb = this.entityService.precalculSouscription(precalculRequest)
          .subscribe(resp => {
            console.log("Génération response === ", resp);
            // const depots: any[] = resp.data.data;
            // self.disableSaveBtn = depots.filter(d => d.estVerifier) != null ? depots.filter(d => d.estVerifier).length > 0 : false;
            callback(resp.data);
            this.precalculer=false
          });
        // this.entityService.precalculSouscriptionListe(precalculRequest).subscribe(
        //   (data)=>{
        //     this.depotRachat$=data.data
        //     this.precalculer=false
        //   }
        // )
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'ID', data: 'idActionnaire', render: function (data, type, row) {
            return row.idActionnaire;
          },
        },
        {
          title: 'N° Compte SGI', data: 'numCompteSgi', render: function (data, type, row) {
            return row.numCompteSgi || '';
          },
        },
        {
          title: 'Nom / Sigle', data: 'nomSigle', render: function (data, type, row) {
            return row.nomSigle || '';
          },
        },
        {
          title: 'Prénom(s) / Raison sociale', data: 'prenomRaison', render: function (data, type, row) {
            return row.prenomRaison || '';
          },
        },
        {
          title: 'Montant Dépôt', data: 'montantDepose', render: function (data, type, row) {
            return row.montantDepose?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
        {
          title: 'Part', data: 'qtePart', render: function (data, type, row) {
            return row.qtePart?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
        {
          title: 'Commission', data: 'commission', render: function (data, type, row) {
            return row.commission?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
        {
          title: 'Taf Com.', data: 'tafCommission', render: function (data, type, row) {
            return row.tafCommission?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
        {
          title: 'Rétrocession', data: 'commissionRetrocession', render: function (data, type, row) {
            return row.commissionRetrocession?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
        {
          title: 'Taf Retro.', data: 'tafcommissionRetrocession', render: function (data, type, row) {
            return row.tafcommissionRetrocession?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
        {
          title: 'Com. Retro.', data: 'commissionRetrocedee', render: function (data, type, row) {
            return row.commissionRetrocedee?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
        {
          title: 'Report à nouveau', data: 'regulReportANouveau', render: function (data, type, row) {
            return row.regulReportANouveau?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
        {
          title: 'Autr. Res. Ben.', data: 'regulautreResultatBeneficiaire', render: function (data, type, row) {
            return row.regulautreResultatBeneficiaire?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
        {
          title: 'Autr. Res. Def.', data: 'regulautreResultatDeficitaire', render: function (data, type, row) {
            return row.regulautreResultatDeficitaire?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
        {
          title: 'Res. Ins. Ben.', data: 'regulResultatEnInstanceBeneficiaire', render: function (data, type, row) {
            return row.regulResultatEnInstanceBeneficiaire?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
        {
          title: 'Res. Ins. Def.', data: 'regulResultatEnInstanceDeficitaire', render: function (data, type, row) {
            return row.regulResultatEnInstanceDeficitaire?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
        {
          title: 'Som Non Distr.', data: 'regulSommeNonDistribuable', render: function (data, type, row) {
            return row.regulSommeNonDistribuable?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
        {
          title: 'Res. Exo. Encours', data: 'regulResultatExoEnCours', render: function (data, type, row) {
            return row.regulResultatExoEnCours?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
        {
          title: 'Res. Ins. Distr.', data: 'regulExoDistribution', render: function (data, type, row) {
            return row.regulExoDistribution?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
        {
          title: 'S/R A Liquider', data: 'montantSousRachatALiquider', render: function (data, type, row) {
            return row.montantSousRachatALiquider?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
        {
          title: 'S/R Part', data: 'sousRachatPart', render: function (data, type, row) {
            return row.sousRachatPart?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
        {
          title: 'Reste', data: 'reste', render: function (data, type, row) {
            return row.reste?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
      ],
      createdRow: function (row, data: any, dataIndex) {
        const opSouscRachatForm = self.createListeOpSouscRachatForm();
        const opSouscRachat: any = {
          idOperation: null,
          idTransaction: null,
          idActionnaire: data.idActionnaire,
          codeNatureOperation: "SOUS_PART",
          actionnaire: {
            idPersonne: data.idActionnaire,
          },
          personne: self.form.get("distributeur").value,
          idSeance: self.currentSeance?.idSeanceOpcvm?.idSeance,
          idOpcvm: self.currentOpcvm?.idOpcvm,
          opcvm: self.currentOpcvm,
          dateOperation: self.currentSeance?.dateFermeture,
          natureOperation: {
            codeNatureOperation: "SOUS_PART",
          },
          referencePiece: "",
          dateDernModifClient: new Date(),
          userLogin: self.currentUser?.username,
          ecriture: "A",
          estOD: false,
          type: "GSR",
          libelleOperation: "Souscription de " + data.qtePart + " Part(s)",
          datePiece: self.currentSeance?.dateFermeture,
          dateSaisie: new Date(),
          dateValeur: self.currentSeance?.dateFermeture,
          montant: data.montantSousRachatALiquider,
          montantSousALiquider: data.montantSousRachatALiquider,
          sousRachatPart: data.sousRachatPart,
          commisiionSousRachat: data.commission,
          tAFCommissionSousRachat: data.tafCommission,
          retrocessionSousRachat: data.commissionRetrocession,
          tAFRetrocessionSousRachat: data.tafcommissionRetrocession,
          commissionSousRachatRetrocedee: data.commissionRetrocedee,
          modeValeurLiquidative: null,
          coursVL: 0,
          nombrePartSousRachat: data.qtePart,
          regulResultatExoEnCours: data.regulResultatExoEnCours,
          regulSommeNonDistribuable: data.regulSommeNonDistribuable,
          regulReportANouveau: data.regulReportANouveau,
          regulautreResultatBeneficiaire: data.regulautreResultatBeneficiaire,
          regulautreResultatDeficitaire: data.regulautreResultatDeficitaire,
          regulResultatEnInstanceBeneficiaire: data.regulResultatEnInstanceBeneficiaire,
          regulResultatEnInstanceDeficitaire: data.regulResultatEnInstanceDeficitaire,
          regulExoDistribution: data.regulExoDistribution,
          fraisSouscriptionRachat: 0,
          reste: data.reste,
          quantiteSouhaite: 0,
          montantDepose: data.montantDepose,
          montantConvertiEnPart: 0,
          estRetrocede: false,
          resteRembourse: false,
          rachatPaye: false,
          valeurCodeAnalytique: "OPC:" + self.currentOpcvm?.idOpcvm,
          valeurFormule: "10:" + data.commission +
            ";17:" + data.commissionRetrocedee +
            ";26:0" +
            ";35:0" +
            ";36:" + data.montantDepose +
            ";41:" + data.montantSousRachatALiquider +
            ";43:" + data.qtePart +
            ";59:0" +
            ";60:" + data.regulautreResultatBeneficiaire +
            ";61:" + data.regulautreResultatDeficitaire +
            ";62:" + data.regulExoDistribution +
            ";63:" + data.regulReportANouveau +
            ";64:" + data.regulResultatEnInstanceBeneficiaire +
            ";65:" + data.regulResultatEnInstanceDeficitaire +
            ";66:" + data.regulResultatExoEnCours +
            ";67:" + data.regulSommeNonDistribuable +
            ";72:" + data.reste +
            ";74:" + data.commissionRetrocession +
            ";80:" + data.sousRachatPart +
            ";123:" + data.tafCommission +
            ";84:" + data.tafCommissionRetrocession,
        };
        for (const key in opSouscRachat) {
          let value = opSouscRachat[key];
          if(key.includes("date")) {
            value = new Date(value);
          }
          self.ajouterFormControl(opSouscRachatForm, key, value, []);
        }
        self.sous.push(opSouscRachatForm);
      },
    };
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
    const dateOuv = new Date(this.currentSeance?.dateOuverture);
    const dateSeance = new Date(this.currentSeance?.dateFermeture);
    this.form = this.fb.group({
      idSeance: [this.currentSeance?.idSeanceOpcvm?.idSeance],
      dateOuverture: [new NgbDate(dateOuv.getFullYear(), dateOuv.getMonth()+1, dateOuv.getDate()),
        Validators.required],
      dateFermeture: [new NgbDate(dateSeance.getFullYear(), dateSeance.getMonth()+1, dateSeance.getDate()),
        Validators.required],
      dateOperation: [new NgbDate(dateSeance.getFullYear(), dateSeance.getMonth()+1, dateSeance.getDate()),
        Validators.required],
      vl: [this.currentSeance?.valeurLiquidative],
      mode: new FormControl(null),
      distributeur: new FormControl(null),
      sous: this.fb.array([this.createListeOpSouscRachatForm()]),
    });
    this.getPersonnesAll('distributeurs');
    this.datatableConfigInit = {
      // dom: 'Bfrtip',
      dom: "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
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
        // loadingRecords: "Chargement en cours...",
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

  save() {
    // return;
    this.submitting = true;
    this.submitted = true;
    this.loadingService.setLoading(true);

    if (this.form.invalid) {
      this.submitting = false;
      this.loadingService.setLoading(false);
      return;
    }
    console.log(this.form.value.sous)
    this.entityService.genererSouscription(this.form.value.sous)
      .pipe(
        catchError((err) => {
          this.submitting = false;
          this.loadingService.setLoading(false);
          return of(err.message);
        }),
        finalize(() => {
          this.submitting = false;
          this.submitted = false;
          this.loadingService.setLoading(false);
          window.location.reload();
        })
      )
      .subscribe(value => {
        // console.log("C'est le résultat === ", value);
      });
  }
}
