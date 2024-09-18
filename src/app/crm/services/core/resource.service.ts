import { HttpClient } from '@angular/common/http';
import {Observable, Subscription} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {ResourceModel} from "../../models/core/resource.model";
import {ResponseModel} from "../../models/table.model";
import {environment} from "../../../../environments/environment";

export abstract class ResourceService<T extends ResourceModel<T>> {
  // API URL has to be overrided
  API_URL = `${environment.apiUrl}/endpoint`;
  protected subscriptions: Subscription[];
  constructor(
    private httpClient: HttpClient,
    private tConstructor: { new (m: Partial<T>, ...args: unknown[]): T },
    protected apiUrl: string
  ) {}

  public create(resource: any): Observable<ResponseModel<T>> {
    return this.httpClient
      .post<ResponseModel<T>>(`${this.API_URL}`, resource);
  }

  public datatable(resource: any): Observable<ResponseModel<T>> {
    // console.log("Resource = ", resource);
    return this.httpClient
      .post<ResponseModel<T>>(`${this.API_URL}/datatable/list`, resource)
      // .pipe(
      //   tap(resp => console.log("Data", resp))
      // )
      ;
  }
  public datatable_id(resource: any,id:any): Observable<ResponseModel<T>> {
    // console.log("Resource = ", resource);
    return this.httpClient
      .post<ResponseModel<T>>(`${this.API_URL}/datatable/list/${id}`, resource)
      // .pipe(
      //   tap(resp => console.log("Data", resp))
      // )
      ;
  }
  public datatable_TarificationOPC(resource: any,id:any,qualite:any): Observable<ResponseModel<T>> {
    // console.log("Resource = ", resource);
    console.log("q=",qualite)
    return this.httpClient
      .post<ResponseModel<T>>(`${this.API_URL}/datatable/list/${qualite}/${id}`, resource)
      // .pipe(
      //   tap(resp => console.log("Data", resp))
      // )
      ;
  }
  public datatable_Depositaire(resource: any,id:any): Observable<ResponseModel<T>> {
    // console.log("Resource = ", resource);
    return this.httpClient
      .post<ResponseModel<T>>(`${this.API_URL}/datatable/list/depositaire/${id}`, resource)
      // .pipe(
      //   tap(resp => console.log("Data", resp))
      // )
      ;
  }
  public datatable_Place(resource: any,id:any): Observable<ResponseModel<T>> {
    // console.log("Resource = ", resource);
    return this.httpClient
      .post<ResponseModel<T>>(`${this.API_URL}/datatable/list/place/${id}`, resource)
      // .pipe(
      //   tap(resp => console.log("Data", resp))
      // )
      ;
  }
  decode(content: string){
    return decodeURIComponent(content);
  }
  public datatable_Transaction(resource: any,critere:string): Observable<ResponseModel<T>> {
    // console.log("Resource = ", resource);
    // console.log(`${this.API_URL}/datatable?critere=${critere.replaceAll('"','')}`)
    // let url=`${this.API_URL}/datatable/list/${critere.replaceAll('"','')}`
    return this.httpClient
      .post<ResponseModel<T>>(`${this.API_URL}/datatable?critere=${critere}`, resource)
      /*.pipe(
        tap(resp => console.log("Data", resp))
      )*/
      ;
  }

  public get(): Observable<ResponseModel<T[]>> {
    return this.httpClient
      .get<ResponseModel<T[]>>(`${this.API_URL}`);
  }

  public getById(id: number): Observable<ResponseModel<T>> {
    return this.httpClient
      .get<ResponseModel<T>>(`${this.API_URL}/${id}`);
  }

  public update(resource: any): Observable<ResponseModel<T>> {
    return this.httpClient
      .put<ResponseModel<T>>(`${this.API_URL}/${resource.id}`, resource);
  }
  public update_TarificationOPC(resource: any,qualite:any): Observable<ResponseModel<T>> {
    return this.httpClient
      .put<ResponseModel<T>>(`${this.API_URL}/${qualite}/${resource.id}`, resource);
  }
  public delete(id: number): Observable<ResponseModel<T>> {
    return this.httpClient.delete<ResponseModel<T>>(`${this.API_URL}/${id}`);
  }
}
