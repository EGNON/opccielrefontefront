import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocalService} from "../../../../services/local.service";
import {AuthService} from "../../../../core/modules/auth";
import {OperationService} from "../../../services/operation.service";
import {OperationdifferenceestimationService} from "../../../services/operationdifferenceestimation.service";
import {catchError, finalize} from "rxjs/operators";
import {of} from "rxjs";

@Component({
  selector: 'app-verificationniveau2de',
  templateUrl: './verificationniveau2de.component.html',
  styleUrl: './verificationniveau2de.component.scss'
})
export class Verificationniveau2deComponent implements OnInit{
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
    public operationDifferenceEstimationService:OperationdifferenceestimationService,) {
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
  verificationNiveau1De(){
    this.downloading=true
    this.operationService.verifierEtape(3,
      this.localStore.getData("currentOpcvm")?.idOpcvm,this.currentSeance?.idSeanceOpcvm.idSeance,true,false,2)
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
      userLogin2:this.currentUser?.username,
      niveau:2
    };
    // console.log(this.form.value.sous)
    this.operationDifferenceEstimationService.validerNiveau(param)
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
