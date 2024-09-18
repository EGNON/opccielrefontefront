import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Observable } from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';
import {Permission} from "../../../models/permission";
import {ResponseModel} from "../../../../crm/models/table.model";
import {PermissionService} from "../../../services/permission.service";
import {Config} from "datatables.net";

@Component({
  selector: 'app-permission-listing',
  templateUrl: './permission-listing.component.html',
  styleUrls: ['./permission-listing.component.scss']
})
export class PermissionListingComponent implements OnInit, AfterViewInit, OnDestroy {

  isCollapsed1 = false;

  isLoading = false;

  datatableConfig: Config = {};

  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  // Single model
  permission$: Observable<ResponseModel<Permission>>;
  permissionModel: Permission = {
    id: 0,
    idPermis: 0,
    codePermis: '',
    libellePermis: '',
    description: '',
    estPrincipale: false,
    estParDefaut: false,
    etat: false
  };

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = {};

  constructor(private apiService: PermissionService, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.apiService.datatable(dataTablesParameters).subscribe(resp => {
          console.log("Template === ", resp);
          callback(resp.data);
        });
      },
      columns: [
        {
          title: 'Intitulé', data: 'libellePermis',
          render: (data: any, type: any, full: Permission) => `<a href="javascript:;" data-action="view" data-id="${full.idPermis}" class="text-gray-800 text-hover-primary mb-1">${data}</a>`
        },
        {
          title: 'Assignée à', data: null, render: function (data, type, row) {
            if (Array.isArray(data.roles)) {
              return data.roles.map(function (role: any) {
                const color = ['info', 'success', 'warning', 'danger', 'primary'][Math.floor(Math.random() * 5)];
                return `<a href="#" class="badge fs-7 m-1 badge-light-${color}">${role.name}</a>`;
              }).join('');
            } else {
              return '';
            }
          },
          orderData: [1],
          orderSequence: ['asc', 'desc'],
          type: 'string',
        },
        // {
        //   title: 'Created Date', data: 'created_at', render: function (data) {
        //     return moment(data).format('DD MMM YYYY, hh:mm a');;
        //   }
        // }
      ],
    };
  }

  delete(id: number) {
    this.apiService.delete(id).subscribe(() => {
      this.reloadEvent.emit(true);
    });
  }

  edit(id: number) {
    this.permission$ = this.apiService.getById(id);
    this.permission$.subscribe((resp: any) => {
      this.permissionModel = resp.data;
    });
  }

  create() {
    this.permissionModel = {
      id: 0,
      idPermis: 0,
      codePermis: '',
      libellePermis: '',
      description: '',
      estPrincipale: false,
      estParDefaut: false,
      etat: false
    };
  }

  onSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      return;
    }

    this.isLoading = true;

    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      text: this.permissionModel.id != null && this.permissionModel.id > 0 ? 'Permission modifiée avec succès!' : 'Permission enregistrée avec succès!',
    };
    const errorAlert: SweetAlertOptions = {
      icon: 'error',
      title: 'Erreur!',
      text: '',
    };

    const completeFn = () => {
      this.isLoading = false;
    };

    const updateFn = () => {
      this.apiService.update(this.permissionModel).subscribe({
        next: () => {
          this.showAlert(successAlert);
          this.reloadEvent.emit(true);
        },
        error: (error) => {
          errorAlert.text = this.extractText(error.error);
          this.showAlert(errorAlert);
          this.isLoading = false;
        },
        complete: completeFn,
      });
    };

    const createFn = () => {
      this.apiService.create(this.permissionModel).subscribe({
        next: () => {
          this.showAlert(successAlert);
          this.reloadEvent.emit(true);
        },
        error: (error) => {
          errorAlert.text = this.extractText(error.error);
          this.showAlert(errorAlert);
          this.isLoading = false;
        },
        complete: completeFn,
      });
    };

    if (this.permissionModel.id != null && this.permissionModel.id > 0) {
      updateFn();
    } else {
      createFn();
    }
  }

  extractText(obj: any): string {
    var textArray: string[] = [];

    for (var key in obj) {
      if (typeof obj[key] === 'string') {
        // If the value is a string, add it to the 'textArray'
        textArray.push(obj[key]);
      } else if (typeof obj[key] === 'object') {
        // If the value is an object, recursively call the function and concatenate the results
        textArray = textArray.concat(this.extractText(obj[key]));
      }
    }

    // Use a Set to remove duplicates and convert back to an array
    var uniqueTextArray = Array.from(new Set(textArray));

    // Convert the uniqueTextArray to a single string with line breaks
    var text = uniqueTextArray.join('\n');

    return text;
  }

  showAlert(swalOptions: SweetAlertOptions) {
    let style = swalOptions.icon?.toString() || 'success';
    if (swalOptions.icon === 'error') {
      style = 'danger';
    }
    this.swalOptions = Object.assign({
      buttonsStyling: false,
      confirmButtonText: "Ok, got it!",
      customClass: {
        confirmButton: "btn btn-" + style
      }
    }, swalOptions);
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }

  ngOnDestroy(): void {
  }
}
