import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";
import {delay, of, Subscription, tap} from "rxjs";
import {DegreService} from "../../../../crm/services/degre.service";
import {Degre} from "../../../../crm/models/degre.model";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {PageInfoService} from "../../../../template/_metronic/layout";

@Component({
    selector: 'app-degre-add-edit',
    templateUrl: './degre-add-edit.component.html',
    styleUrls: ['./degre-add-edit.component.scss'],
    standalone: false
})
export class DegreAddEditComponent implements OnInit, OnDestroy {
  id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  degreForm: FormGroup;
  private subscriptions: Subscription[] = [];

  @Input() entity: any;
  @Input() isModal: boolean = false;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    public modal: NgbActiveModal,
    private degreService: DegreService,
    private pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.degreForm = this.fb.group(
      {
        libelle: [null, Validators.required]
      }
    );

    if (this.id) {
      this.pageInfo.updateTitle("Modification de degré de connaissance")
      const sb = this.degreService.getById(this.id)
        .pipe(first())
        .subscribe(x => this.degreForm.patchValue(x.data));
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout de degré de connaissance")
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() {
    return this.degreForm.controls;
  }

  onSaveDegre() {
    this.isLoading = true;
    if (this.degreForm.invalid) return;
    const sb = this.saveDegre().pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap((resp) => {
        // console.log("SELECT === ", resp);
        // const option = document.createElement('option');
        // option.text = resp.data.libelle;
        // option.value = resp.data;
        // option.selected = true;
        // this.degreSelect.add(option);

        this.passEntry.emit(resp.data);
        this.modal.close();
      }),
      catchError((err) => {
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
        if (!this.isModal) this.router.navigate(['/app/standard/parametre/degre']);
      })
    )
      .subscribe();
    this.subscriptions.push(sb);
  }

  saveDegre() {
    const degre: Degre = {
      ...this.degreForm.value,
      idDegre: this.id ? this.id : null,
      id: this.id ? this.id : null
    };
    return this.id
      ? this.degreService.update(degre)
      : this.degreService.create(degre);
  }
}
