import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup} from "@angular/forms";
import {OpcvmService} from "../../services/opcvm.service";
import {firstValueFrom, Subscription} from "rxjs";
import $ from "jquery";
import {AuthService} from "../../../core/modules/auth";
import {ActivatedRoute, Router} from "@angular/router";
import moment from "moment";
import {Config} from "datatables.net";
import {LocalService} from "../../../services/local.service";
import { SeanceopcvmService } from '../../services/seanceopcvm.service';
import { TaskNotificationService } from '../../../services/TaskNotificationService';

@Component({
    selector: 'app-connexion',
    templateUrl: './connexion.component.html',
    styleUrl: './connexion.component.scss',
    standalone: false
})
export class ConnexionComponent implements OnInit, OnDestroy{
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  form: FormGroup;

  datatableConfig: Config = {};
  dtOptions: any = {};

  private subscriptions: Subscription[] = [];

  constructor(
    private localStore: LocalService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notificationService: TaskNotificationService,
    private opcvmService: OpcvmService,
    private seanceOpcvmService: SeanceopcvmService,
    public modal: NgbActiveModal,
    private fb: FormBuilder) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.dtOptions = {
      dom: 'Bfrtip',
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
    let today = new Date();
    let dateDebut = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
    let dateFin = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
    this.form = this.fb.group({
      startDate: [dateDebut],
      endDate: [dateFin],
    });
    this.afficherListe();
  }


// selectOpcvm(n: any) {
//   alert('SELECT OPCVM APPELÉ : ' + n.idOpcvm);
//   this.notificationService.demanderAutorisationNotifications();

//   this.authService.currentOpcvmSubject.next(n);
//   window.localStorage.setItem('opcvmIsConnected', '1');
//   this.localStore.saveData('currentOpcvm', n);

//   console.log('1 - Sélection OPCVM :', n.idOpcvm);

// this.authService.currentSeance(n.idOpcvm).subscribe({
//   next: async (seance) => {
//     console.log('2 - Séance chargée');

//     this.localStore.saveData('currentSeance', seance);

//     console.log('3 - Début activation abonnement Push');

//     await this.notificationService.activerAbonnementPush(n.idOpcvm);

//     console.log('4 - Fin activation abonnement Push');

//     this.notificationService.activerNotifications();

//     this.passEntry.emit(n);
//     this.modal.dismiss();

//     this.notificationService.testerNotificationPush(n.idOpcvm);

//     this.router.navigate(['opcvm', 'dashboard']);
//   },
//   error: error => console.error('Erreur chargement séance :', error)
// });

//   return n;
// }
async selectOpcvm(n: any) {
  //alert('SELECT OPCVM APPELÉ : ' + n.idOpcvm);

  console.log('1 - Début sélection OPCVM :', n.idOpcvm);

  this.notificationService.demanderAutorisationNotifications();

  this.authService.currentOpcvmSubject.next(n);
  window.localStorage.setItem('opcvmIsConnected', '1');
  this.localStore.saveData('currentOpcvm', n);

  try {
    console.log('2 - Chargement séance');

    const seance = await firstValueFrom(
      this.authService.currentSeance(n.idOpcvm)
    );

    console.log('3 - Séance chargée :', seance);

    this.localStore.saveData('currentSeance', seance);

    console.log('4 - Activation abonnement Push');

    await this.notificationService.activerAbonnementPush();

    console.log('5 - Retour activation abonnement Push');

    this.notificationService.activerNotifications();

    //this.notificationService.testerNotificationPush(n.idOpcvm);

    this.passEntry.emit(n);
    this.modal.dismiss();

    

    this.router.navigate(['opcvm', 'dashboard']);

  } catch (error) {
    console.error('ERREUR DANS SELECT OPCVM :', error);
  }

  return n;
}
  afficherListe() {
    const self = this;
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const sb = this.opcvmService.listeOpcvm(dataTablesParameters)
          .subscribe(resp => {
            callback(resp.data);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'ID', data: 'idOpcvm', render: function (data, type, row) {
            return row.idOpcvm;
          },
        },
        {
          title: 'Sigle', data: 'sigleOpcvm', render: function (data, type, row) {
            return row.sigleOpcvm;
          },
        },
        {
          title: 'Dénomination', data: 'denominationOpcvm', render: function (data, type, row) {
            return row.denominationOpcvm || '';
          },
        },
        {
          title: 'VL', data: 'valeurLiquidativeActuelle', render: function (data, type, row) {
            // const vl = String(row.valeurLiquidativeActuelle).toString();
            return row.valeurLiquidativeActuelle.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
            // return vl;
          },
        },
        {
          title: 'Date prochaine VL', data: 'dateProchainCalculVL', render: function (data, type, row) {
            return moment(data).format('DD/MM/YYYY');
          },
        },
        {
          data: null, render: function(data, type, row){
            return `<button class="btn btn-info btn-sm deleteBtn">Me Connecter</button>`;
          }
        }
      ],
     createdRow: function (row: Node, data: any, dataIndex: number) {
        $(row).find('.deleteBtn')
          .off('click')
          .on('click', function (event) {
            event.preventDefault();

            console.log('Clic détecté sur OPCVM :', data.idOpcvm);

            //alert('OPCVM sélectionné : ' + data.idOpcvm);

            self.selectOpcvm(data);
          });
      },
      // createdRow: function (row, data, dataIndex) {
      //   // $(row).find('.btn').on('click', btncallback("Merde !!"));
      //   $(row).find('.btn').on('click', () => self.selectOpcvm(data));
      // },
    };
    this.dtOptions = {
      ...this.dtOptions,
      ...this.datatableConfig,
      /*drawCallback: function (row:Node, data:any[] | object, index:number) {
        var table = this.api();
        var pageInfo = table.page.info();

        $('.paginate_button.next:not(.disabled)', table.table().container()).on('click', function (e:any) {
          var nextPageIndex = pageInfo.page ;
          alert('Next page index: ' + nextPageIndex);
        });

        // Event handler for the "Previous" button
        $('tbody tr', table.table().container()).on('dblclick', function () {
          alert("VRAI !!!");
        });

        /!*row.childNodes[0].textContent = String(index + 1);
        const self = this;
        $('td' ,row).off('click');
        $('td',row).on('click',()=>{
          selectOpcvm();
        });*!/
      },*/
    }
  }
}
