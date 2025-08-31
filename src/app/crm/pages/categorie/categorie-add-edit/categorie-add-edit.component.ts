import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {delay, of, Subscription, tap} from "rxjs";
import {catchError, finalize, first} from "rxjs/operators";
import {CategorieService} from "../../../services/categorie.service";
import {Categorie} from "../../../models/categorie.model";
import {PageInfoService} from "../../../../template/_metronic/layout";

@Component({
    selector: 'app-categorie-add-edit',
    templateUrl: './categorie-add-edit.component.html',
    styleUrls: ['./categorie-add-edit.component.scss'],
    standalone: false
})
export class CategorieAddEditComponent implements OnInit, OnDestroy{
  id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  categorieForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private categorieService: CategorieService,
    private pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.categorieForm = this.fb.group(
      {
        libelle: [null, Validators.required]
      }
    );

    if(this.id)
    {
      this.pageInfo.updateTitle("Modification de catégorie")
      const sb = this.categorieService.getEntityById(this.id)
        .pipe(first())
        .subscribe(x => this.categorieForm.patchValue(x));
      this.subscriptions.push(sb);
    }
    else {
      this.pageInfo.updateTitle("Ajout de catégorie");
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  onSaveCategorie()
  {
    this.isLoading = true;
    if(this.categorieForm.invalid) return;
    const sb = this.saveCategorie()
      .pipe(
        catchError((err) => {
          return of(undefined);
        }),
        finalize(() => {
          this.isLoading = false;
          this.router.navigate(['/crm/standard/parametre/categorie']);
        })
      )
      .subscribe();
    this.subscriptions.push(sb);
  }

  saveCategorie() {
    const categorie: Categorie = {
      ...this.categorieForm.value,
      idCategorie: this.id ? this.id : null,
      id: this.id ? this.id : null
    };
    return this.id
      ? this.categorieService.update(categorie)
      : this.categorieService.create(categorie);
  }
}
