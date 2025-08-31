import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {of, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first, tap} from "rxjs/operators";
import {ProfessionService} from "../../../../crm/services/profession.service";
import {Profession} from "../../../../crm/models/profession.model";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {PageInfoService} from "../../../../template/_metronic/layout";
@Component({
    selector: 'app-profession-add-edit',
    templateUrl: './profession-add-edit.component.html',
    styleUrls: ['./profession-add-edit.component.scss'],
    standalone: false
})
export class ProfessionAddEditComponent implements OnInit, OnDestroy{
  id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  professionForm: FormGroup;
  private subscriptions: Subscription[] = [];

  @Input() entity: any;
  @Input() isModal: boolean = false;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    public modal: NgbActiveModal,
    private professionService: ProfessionService,
    private pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.professionForm = this.fb.group(
      {
        libelleProfession: [null, Validators.required]
      }
    );

    if(this.id)
    {
      this.pageInfo.updateTitle("Modification de profession")
      const sb = this.professionService.getEntityById(this.id)
        .pipe(first())
        .subscribe(x => this.professionForm.patchValue(x));
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout de profession")
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() { return this.professionForm.controls; }

  onSaveEntity()
  {
    this.isLoading = true;
    if(this.professionForm.invalid) return;
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
          if (!this.isModal) this.router.navigate(['/app/standard/parametre/profession']);
        })
      )
      .subscribe();
    this.subscriptions.push(sb);
  }

  saveEntity() {
    const profession: Profession = {
      ...this.professionForm.value,
      idProf: this.id ? this.id : null,
      id: this.id ? this.id : null
    };
    return this.id
      ? this.professionService.update(profession)
      : this.professionService.create(profession);
  }
}
