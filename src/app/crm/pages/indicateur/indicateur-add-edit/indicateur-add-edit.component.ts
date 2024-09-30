import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {of, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";
import {IndicateurService} from "../../../services/indicateur.service";
import {PageInfoService} from "../../../../template/_metronic/layout";

@Component({
  selector: 'app-indicateur-add-edit',
  templateUrl: './indicateur-add-edit.component.html',
  styleUrls: ['./indicateur-add-edit.component.scss']
})
export class IndicateurAddEditComponent implements OnInit, OnDestroy{
  id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  entityForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private entityService: IndicateurService,
    private pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.entityForm = this.fb.group(
      {
        idIndicateur: [this.id],
        id: [this.id],
        code: [null, Validators.required],
        libelle: [null, Validators.required]
      }
    );

    if(this.id)
    {
      this.pageInfo.updateTitle("Modification d'indicateur")
      const sb = this.entityService.getEntityById(this.id)
        .pipe(first())
        .subscribe(x => this.entityForm.patchValue(x));
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout d'indicateur")
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() { return this.entityForm.controls; }

  onSaveEntity()
  {
    this.isLoading = true;
    if(this.entityForm.invalid) return;
    const sb = this.saveEntity()
      .pipe(
        catchError((err) => {
          return of(undefined);
        }),
        finalize(() => {
          this.isLoading = false;
          this.router.navigate(['/crm/standard/parametre/indicateur']);
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
