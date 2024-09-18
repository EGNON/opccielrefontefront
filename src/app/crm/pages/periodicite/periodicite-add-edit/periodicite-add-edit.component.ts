import {Component, OnDestroy, OnInit} from '@angular/core';
import {of, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";
import {PeriodiciteService} from "../../../services/periodicite.service";
import {PageInfoService} from "../../../../template/_metronic/layout";

@Component({
  selector: 'app-periodicite-add-edit',
  templateUrl: './periodicite-add-edit.component.html',
  styleUrls: ['./periodicite-add-edit.component.scss']
})
export class PeriodiciteAddEditComponent implements OnInit, OnDestroy {
  id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  entityForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    public entityService: PeriodiciteService,
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
        idPeriodicite: [this.id],
        libelle: [null, Validators.required],
      }
    );

    if (this.id) {
      this.pageInfo.updateTitle("Modification de périodicité");
      const sb = this.entityService.getEntityById(this.id)
        .pipe(first())
        .subscribe(x => this.entityForm.patchValue(x));
      this.subscriptions.push(sb);
    }
    else {
      this.pageInfo.updateTitle("Ajout de périodicité");
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
          this.router.navigate(['/crm/standard/parametre/periodicite']);
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
