import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {OperationextournevdeService} from "../../../services/operationextournevde.service";
import {LocalService} from "../../../../services/local.service";
import {subscribe} from "diagnostics_channel";
import {AuthService} from "../../../../core/modules/auth";

@Component({
  selector: 'app-verificationniveau1modalvde',
  templateUrl: './verificationniveau1modalvde.component.html',
  styleUrl: './verificationniveau1modalvde.component.scss'
})
export class Verificationniveau1modalvdeComponent implements OnInit{
  currentSeance: any;
  constructor(
              private localStore: LocalService,
              private authService: AuthService,
              public operationExtourneVDEService:OperationextournevdeService) {
    this.currentSeance = this.localStore.getData("currentSeance");
  }
  ngOnInit(): void {

  }
  close() {
   // this.dialogRef.close();
  }
  verifVDE(){
    this.operationExtourneVDEService.verifVDE(this.currentSeance?.idSeanceOpcvm.idSeance,
      this.localStore.getData("currentOpcvm")?.idOpcvm,false,false,false,1).subscribe(

    )
  }
  modifier(){
  const entity={
    idSeance:this.currentSeance?.idSeanceOpcvm.idSeance,
    idOpcvm: this.localStore.getData("currentOpcvm")?.idOpcvm,
    estVerifie:false,
    estVerifie1:false,
    estVerifie2:false,
    userLogin1:this.authService.currentUserValue?.username
  }
    this.operationExtourneVDEService.modifier(entity).subscribe(
      (data)=>{
        alert('La confirmation a été effectuée')
      }
    )
  }

}
