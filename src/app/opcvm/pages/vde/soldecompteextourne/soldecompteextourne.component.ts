import {Component, OnInit} from '@angular/core';
import {LocalService} from "../../../../services/local.service";
import {AuthService} from "../../../../core/modules/auth";
import {OperationextournevdeService} from "../../../services/operationextournevde.service";

@Component({
  selector: 'app-soldecompteextourne',
  templateUrl: './soldecompteextourne.component.html',
  styleUrl: './soldecompteextourne.component.scss'
})
export class SoldecompteextourneComponent implements OnInit{
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
  soldeCompteExtourne(){
    const entity={
      idOpcvm: this.localStore.getData("currentOpcvm")?.idOpcvm,
      numCompteComptable:null,
      dateEstimation:new Date(this.currentSeance?.dateFermeture)
    }
    this.operationExtourneVDEService.soldeCompteExtourne(entity).subscribe(

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
    this.operationExtourneVDEService.modifier(entity,1).subscribe(
      (data)=>{
        alert('La confirmation a été effectuée')
      }
    )
  }

}
