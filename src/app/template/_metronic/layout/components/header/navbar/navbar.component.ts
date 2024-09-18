import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, interval, Subscription, switchMap} from "rxjs";
import {tap} from "rxjs/operators";
import {MsgHelpersService} from "../../../../../../crm/services/notifications/msg-helpers.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Input() appHeaderDefaulMenuDisplay!: boolean;
  @Input() isRtl!: boolean;

  itemClass: string = 'ms-1 ms-lg-3';
  btnClass: string = 'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px';
  userAvatarClass: string = 'symbol-35px symbol-md-40px';
  btnIconClass: string = 'fs-2 fs-md-1';

  countAlerte$ = new BehaviorSubject(0);
  tabAlertes$ = new BehaviorSubject<never[]>([]);

  private readonly INTERVAL = 1000;
  private subscriptions: Subscription[] = [];

  constructor(private msgHelpersService: MsgHelpersService) {}

  ngOnInit(): void {
    const sb = interval(this.INTERVAL) // Repeat every 10 seconds
      .pipe(
        switchMap(() => this.msgHelpersService.notificationsToUser()),
        tap(resp => {
          this.countAlerte$.next(resp.length);
          this.tabAlertes$.next(resp as never[]);
        })
      )
      .subscribe();
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
