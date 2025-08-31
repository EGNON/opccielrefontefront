import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {of, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";
import {ProduitService} from "../../../../crm/services/produit.service";
import {PageInfoService} from "../../../../template/_metronic/layout";

@Component({
    selector: 'app-produit-add-edit',
    templateUrl: './produit-add-edit.component.html',
    styleUrls: ['./produit-add-edit.component.scss'],
    standalone: false
})
export class ProduitAddEditComponent implements OnInit, OnDestroy {
  id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  entityForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    public entityService: ProduitService,
    public pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        idProd: [this.id],
        designation: [null, Validators.required],
      }
    );

    if (this.id) {
      this.pageInfo.updateTitle("Modification de produit")
      const sb = this.entityService.getEntityById(this.id)
        .pipe(first())
        .subscribe(x => this.entityForm.patchValue(x));
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout de produit")
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() {
    return this.entityForm.controls;
  }

  onSaveEntity() {
    this.isLoading = true;
    this.submitted = true;
    if (this.entityForm.invalid) return;
    const sb = this.saveEntity()
      .pipe(
        catchError((err) => {
          return of(undefined);
        }),
        finalize(() => {
          this.submitted = false;
          this.isLoading = false;
          this.router.navigate(['/app/standard/parametre/produit']);
        })
      )
      .subscribe();
    this.subscriptions.push(sb);
  }

  saveEntity() {
    const entity: any = {
      ...this.entityForm.value
    };
    return this.id
      ? this.entityService.updateRow(entity)
      : this.entityService.createRow(entity);
  }
}
