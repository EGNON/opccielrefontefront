import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {of, Subscription} from "rxjs";
import {catchError, finalize, first} from "rxjs/operators";
import {MonnaieService} from "../../../../crm/services/monnaie.service";
import {Monnaie} from "../../../../crm/models/monnaie.model";
import {PageInfoService} from "../../../../template/_metronic/layout";

@Component({
  selector: 'app-monnaie-add-edit',
  templateUrl: './monnaie-add-edit.component.html',
  styleUrls: ['./monnaie-add-edit.component.scss']
})
export class MonnaieAddEditComponent implements OnInit, OnDestroy{
  id?: string;
  isLoading = false;
  submitting = false;
  submitted = false;
  monnaieForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private monnaieService: MonnaieService,
    private pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.monnaieForm = this.fb.group(
      {
        codeMonnaie: [null, Validators.required],
        nom: [null, Validators.required]
      }
    );

    if(this.id)
    {
      this.pageInfo.updateTitle("Modification de monnaie")
      const sb = this.monnaieService.getEntityById(this.id)
        .pipe(first())
        .subscribe(x => this.monnaieForm.patchValue(x));
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout de monnaie")
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() { return this.monnaieForm.controls; }

  onSaveMonnaie()
  {
    this.isLoading = true;
    if(this.monnaieForm.invalid) return;
    const sb = this.saveMonnaie()
      .pipe(
        catchError((err) => {
          return of(undefined);
        }),
        finalize(() => {
          this.isLoading = false;
          this.router.navigate(['/app/standard/parametre/monnaie']);
        })
      )
      .subscribe();
    this.subscriptions.push(sb);
  }

  saveMonnaie() {
    const monnaie: Monnaie = {
      ...this.monnaieForm.value,
      id: this.id ? this.id : null
    };
    return this.id
      ? this.monnaieService.updateRow(monnaie)
      : this.monnaieService.createRow(monnaie);
  }
}
