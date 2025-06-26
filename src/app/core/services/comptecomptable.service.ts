import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Comptecomptable} from "../models/comptecomptable.model";
import {DataTablesResponse} from "../../crm/models/data-tables.response.model";

@Injectable({ providedIn: 'root' })
export class ComptecomptableService extends ResourceService<Comptecomptable> {
  dtOptions: any = {};
  constructor(private http: HttpClient) {
    super(http, Comptecomptable, `${environment.apiUrl}/comptecomptables`);
    this.API_URL = `${environment.apiUrl}/comptecomptables`;
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
  afficherTous(codePlan:any){
    return this.http.get<any>(`${this.API_URL}/plan/${codePlan}`)
  }
  afficherSelonNumCompteComptable(numCompteComptable:string){
    return this.http.get<any>(`${this.API_URL}/${numCompteComptable}`)
  }
  modifier(codepLan:string,numCompteComptable:string,compteComptable:any){
    return this.http.put<any>(`${this.API_URL}/${codepLan}/${numCompteComptable}`,compteComptable)
  }
  supprimer(codepLan:string,numCompteComptable:string){
    return this.http.delete<any>(`${this.API_URL}/${codepLan}/${numCompteComptable}`)
  }
  afficherSelonPlan(datatableRequest: any,codePlan:string){
    return this.http.post<DataTablesResponse<Comptecomptable>>(`${this.API_URL}/plan/${codePlan}`,datatableRequest)
  }
  afficherSelonPlanListe(codePlan:string){
    return this.http.get<any>(`${this.API_URL}/plan/${codePlan}`)
  }
  afficherSelonPlanEtEstMvtListe(codePlan:string){
    return this.http.get<any>(`${this.API_URL}/planestmvt/${codePlan}`)
  }
}
