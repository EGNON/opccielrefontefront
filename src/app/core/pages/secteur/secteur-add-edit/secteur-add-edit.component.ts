import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {of, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first, tap} from "rxjs/operators";
import {SecteurService} from "../../../../crm/services/secteur.service";
import {Secteur} from "../../../../crm/models/secteur.model";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {PageInfoService} from "../../../../template/_metronic/layout";

@Component({
    selector: 'app-secteur-add-edit',
    templateUrl: './secteur-add-edit.component.html',
    styleUrls: ['./secteur-add-edit.component.scss'],
    standalone: false
})
export class SecteurAddEditComponent implements OnInit, OnDestroy{
  id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  secteurForm: FormGroup;
  private subscriptions: Subscription[] = [];

  @Input() entity: any;
  @Input() isModal: boolean = false;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    public modal: NgbActiveModal,
    private secteurService: SecteurService,
    private pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.secteurForm = this.fb.group(
      {
        libelleSecteur: [null, Validators.required]
      }
    );

    if(this.id)
    {
      this.pageInfo.updateTitle("Modification de secteur")
      const sb = this.secteurService.getEntityById(this.id)
        .pipe(first())
        .subscribe(x => this.secteurForm.patchValue(x));
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout de secteur")
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() { return this.secteurForm.controls; }

  onSaveEntity()
  {
    this.isLoading = true;
    if(this.secteurForm.invalid) return;
    const sb = this.saveEntity().pipe(
        tap((data:any) => {
          this.passEntry.emit(data);
          this.modal.close()
        }),
        catchError((err) => {
          this.modal.dismiss(err);
          return of(undefined);
        }),
        finalize(() => {
          this.isLoading = false;
          if (!this.isModal) this.router.navigate(['/app/standard/parametre/secteur']);
        })
      )
      .subscribe();
    this.subscriptions.push(sb);
  }

  saveEntity() {
    const secteur: Secteur = {
      ...this.secteurForm.value,
      idSecteur: this.id ? this.id : null,
      id: this.id ? this.id : null
    };
    return this.id
      ? this.secteurService.update(secteur)
      : this.secteurService.create(secteur);
  }
}
