import {Inject, Injectable, OnDestroy} from '@angular/core';
import {TableService} from "../table.sevice";
import {HttpClient} from "@angular/common/http";
import {PersonnePhysique} from "../../models/personne/personne.physique.model";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {DataTablesResponse, ResponseModel} from "../../models/table.model";
import { ResourceService } from '../core/resource.service';

@Injectable({
  providedIn: 'root'
})
export class PersonnePhysiqueService extends ResourceService<PersonnePhysique> implements OnDestroy{
  dtOptions: any = {};
  constructor(private http: HttpClient) {
    super(http,PersonnePhysique,`${environment.apiUrl}/personnephysiques`);
    this.API_URL = `${environment.apiUrl}/personnephysiques`;
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

  afficherTous()
  {
    return this.http.get<ResponseModel<PersonnePhysique>>(environment.apiUrl + '/personnephysiques/tous');
  }

  afficherSelonIdQualite(id: number, qualite: string)
  {
    return this.http.get<PersonnePhysique>(`${this.API_URL}/statut/${qualite}-${id}`)
  }

  afficherPersonnePhysiqueNayantPasInvesti (qualite: string,dateDebut:Date,dateFin:Date )  {
    const url = `${this.API_URL}/investi/`+qualite+'/'+dateDebut+'/'+dateFin;
    return this.http.get<PersonnePhysique[]>(url);
  }
  afficherPersonnePhysiqueNayantPasInvestiEtat (qualite: string,dateDebut:Date,dateFin:Date )  {
    const url = `${this.API_URL}/investietat/`+qualite+'/'+dateDebut+'/'+dateFin;
    return this.http.get<PersonnePhysique[]>(url);
  }
  afficherFicheKYC(id: number)
  {
    return this.http.get<PersonnePhysique>(`${this.API_URL}/fichekyc/${id}`)
  }
  getEntityById(id: any): Observable<PersonnePhysique> {
    const url = `${this.API_URL}/${id}`;
    return this.http.get<PersonnePhysique>(url);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  getPersonnes(dataTablesParameters: any, keyword: any): Observable<DataTablesResponse<any>> {
    const url = `${this.API_URL}/datatable-${keyword}/list`;
    return this.http.post<DataTablesResponse<any>>(url, dataTablesParameters);
  }

  getPersonneSanctionnee(dataTablesParameters: any): Observable<DataTablesResponse<any>> {
    const url = `${this.API_URL}/datatable/physiquesanctionnee`;
    return this.http.post<DataTablesResponse<any>>(url, dataTablesParameters);
  }

  afficherPersonneSelonQualite(keyword: any){
    const url = `${this.API_URL}/qualite/${keyword}`;
    return this.http.get(url);
  }

  afficherPersonneSelonQualiteEtat(keyword: any){
    const url = `${this.API_URL}/qualite/etat/${keyword}`;
    return this.http.get(url);
  }

  afficherPersonnePhysiqueSelonQualite(keyword: any){
    const url = `${this.API_URL}/qualite/${keyword}`;
    return this.http.get<PersonnePhysique[]>(url);
  }

  afficherPersonnePhysiqueListe():Observable<PersonnePhysique>
  {
    return this.http.get<PersonnePhysique>(environment.apiUrl + '/personnephysiques');
  }

  afficherPersonnePhysiqueSelonId(id:number):Observable<PersonnePhysique>
  {
    return this.http.get<PersonnePhysique>(environment.apiUrl + '/personnephysiques/'+id);
  }

  createFn(formData: any) {
    return this.http.post<any>(`${this.API_URL}/uploads/file`, formData);
  }

  updateFn(formData: any, id: any) {
    return this.http.put<any>(`${this.API_URL}/uploads/file-${id}`, formData);
  }

  deleteByPersonneAndQualite(idPersonne:number,idQualite:number):Observable<PersonnePhysique>
  {
    return this.http.delete<PersonnePhysique>(environment.apiUrl + `/personnephysiques/${idPersonne}/${idQualite}`);
  }
}
