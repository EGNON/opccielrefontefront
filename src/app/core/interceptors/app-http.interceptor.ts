import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {AuthService} from "../modules/auth";
import {LibraryService} from "../modules/helpers/library.service";

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(
    private libService: LibraryService,
    private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(!request.url.includes("/auth/login") && !request.url.includes("/auth/me"))
    {
      let token: any = this.authService.currentUserTokenValue.token;
      if(!token)
        return next.handle(request);
      let req = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token).set('Accept', '*/*')
      });
      return next.handle(req).pipe(
        tap((event: HttpEvent<any>) => {
          // console.log('Incoming HTTP response', event);
        })
      );
    } else return next.handle(request);
  }
}
