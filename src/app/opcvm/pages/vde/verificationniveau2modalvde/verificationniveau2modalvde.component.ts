import {Component, OnInit} from '@angular/core';
import {LocalService} from "../../../../services/local.service";
import {AuthService} from "../../../../core/modules/auth";
import {OperationextournevdeService} from "../../../services/operationextournevde.service";

@Component({
  selector: 'app-verificationniveau2modalvde',
  templateUrl: './verificationniveau2modalvde.component.html',
  styleUrl: './verificationniveau2modalvde.component.scss'
})
export class Verificationniveau2modalvdeComponent implements OnInit{
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
      this.localStore.getData("currentOpcvm")?.idOpcvm,false,true,false,2).subscribe(

    )
  }
  modifier(){
    const entity={
      idSeance:this.currentSeance?.idSeanceOpcvm.idSeance,
      idOpcvm: this.localStore.getData("currentOpcvm")?.idOpcvm,
      estVerifie:false,
      estVerifie1:true,
      estVerifie2:false,
      userLogin1:this.authService.currentUserValue?.username
    }
    this.operationExtourneVDEService.modifier(entity,2).subscribe(
      (data)=>{
        alert('La confirmation a été effectuée')
      }
    )
  }

}
