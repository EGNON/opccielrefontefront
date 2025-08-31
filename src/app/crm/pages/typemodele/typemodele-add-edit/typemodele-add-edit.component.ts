import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {of, Subscription} from "rxjs";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";
import {TypemodeleService} from "../../../services/typemodele.service";

@Component({
    selector: 'app-typemodele-add-edit',
    templateUrl: './typemodele-add-edit.component.html',
    styleUrl: './typemodele-add-edit.component.scss',
    standalone: false
})
export class TypemodeleAddEditComponent implements OnInit, OnDestroy {
  id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  entityForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    public entityService: TypemodeleService,
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
        idTypeModele: [this.id],
        libelleTypeModele: [null, Validators.required],
      }
    );

    if (this.id) {
      this.pageInfo.updateTitle("Modification de type modèle");
      const sb = this.entityService.getById(this.id)
        .pipe(first())
        .subscribe(x => this.entityForm.patchValue(x.data));
      this.subscriptions.push(sb);
    }
    else {
      this.pageInfo.updateTitle("Ajout de type modèle");
    }
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
          this.router.navigate(['/crm/standard/parametre/typemodele']);
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
      ? this.entityService.update(entity)
      : this.entityService.create(entity);
  }
}

