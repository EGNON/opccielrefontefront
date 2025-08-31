import {Component, OnDestroy, OnInit} from '@angular/core';
import {Config} from "datatables.net";
import {of, Subscription} from "rxjs";
import {LoaderService} from "../../../../loader.service";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {LocalService} from "../../../../services/local.service";
import {DepotsouscriptionService} from "../../../services/depotsouscription.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../../core/modules/auth";
import moment from "moment/moment";
import $ from "jquery";
import {catchError, finalize} from "rxjs/operators";
import Swal from "sweetalert2";

@Component({
    selector: 'app-verif-depotsouscription-niv2',
    templateUrl: './verif-depotsouscription-niv2.component.html',
    styleUrl: './verif-depotsouscription-niv2.component.scss',
    standalone: false
})
export class VerifDepotsouscriptionNiv2Component implements OnInit, OnDestroy{

  form: FormGroup;

  currentOpcvm: any;
  currentSeance: any;
  currentUser: any;

  submitting = false;
  submitted = false;
  downloading = false;
  downloaded = false;
  disableSaveBtn = false;

  datatableConfig: Config = {};
  dtOptions: any = {};

  private subscriptions: Subscription[] = [];

  constructor(private loadingService: LoaderService,
              private fb: FormBuilder,
              private localStore: LocalService,
              private authService: AuthService,
              private entityService: DepotsouscriptionService,
              private router: Router,
              private route: ActivatedRoute,
              public modal: NgbActiveModal,) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
    this.form = this.fb.group({
      depots: this.fb.array([this.createListeVerifDepotForm()]),
    });
    this.dtOptions = {
      // dom: 'Bfrtip',
      dom: "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      /*order: [0, 'desc'],*/
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
      retrieve: true,
      stateSave: true,
      destroy: true
    };
    this.afficherListe();
  }

  get depots(): FormArray {
    return <FormArray>this.form.get('depots');
  }

  createListeVerifDepotForm() {
    return this.fb.group({});
  }

  ajouterFormControl(elt: any, fieldName: string, fieldValue: any, validators: any[] = []) {
    elt.addControl(fieldName, this.fb.control(fieldValue, validators));
  }

  afficherListe() {
    const self = this;
    self.depots.clear();
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const verificationListeDepotRequest = {
          seanceOpcvmDto: this.currentSeance,
          opcvmDto: this.currentOpcvm,
          datatableParameters: dataTablesParameters,
          estVerifier: null,
          estVerifie1: true,
          estVerifie2: false
        };

        const sb = this.entityService.verificationListeDepot(verificationListeDepotRequest)
          .subscribe(resp => {
            callback(resp.data);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'Référence', data: 'referencePiece', render: function (data, type, row) {
            return row.referencePiece;
          },
        },
        {
          title: 'Date Opération', data: 'dateOperation', render: function (data, type, row) {
            return moment(data).format('DD/MM/YYYY');
          },
        },
        {
          title: 'Dénomination', data: 'denomination', render: function (data, type, row) {
            return row.actionnaire.denomination || '';
          },
        },
        {
          title: 'Montant Déposé', data: 'montant', render: function (data, type, row) {
            return row.montant.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
        {
          title: 'Montant Souscrit', data: 'montantSouscrit', render: function (data, type, row) {
            return row.montant.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
        {
          title: 'Vérifié ?', data: "estVerifie2", render: function(data, type, row){
            return `<div class="form-check form-check-custom form-check-solid form-check-success form-switch">
                      <div class="form-check form-check-custom form-check-solid form-switch mb-2">
                        <input disabled="disabled" name="estVerifie2" type="checkbox" class="form-check-input"
                            value="true" checked>
                      </div>
                    </div>`;
          }
        }
      ],
      createdRow: function (row, data, dataIndex) {
        console.log("A vérifier === ", data);
        const listeVerifDepotForm = self.createListeVerifDepotForm();
        const depotClone: any = {
          ...data,
          estVerifie2: true,
          dateVerification2: new Date(),
          userLoginVerificateur2: self.currentUser?.username,
        };
        for (const key in depotClone) {
          let value = depotClone[key];
          if(key.includes("date")) {
            value = new Date(value);
          }
          self.ajouterFormControl(listeVerifDepotForm, key, value, []);
        }
        self.depots.push(listeVerifDepotForm);
        $('td', row).find('input').on('change', (e) => {
          self.form.patchValue({[e.target.name]: +e.target.value!});
        });
      },
    };
    this.dtOptions = {
      ...this.dtOptions,
      ...this.datatableConfig,
    }
  }

  telecharger() {
    this.downloading = true;
    const downloadRequest = {
      idOpcvm: this.currentOpcvm?.idOpcvm,
      idSeance: this.currentSeance?.idSeanceOpcvm?.idSeance,
      niveau: 2,
      user: {
        idPersonne: this.currentUser?.idPersonne,
        denomination: this.currentUser?.denomination
      },
    };
    const sb = this.entityService.telechargerListeDepot(downloadRequest)
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
        const fileName = 'listVerif2Depot.pdf';

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      });
    this.subscriptions.push(sb);
  }

  confirmer($event: any) {
    this.submitting = true;
    this.submitted = true;
    this.loadingService.setLoading(true);

    if (this.form.invalid) {
      this.submitting = false;
      this.loadingService.setLoading(false);
      return;
    }

    this.entityService.confirmerListeVerifNiv2Depot(this.form.value.depots)
      .pipe(
        catchError((err) => {
          this.submitting = false;
          this.disableSaveBtn = false;
          this.loadingService.setLoading(false);
          return of(err.message);
        }),
        finalize(() => {
          this.submitting = false;
          this.submitted = false;
          this.disableSaveBtn = true;
          this.loadingService.setLoading(false);
          Swal.fire({
            title: "OPCCIEL",
            text: "Confirmation effectuée avec succès.",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok"
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        })
      )
      .subscribe(value => {
        console.log("La réponse est là === ", value);
        /*Swal.fire({
          title: "OPCCIEL",
          text: "Confirmation effectuée avec succès.",
          icon: "success"
        });*/
      });
  }
}
