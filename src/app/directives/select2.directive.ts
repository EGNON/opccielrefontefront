import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import {NgControl} from "@angular/forms";
import {environment} from "../../environments/environment";
import {AuthService} from "../core/modules/auth";
import "select2";
declare var $: any;

@Directive({
  selector: '[appSelect2]'
})
export class Select2Directive implements AfterViewInit, OnChanges {
  select2: any;

  @Input()
  dataUrl: string;

  @Input()
  placeholder: string;

  @Output()
  itemSelected = new EventEmitter<boolean>();

  constructor(
    private el: ElementRef,
    private control: NgControl,
    private authService: AuthService) {}

  ngAfterViewInit(): void {
    if (this.dataUrl) {
      this.initializeSelect2();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    /*const dataUrl = changes.dataUrl;

    // There are instances that at first dataUrl are not available.
    if (dataUrl.currentValue) {
      this.initializeSelect2();
    }*/
    this.initializeSelect2();
  }

  // TODO: Use select2 transport option instead of ajax
  initializeSelect2(): void {
    let token: any = this.authService.currentUserTokenValue.token;
    const fullUrl = environment.apiUrl + this.dataUrl;
    /*this.select2 = $(this.el.nativeElement).select2({
      allowClear: true,
      placeholder: this.placeholder || 'Please select',
      ajax: {
        url: fullUrl,
        headers: {'Authorization': 'Bearer ' + token, 'Accept': '*!/!*'},
        /!*data: function (params: any) {
          const query = {
            search: params.term,
            page: params.page || 1,
          };
          console.log("QUERY === ", query);
          return query;
        },*!/
        processResults: function (data: any) {
          console.log("RES === ", data);
          return {
            results: data.results,
            pagination: data.pagination
          };
        }
      }
    });*/

    this.select2 = $(this.el.nativeElement).select2();

    this.select2.on('select2:select', (event:any) => {
      const selectedItem = event.params.data;
      console.log("SELECT === ", selectedItem);
      this.control.control?.setValue(selectedItem.id);
      this.itemSelected.emit(selectedItem);
    });

    this.select2.on('select2:open', (event:any) => {
      this.control.control?.markAsTouched();
    });
  }

  clear() {
    if (this.select2) {
      this.select2.val(null).trigger('change');
      this.control.control?.setValue(null);
    }
  }
}
