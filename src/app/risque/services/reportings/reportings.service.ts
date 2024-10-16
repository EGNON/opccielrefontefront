import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ReportingsService {
  API_URL = `${environment.apiUrl}/reportings`;
  dtOptions: any = {};

  constructor(private http: HttpClient) {
    this.dtOptions = {
      dom: 'Bfrtip',
      pagingType: 'full_numbers',
      responsive: true,
      paging: true,
      // serverSide: true,
      pageLength: 10,
      order: [0, 'desc'],
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
      searching: true,
      buttons: [
        {
          extend:    'copy',
          text:      '<i class="fa fa-files-o"></i> Copier',
          titleAttr: 'Copy',
          className: 'btn btn-default btn-sm'
        },
        {
          extend:    'csv',
          text:      '<i class="fa fa-files-o"></i> CSV',
          titleAttr: 'CSV',
          className: 'btn btn-default btn-sm',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'excel',
          text:      '<i class="fa fa-files-o"></i> Excel',
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
      processing: true,
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
      destroy:true
    }
  }

  volatilite(idOpcvm: any, parameter: any) {
    return this.http.post<any>(`${this.API_URL}/risque/volatilite/fcp`, parameter);
  }
  alpha(idOpcvm: any, anneeDebut: any,anneeFin:any) {
    return this.http.get<any>(`${this.API_URL}/risque/alpha/${idOpcvm}/${anneeDebut}/${anneeFin}`);
  }
  ratioSharp(idOpcvm: any, anneeDebut: any,anneeFin:any) {
    return this.http.get<any>(`${this.API_URL}/risque/ratiosharp/${idOpcvm}/${anneeDebut}/${anneeFin}`);
  }
  correlation(idOpcvm: any, parameter: any) {
    return this.http.post<any>(`${this.API_URL}/risque/correlation/${idOpcvm}`,parameter);
  }
  covariance(idOpcvm: any, parameter: any) {
    return this.http.post<any>(`${this.API_URL}/risque/covariance/${idOpcvm}`,parameter);
  }
  beta(idOpcvm: any, parameter: any) {
    return this.http.post<any>(`${this.API_URL}/risque/beta/${idOpcvm}`,parameter);
  }
  ratioTreynor(idOpcvm: any, annee: any,rf:any) {
    return this.http.get<any>(`${this.API_URL}/risque/ratiotreynor/${idOpcvm}/${annee}/${rf}`);
  }
}
