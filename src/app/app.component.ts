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

@Component({
  // tslint:disable-next-line:component-selector
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(
    private translationService: TranslationService,
    private modeService: ThemeModeService
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

  ngOnInit() {
    this.modeService.init();
  }

  ngAfterViewInit(): void {
    $(document).ready(function(){
      // console.log($(".select2"));
      // $('.select2').select2();
    });
  }
}

