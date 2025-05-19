import {inject, Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription, tap} from 'rxjs';
import {catchError, finalize, map, switchMap} from 'rxjs/operators';
import {AuthModel} from '../models/auth.model';
import {ActivatedRoute, ActivationStart, Params, Router, RoutesRecognized} from '@angular/router';
import {AuthHTTPService} from "./auth-http/auth-http.service";
import {environment} from "../../../../../environments/environment";
import {Utilisateur} from "../../../../crm/models/access/utilisateur.model";
import {UtilisateurRolePermission} from "../models/utilisateur-role-permission.model";
import {Opcvm} from "../../../models/opcvm";
import {HttpClient} from "@angular/common/http";

export type UserType = Utilisateur | undefined;
export type OpcvmType = Opcvm | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = [];
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserType>;
  currentOpcvm$: Observable<any>;
  currentUserToken$: Observable<any>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  currentOpcvmSubject: BehaviorSubject<any>;
  isLoadingSubject: BehaviorSubject<boolean>;
  currentUserTokenSubject: BehaviorSubject<any>;
  currentUserPermissionsSubject: BehaviorSubject<UtilisateurRolePermission[]>;
  currentRoleSubject: BehaviorSubject<string>;

  get currentRoleValue(): string {
    return this.currentRoleSubject.value;
  }

  set currentRoleValue(role: any) {
    this.currentRoleSubject.next(role);
  }

  get currentOpcvmValue(): OpcvmType {
    return this.currentOpcvmSubject.value;
  }

  set currentOpcvmValue(opcvm: any) {
    this.currentOpcvmSubject.next(opcvm);
  }

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  get currentUserTokenValue(): any {
    return this.currentUserTokenSubject.value;
  }

  set currentUserTokenValue(token: any) {
    this.currentUserTokenSubject.next(token);
  }

  get currentUserRolePermissionsValue(): any {
    return this.currentUserPermissionsSubject.value;
  }

  set currentUserRolePermissionsValue(token: any) {
    this.currentUserPermissionsSubject.next(token);
  }

  constructor(
    private http: HttpClient,
    private authHttpService: AuthHTTPService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentOpcvmSubject = new BehaviorSubject<any>(undefined);
    this.currentUserTokenSubject = new BehaviorSubject<any>(undefined);
    this.currentUserPermissionsSubject = new BehaviorSubject<any>([]);
    this.currentRoleSubject = new BehaviorSubject<any>("");
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.currentOpcvm$ = this.currentOpcvmSubject.asObservable();
    this.currentUserToken$ = this.currentUserTokenSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  // public methods
  login(username: string, password: string): Observable<UserType> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(username, password).pipe(
      map((resp: any) => {
        return this.setAuthFromLocalStorage(resp.data);
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    this.currentUserValue = undefined;
    this.currentUserTokenSubject.next(null);
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  currentSeance(idOpcvm: any) {
    return this.http.post<any>(`${environment.apiUrl}/libraries/${idOpcvm}`, null);
  }

  getUserByToken(): Observable<UserType> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }
    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken(auth.authToken).pipe(
      map((resp: any) => {
        let user = null;
        if (resp && resp.data) {
          this.currentUserTokenSubject.next(resp.data);
          this.currentUserSubject.next(resp.data.user);

          user = resp.data.user;
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  getCurrentOpcvm() {
    return this.currentOpcvm$;
  }

  // need create new user then login
  registration(user: Utilisateur): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.username, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.authHttpService
      .changePassword(this.currentUserValue?.username, oldPassword, newPassword)
      .pipe(
        // tap((result) => console.log("CHANGE = ", result)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.authToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      return JSON.parse(lsValue);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  LocalStorageManager = {
    setValue: function(key, value) {
      window.localStorage.setItem(key, JSON.stringify(value));
    },
    getValue: function(key) {
      try {
        return JSON.parse(window.localStorage.getItem(key));
      } catch (e) {
        console.error(e);
        return undefined;
      }
    }
  };

  isGrantedRole(role: string)
  {
     return true;

    if(!this.currentUserValue || !role)
      return false;

    this.currentRoleSubject.next(role);

    if(this.currentUserValue && !this.currentUserValue.roles1)
      return false;

    const hasRole = role.length > 0 ? this.currentUserValue.roles1?.filter(u => u.role.nom == role.trim()).length > 0 : false;
    const hasAnyPermission = this.getUserPermissionsOnRole().length > 0;

    return hasRole && hasAnyPermission;
  }

  getUserRoles() {
    return this.currentUserValue != null && this.currentUserValue.roles1.length > 0 ? this.currentUserValue.roles1 : [];
  }

  getUserPermissionsOnRole() {
    let permissions: UtilisateurRolePermission[] = [];
    if(!this.currentUserValue)
      return [];

    if(this.currentUserValue && !this.currentUserValue.roles1)
      return [];

    if(this.currentUserValue && this.currentUserValue.roles1 && this.currentRoleValue)
    {
      permissions = this.currentUserValue.permissions.filter(u => u.role.nom == this.currentRoleValue);
      this.currentUserPermissionsSubject.next(permissions);
      this.currentUserPermissionsSubject.complete();
    }

    return permissions;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
