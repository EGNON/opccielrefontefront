import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Api, Config} from "datatables.net";
import {of, Subject, Subscription} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {AuthService} from "../../../../core/modules/auth";
import {LoaderService} from "../../../../loader.service";
import {DepotsouscriptionService} from "../../../services/depotsouscription.service";
import {LocalService} from "../../../../services/local.service";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {NgbActiveModal, NgbDate, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ListeSeanceOpcvmComponent} from "../modal/liste-seance-opcvm/liste-seance-opcvm.component";
import {OperationrestitutionreliquatService} from "../../../services/operationrestitutionreliquat.service";
import Swal from "sweetalert2";
import {catchError, finalize} from "rxjs/operators";

@Component({
    selector: 'app-restitution-reliquat',
    templateUrl: './restitution-reliquat.component.html',
    styleUrl: './restitution-reliquat.component.scss',
    standalone: false
})
export class RestitutionReliquatComponent implements OnInit, AfterViewInit, OnDestroy{
  form: FormGroup;

  currentOpcvm: any;
  currentSeance: any;
  currentUser: any;

  downloading = false;
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

  [key: string]: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private loadingService: LoaderService,
    private reliquatService: OperationrestitutionreliquatService,
    private entityService: DepotsouscriptionService,
    private localStore: LocalService,
    private personneService: PersonneService,
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    private fb: FormBuilder,) {
  }

  afficherListe(prefix: string, receivedEntry: any = null) {
    const self = this;
    self.restitutionReliquats.clear();
    let columns: any[] = [
      {
        title: 'ID Op.', data: 'idOperation', render: function (data, type, row) {
          return row.idOperation;
        },
      },
      {
        title: 'ID Act.', data: 'idPersonne', render: function (data, type, row) {
          return row.actionnaire.idPersonne;
        },
      },
      {
        title: 'Dénomination', data: 'denomination', render: function (data, type, row) {
          return row.actionnaire.denomination;
        },
      },
      {
        title: 'Montant', data: 'montant', render: function (data, type, row) {
          return row.montant?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
        },
      }
    ];
    this.datatableConfig = {
      processing: true,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        if(prefix.toLowerCase() === "p") {
          const sb = this.reliquatService.precalculRestitutionReliquat(
            dataTablesParameters, this.currentOpcvm?.idOpcvm, this.form.value.idSeance)
            .subscribe(resp => {
              callback(resp.data);
            });
          this.subscriptions.push(sb);
        }
        else if (prefix.toLowerCase() === "l") {
          let idSeance = this.currentSeance?.idSeanceOpcvm?.idSeance;
          const sb = this.reliquatService.listeOperationRestitution(
            dataTablesParameters,
            this.currentOpcvm?.idOpcvm,
            idSeance !== null ? idSeance : receivedEntry?.idSeanceOpcvm?.idSeance
          )
          .subscribe(resp => {
            callback(resp.data);
          });
          this.subscriptions.push(sb);
        }
        else {
          callback({
            recordsTotal: 1,
            recordsFiltered: 1,
            data: []
          })
        }
      },
      columns: columns,
      createdRow: function (row, data: any, dataIndex) {
        const listeOpRestitutionReliquatForm = self.createListeOpRestitutionReliquatForm();
        const opRestitutionReliquat: any = {
          idOperation: null,
          idTransaction: null,
          idActionnaire: data.idActionnaire,
          actionnaire: {
            idPersonne: data.idActionnaire,
          },
          idSeance: self.currentSeance?.idSeanceOpcvm?.idSeance,
          idOpcvm: self.currentOpcvm?.idOpcvm,
          opcvm: self.currentOpcvm,
          dateOperation: self.currentSeance?.dateFermeture,
          natureOperation: {
            codeNatureOperation: "REST_RELIQUATS",
          },
          referencePiece: "",
          dateDernModifClient: new Date(),
          userLogin: self.currentUser?.denomination,
          ecriture: "A",
          estOD: false,
          type: "PR",
          libelleOperation: "RESTITUTION DE RELIQUAT DE " + data.montant + " FCFA",
          datePiece: self.currentSeance?.dateFermeture,
          dateSaisie: new Date(),
          dateValeur: self.currentSeance?.dateFermeture,
          montant: data.montant,
          valeurCodeAnalytique: "OPC:" + self.currentOpcvm?.idOpcvm + ";ACT:" + data.idActionnaire,
          valeurFormule: "2:" + data.montant,
        };
        for (const key in opRestitutionReliquat) {
          let value = opRestitutionReliquat[key];
          if(key.includes("date")) {
            value = new Date(value);
          }
          self.ajouterFormControl(listeOpRestitutionReliquatForm, key, value, []);
        }
        self.restitutionReliquats.push(listeOpRestitutionReliquatForm);
      },
    };
    this.dtOptions = {
      ...this.dtOptions,
      ...this.datatableConfig,
    };
    this.rerender();
  }

  precalcul() {
    if(this.form.value.idSeance === this.currentSeance?.idSeanceOpcvm?.idSeance) {
      this.afficherListe("p");
    }
    else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Veuillez sélectionner la séance encours pour la génération des paiements.",
        footer: '<a href="#">Pourquoi avez-vous cette erreur?</a>'
      });
    }
  }

  save() {
    console.log("Soumission formulaire === ", this.form);
    this.submitting = true;
    this.submitted = true;
    this.loadingService.setLoading(true);

    if (this.form.invalid) {
      this.submitting = false;
      this.loadingService.setLoading(false);
      return;
    }

    this.reliquatService.enregistrerTous(this.form.value.restitutionReliquats)
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
          this.afficherListe("");
          // window.location.reload();
        })
      )
      .subscribe(value => {
        console.log("C'est le résultat === ", value);
      });
  }

  get restitutionReliquats(): FormArray {
    return <FormArray>this.form.get('restitutionReliquats');
  }

  createListeOpRestitutionReliquatForm() {
    return this.fb.group({});
  }

  ajouterFormControl(elt: any, fieldName: string, fieldValue: any, validators: any[] = []) {
    elt.addControl(fieldName, this.fb.control(fieldValue, validators));
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
      restitutionReliquats: this.fb.array([this.createListeOpRestitutionReliquatForm()]),
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
    this.afficherListe("l");
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
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
    this.cdr.detectChanges();
  }

  callSeanceModal(param) {
    const modalRef = this.modalService.open(ListeSeanceOpcvmComponent, {
      backdrop: "static",
      size: "lg"
    });
    modalRef.componentInstance.passEntry.subscribe((receivedEntry:any) => {
      const dateOuverture = new Date(receivedEntry.dateOuverture);
      const dateFermeture = new Date(receivedEntry.dateFermeture);
      this.form.patchValue({
        idSeance: receivedEntry.idSeanceOpcvm.idSeance,
        dateOuverture: new NgbDate(dateOuverture.getFullYear(), dateOuverture.getMonth() + 1, dateOuverture.getDate()),
        dateFermeture: new NgbDate(dateFermeture.getFullYear(), dateFermeture.getMonth() + 1, dateFermeture.getDate()),
        dateOperation: new NgbDate(dateFermeture.getFullYear(), dateFermeture.getMonth() + 1, dateFermeture.getDate()),
        vl: receivedEntry.valeurLiquidative
      });
      this.afficherListe("l", receivedEntry);
    });
  }

  verification() {
    console.log("Liste des paiements...");
    this.downloading = true;
    const sb = this.reliquatService.listePaiementReliquat(
      this.currentOpcvm?.idOpcvm, this.currentSeance?.idSeanceOpcvm?.idSeance
    )
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
    .subscribe((response: any) => {
      const linkSource =
        'data:application/octet-stream;base64,' + response.data;
      const downloadLink = document.createElement('a');
      const fileName = 'listPaiementReliquat.pdf';

      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    });
    this.subscriptions.push(sb);
  }

  onChange(event: Event) {
    // Get the new input value
    const newValue = (event.target as HTMLInputElement).value;
    // Perform actions based on the new value
    console.log('Input value changed:', newValue);
  }
}
