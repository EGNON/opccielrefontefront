import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocalService} from "../../../../services/local.service";
import {AuthService} from "../../../../core/modules/auth";
import {OperationService} from "../../../services/operation.service";
import {OperationChargeEtalerService} from "../../../services/operation-charge-etaler.service";
import {catchError, finalize} from "rxjs/operators";
import {of} from "rxjs";

@Component({
    selector: 'app-verificationchargeniveau2',
    templateUrl: './verificationchargeniveau2.component.html',
    styleUrl: './verificationchargeniveau2.component.scss',
    standalone: false
})
export class Verificationchargeniveau2Component implements OnInit{
  currentSeance: any;
  downloading: boolean;
  submitted: boolean;
  entityForm: FormGroup;
  idSeance : number;
  currentOpcvm: any;
  currentUser: any;
  constructor(
    private localStore: LocalService,
    private authService: AuthService,
    private fb: FormBuilder,
    public operationService:OperationService,
    public operationChargeAEtaler:OperationChargeEtalerService,) {
    this.currentUser = this.authService.currentUserValue;
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
  }
  ngOnInit(): void {
    this.entityForm = this.fb.group(
      {
        estEnCloture:[null,Validators.required],
      }
    );
    this.idSeance=this.currentSeance?.idSeanceOpcvm.idSeance
    this.downloading=false;
  }
  close() {
    // this.dialogRef.close();
  }
  verificationNiveau1Charge(){
    this.downloading=true
    this.operationChargeAEtaler.verifierChargeNiveau(this.currentSeance?.idSeanceOpcvm.idSeance,
      this.localStore.getData("currentOpcvm")?.idOpcvm,true,false,8,2)
      .pipe(
        catchError((err) => {
          this.submitted = false;
          // this.loadingService.setLoading(false);
          return of(err.message);
        }),
        finalize(() => {
          // this.submitting = false;
          // this.submitted = false;
          // this.loadingService.setLoading(false);
          // window.location.reload();
          this.downloading=false
        })
      ).subscribe(
      (data)=>{
        if (data.data !== "" && data.data!=undefined)
        {
          alert(data.data);
        }
        // this.downloading=false;
      }
    )
  }
  save() {
    // return;
    // this.submitting = true;
    this.submitted = true;
    // this.loadingService.setLoading(true);


    let param = {
      idOpcvm: this.currentOpcvm?.idOpcvm,
      idSeance:this.idSeance,
      userLogin1:this.currentUser?.username,
      niveau:2
    };
    // console.log(this.form.value.sous)
    this.operationChargeAEtaler.validerNiveau(param)
      .pipe(
        catchError((err) => {
          this.submitted = false;
          // this.loadingService.setLoading(false);
          return of(err.message);
        }),
        finalize(() => {
          // this.submitting = false;
          this.submitted = false;
          // this.loadingService.setLoading(false);
          window.location.reload();
        })
      )
      .subscribe(value => {
        alert(value.data)
        // console.log("C'est le résultat === ", value);
      });
  }
}
