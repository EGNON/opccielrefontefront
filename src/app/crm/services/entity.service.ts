import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { PaginatorState } from '../models/paginator.model';
import {DataTablesResponse, ITableState, TableResponseModel} from '../models/table.model';
import { BaseModel } from '../models/base.model';
import { SortState } from '../models/sort.model';
import { GroupingState } from '../models/grouping.model';
import {environment} from "../../../environments/environment";

const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined
};

export abstract class EntityService<T> {
  // Private fields
  private _items$ = new BehaviorSubject<T[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _tableState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
  private _errorMessage = new BehaviorSubject<string>('');
  private _subscriptions: Subscription[] = [];

  // Getters
  get items$() {
    return this._items$.asObservable();
  }
  get isLoading$() {
    return this._isLoading$.asObservable();
  }
  get isFirstLoading$() {
    return this._isFirstLoading$.asObservable();
  }
  get errorMessage$() {
    return this._errorMessage.asObservable();
  }
  get subscriptions() {
    return this._subscriptions;
  }
  // State getters
  get paginator() {
    return this._tableState$.value.paginator;
  }
  get filter() {
    return this._tableState$.value.filter;
  }
  get sorting() {
    return this._tableState$.value.sorting;
  }
  get searchTerm() {
    return this._tableState$.value.searchTerm;
  }
  get grouping() {
    return this._tableState$.value.grouping;
  }

  protected http: HttpClient;
  // API URL has to be overrided
  API_URL = `${environment.apiUrl}/endpoint`;
  protected constructor(http: HttpClient) {
    this.http = http;
  }

  // CREATE
  // server should return the object with ID
  createRow(item: BaseModel): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.post<BaseModel>(
      this.API_URL,
      item
      /*JSON.stringify(item),
      {
        headers: new HttpHeaders().set('Content-Type','application/json')
      }*/
    ).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('CREATE ITEM', err);
        return of({ id: undefined});
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // READ (Returning filtered list of rows)
  findRow(tableState: ITableState, dataTablesParameters: any): Observable<DataTablesResponse<T>> {
    const url = `${this.API_URL}/datatable/list`;
    this._errorMessage.next('');
    return this.http.post<DataTablesResponse<T>>(url, JSON.stringify(dataTablesParameters), {
      headers: new HttpHeaders().set('Content-Type','application/json')
    }).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('FIND ITEMS', err);
        return of({ draw: 0, recordsTotal: 0, recordsFiltered: 0, data: [] });
      })
    );
  }

  getRowById(id: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${id}`;
    return this.http.get<any>(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('GET ITEM BY IT', id, err);
        return of({id: undefined});
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // UPDATE
  updateRow(item: BaseModel): Observable<any> {
    // , {
    //     headers: new HttpHeaders().set('Content-Type','application/json')
    //   }
    const url = `${this.API_URL}/${item.id}`;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.put(
      url,
      item
      /*JSON.stringify(item), {
        headers: new HttpHeaders().set('Content-Type','application/json')
      }*/
    ).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('UPDATE ITEM', item, err);
        return of(item);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // DELETE
  deleteRow(id: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${id}`;
    return this.http.delete(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('DELETE ITEM', id, err);
        return of({});
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // delete list of rows
  deleteRows(ids: number[] = []): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    // const url = this.API_URL + '/deleteItems';
    const url = this.API_URL;
    const body = { ids };
    return this.http.put(url, body).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('DELETE SELECTED ITEMS', ids, err);
        return of([]);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }
  find(tableState: ITableState, urlSuffix: string): Observable<TableResponseModel<T>> {
    const url = this.API_URL;
    this._errorMessage.next('');
    return this.http.get<TableResponseModel<T>>(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('FIND ITEMS', err);
        return of({ content: [], number: 0, totalPages: 0, size: 0, items: [], total: 0 });
      })
    );
  }

  public fetch(urlSuffix: string = "") {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.find(this._tableState$.value, urlSuffix)
      .pipe(
        tap((res: TableResponseModel<T>) => {
          let items = res.content ? res.content : res.items;
          this._items$.next(items);
          // this.patchStateWithoutFetch({
          //   paginator: this._tableState$.value.paginator.recalculatePaginator(
          //     res.total
          //   ),
          // });
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            items: [],
            total: 0
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
          const itemIds = this._items$.value.map((el: T) => {
            const item = (el as unknown) as BaseModel;
            return item.id;
          });
          // this.patchStateWithoutFetch({
          //   grouping: this._tableState$.value.grouping.clearRows(itemIds),
          // });
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }

  public fetchRows(dataTablesParameters: any, callback: (_: any) => void = (_:any) => {}) {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.findRow(this._tableState$.value, dataTablesParameters)
      .pipe(
        tap((res: DataTablesResponse<T>) => {
          this._items$.next(res.data);
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            data: [],
            total: 0
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
          const itemIds = this._items$.value.map((el: T) => {
            const item = (el as unknown) as BaseModel;
            return item.id;
          });
        })
      )
      .subscribe(resp => {
        callback(resp);
      });
    this._subscriptions.push(request);
  }

  // Base Methods
  public patchState(patch: Partial<ITableState>, dataTablesParameters: any) {
    this.patchStateWithoutFetch(patch);
    this.fetchRows(dataTablesParameters);
  }

  public patchStateWithoutFetch(patch: Partial<ITableState>) {
    const newState = Object.assign(this._tableState$.value, patch);
    this._tableState$.next(newState);
  }
}
