import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {QualiteService} from "../../../../crm/services/qualite.service";
import {catchError, finalize, map} from "rxjs/operators";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StatutPersonneService} from "../../../../crm/services/statut.personne.service";
import {of} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-changer-qualite-personne',
    templateUrl: './changer-qualite-personne.component.html',
    styleUrl: './changer-qualite-personne.component.scss',
    standalone: false
})
export class ChangerQualitePersonneComponent implements OnInit, AfterViewInit, OnDestroy{
  id?: number;
  phOrPm: boolean = true;

  qualites$: any;
  form: FormGroup;
  submitting = false;
  submitted = false;

  constructor(
    private statutPersonneService: StatutPersonneService,
    private fb: FormBuilder,
    private qualiteService: QualiteService,
    private cdr: ChangeDetectorRef,
    public modal: NgbActiveModal) {}

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        qualite: [
          null,
          [Validators.required]
        ]
      }
    );
    this.afficherListeQualites();
  }

  afficherListeQualites() {
    if(this.phOrPm)
    {
      this.qualites$ = this.qualiteService.afficherTousPh(+this.id!).pipe(
        map(resp => resp.data)
      );
    }
    else
    {
      this.qualites$ = this.qualiteService.afficherTousPm(+this.id!).pipe(
        map(resp => resp.data)
      );
    }
  }

  save() {
    this.submitting = true;
    let statut: any = {
      personne: {id: this.id, idPersonne: this.id},
      qualite: this.form.value.qualite,
      personnel: null
    }
    this.statutPersonneService.ajouterStatutSelonQualite(statut, this.form.value.qualite.libelleQualite)
      .pipe(
        catchError((err) => {
          this.submitting = false;
          return of(err.message);
        }),
        finalize(() => {
          this.submitted = false;
          this.submitting = false;

          console.log("FORM === ", this.form);
          // this.modal.dismiss();
          this.afficherListeQualites();
          this.cdr.detectChanges();
        })
      ).subscribe();
  }

  close() {
    this.modal.dismiss();
  }
}
