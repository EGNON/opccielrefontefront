// import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
// declare var $: any;
//
// @Component({
//   selector: 'body[root]',
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.scss',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class AppComponent  implements OnInit {
//   title = 'ebourse';
//
//   ngOnInit(): void {
//   }
//
//   jQueryExampleModal() { // to show a modal with dummyId
//     $('#dummyId').modal('show');
//   }
// }



import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { TranslationService } from './template/modules/i18n';
// language list
import { locale as enLang } from './template/modules/i18n/vocabs/en';
import { locale as chLang } from './template/modules/i18n/vocabs/ch';
import { locale as esLang } from './template/modules/i18n/vocabs/es';
import { locale as jpLang } from './template/modules/i18n/vocabs/jp';
import { locale as deLang } from './template/modules/i18n/vocabs/de';
import { locale as frLang } from './template/modules/i18n/vocabs/fr';
import { ThemeModeService } from './template/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
declare var $:JQueryStatic;
import "select2";
import { AuthService } from './core/modules/auth';
import { TaskNotificationService } from './services/TaskNotificationService';
import { LocalService } from './services/local.service';

@Component({
    // tslint:disable-next-line:component-selector
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'body[root]',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(
    private translationService: TranslationService,
    private modeService: ThemeModeService,
    private authService: AuthService,
    private localStore: LocalService,
    private notificationService: TaskNotificationService,
  ) {
    // register translations
    this.translationService.loadTranslations(
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang
    );
  }

  // ngOnInit() {
  //   this.modeService.init();
  // }
  ngOnInit(): void {
  
    this.modeService.init();
  const opcvmIsConnected = localStorage.getItem("opcvmIsConnected");

  // Récupération des données déchiffrées
  const currentOpcvm = this.localStore.getData("currentOpcvm");
  const currentSeance = this.localStore.getData("currentSeance");

  if (
    opcvmIsConnected === "1" &&
    currentOpcvm &&
    currentOpcvm.idOpcvm &&
    currentSeance
  ) {

    // Restaurer l'OPCVM dans AuthService
    this.authService.currentOpcvmSubject.next(currentOpcvm);

    // Réactiver les notifications
    this.notificationService.activerNotifications();

  } else {

    // État incomplet : ne pas démarrer les notifications
    this.notificationService.desactiverNotifications();

  }
}
//   ngOnInit(): void {
  
//     this.modeService.init();
//   const opcvmIsConnected = window.localStorage.getItem("opcvmIsConnected");

//   const currentOpcvm = this.localStore.getData("currentOpcvm");
//   const currentSeance = this.localStore.getData("currentSeance");

//   if (
//     opcvmIsConnected === "1" &&
//     currentOpcvm &&
//     currentSeance
//   ) {

//     // Restaurer l'OPCVM sélectionné
//     this.authService.currentOpcvmSubject.next(currentOpcvm);

//     // Restaurer la séance courante
//     // this.authService.currentSeanceSubject.next(currentSeance);

//     // Réactiver les notifications
//     this.notificationService.activerNotifications();

//   } else {

//     // Aucun OPCVM sélectionné : arrêter les notifications
//     this.notificationService.desactiverNotifications();

//   }
// }
// ngOnInit(): void {

//    this.modeService.init();

//   const opcvmIsConnected = window.localStorage.getItem("opcvmIsConnected");
//   const currentOpcvmData = window.localStorage.getItem("currentOpcvm");
//   const currentSeanceData = window.localStorage.getItem("currentSeance");

//   if (
//     opcvmIsConnected === "1" &&
//     currentOpcvmData &&
//     currentSeanceData
//   ) {
//     try {
//       const currentOpcvm = JSON.parse(currentOpcvmData);
//       const currentSeance = JSON.parse(currentSeanceData);

//       // Restaurer l'OPCVM sélectionné
//       this.authService.currentOpcvmSubject.next(currentOpcvm);

//       // Réactiver les notifications
//       this.notificationService.activerNotifications();

//     } catch (error) {
//       console.error("Erreur lors de la restauration de l'OPCVM :", error);
//       this.notificationService.desactiverNotifications();
//     }
//   } else {
//     this.notificationService.desactiverNotifications();
//   }
// }
  ngAfterViewInit(): void {
    $(document).ready(function(){
      // console.log($(".select2"));
      // $('.select2').select2();
    });
  }
}

