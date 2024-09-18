import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import {Observable} from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';
import {RoleService} from "../../../../crm/services/access/role.service";
import {Role} from "../../../../crm/models/access/role.model";
import {ResponseModel} from "../../../../crm/models/table.model";
import {PermissionService} from "../../../services/permission.service";
import {Permission} from "../../../models/permission";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-role-listing',
  templateUrl: './role-listing.component.html',
  styleUrls: ['./role-listing.component.scss']
})
export class RoleListingComponent implements OnInit, AfterViewInit, OnDestroy {

  isCollapsed1 = false;

  isLoading = false;

  roles$: Observable<ResponseModel<Role>>;
  rolesSelect2: any[] = [];

  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  // Single model
  role$: Observable<ResponseModel<Role>>;
  permissions$: Observable<Permission[]>;
  roleModel: any = { id: 0, idRole: 0, nom: '', description: '', permissions: [], utilisateurs1: [] };

  @ViewChild('formModal')
  formModal: TemplateRef<any>;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = {};

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog mw-650px',
  };

  private clickListener: () => void;

  constructor(
    private apiService: RoleService,
    private permissionService: PermissionService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private modalService: NgbModal) { }

  ngAfterViewInit(): void {
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn');
      if (closestBtn) {
        const { action, id } = closestBtn.dataset;

        switch (action) {
          case 'view':
            break;

          case 'create':
            this.create();
            this.modalService.open(this.formModal, this.modalConfig);
            break;

          case 'edit':
            this.edit(id);
            this.modalService.open(this.formModal, this.modalConfig);
            break;

          case 'delete':
            break;
        }
      }
    });
  }

  ngOnInit(): void {
    this.roles$ = this.apiService.get();
    this.permissions$ = this.permissionService.afficherTous().pipe(
      map(resp => resp.data as Permission[])
    );
  }

  delete(id: number) {
    this.apiService.delete(id).subscribe(() => {});
  }

  edit(id: number) {
    this.role$ = this.apiService.getById(id);
    this.role$.subscribe((res: ResponseModel<Role>) => {
      this.roleModel = {idRole: res.data.idRole, nom: res.data.nom, permissions: [], utilisateurs1: []};
      res.data.permissions.forEach(rp => {
        this.roleModel.permissions.push({
          id: {
            idRole: res.data.idRole,
            idPermis: rp.permission.idPermis
          },
          permission: {
            id: rp.permission.idPermis,
            idPermis: rp.permission.idPermis
          },
          role: {
            idRole: res.data.idRole,
          },
          etat: true
        });
      });
      // console.log("Edit role === ", this.roleModel);
    });
  }

  create() {
    this.roleModel = { id: 0, idRole: 0, nom: '', description: '', permissions: [], utilisateurs1: [] };
  }

  onSubmit(event: Event, myForm: NgForm) {
    // console.log("Form Value === ", myForm);
    return;
    if (myForm && myForm.invalid) {
      return;
    }

    this.isLoading = true;

    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      text: this.roleModel.id != null && this.roleModel.id > 0 ? 'User updated successfully!' : 'User created successfully!',
    };
    const errorAlert: SweetAlertOptions = {
      icon: 'error',
      title: 'Error!',
      text: '',
    };

    const completeFn = () => {
      this.isLoading = false;
      this.modalService.dismissAll();
      this.roles$ = this.apiService.get();
      this.cdr.detectChanges();
    };

    const updateFn = () => {
      // console.log("Form value === ", this.roleModel);
      this.apiService.update(this.roleModel).subscribe({
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
      // console.log("Form value === ", this.roleModel);
      this.apiService.create(this.roleModel).subscribe({
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

    if (this.roleModel.idRole != null && this.roleModel.idRole > 0) {
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
    if (this.clickListener) {
      this.clickListener();
    }
    this.modalService.dismissAll();
  }

  onCheckChange($event: any, permission: any) {
    if($event.target.checked){
      // console.log("Event === ", $event);
      let rolePermission: any = {
        id: {idPermis: permission.idPermis, idRole: this.roleModel.idRole},
        permission: {
          idPermis: permission.idPermis,
          libellePermis: permission.libellePermis
        }
      };
      this.roleModel.permissions.push(rolePermission);
    }
    else{

    }
  }
}
