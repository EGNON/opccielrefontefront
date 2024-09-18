import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {of, Subscription, tap} from "rxjs";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";
import {ModeetablissementService} from "../../../services/modeetablissement.service";
import {Modeetablissement} from "../../../models/modeetablissement.model";
import {NgClass, NgIf} from "@angular/common";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {PageInfoService} from "../../../../template/_metronic/layout";

@Component({
  selector: 'app-modeetablissement-add-edit',
  templateUrl: './modeetablissement-add-edit.component.html',
  styleUrl: './modeetablissement-add-edit.component.scss'
})
export class ModeetablissementAddEditComponent  implements OnInit, OnDestroy{
  id?: string;
  isLoading = false;
  submitting = false;
  submitted = false;
  formData: FormGroup;
  private subscriptions: Subscription[] = [];

  @Input() entity: any;
  @Input() isModal: boolean = false;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    public modal: NgbActiveModal,
    private modeEtablissementService: ModeetablissementService,
    private pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.formData = this.fb.group(
      {
        libelle: [null, Validators.required]
      }
    );

    if(this.id)
    {
      const sb = this.modeEtablissementService.getEntityById(this.id)
        .pipe(first())
        .subscribe(x => this.formData.patchValue(x));
      this.subscriptions.push(sb);
      this.pageInfo.updateTitle("Modification de mode d'établissement")
    }
    else
      this.pageInfo.updateTitle("Ajout de mode d'établissement")
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() { return this.formData.controls; }

  onSaveModeEtablissement()
  {
    this.isLoading = true;
    if(this.formData.invalid) return;
    const sb = this.saveModeEtablissement().pipe(
        tap((data) => {
          this.passEntry.emit(data);
          this.modal.close();
        }),
        catchError((err) => {
          this.modal.dismiss(err);
          return of(undefined);
        }),
        finalize(() => {
          this.isLoading = false;
          if (!this.isModal) this.router.navigate(['/crm/standard/parametre/modeetablissement']);
        })
      )
      .subscribe();
    this.subscriptions.push(sb);
  }

  saveModeEtablissement() {
    const modeEtablissement: Modeetablissement = {
      ...this.formData.value,
      id: this.id ? this.id : null
    };
    return this.id
      ? this.modeEtablissementService.updateRow(modeEtablissement)
      : this.modeEtablissementService.createRow(modeEtablissement);
  }
}


