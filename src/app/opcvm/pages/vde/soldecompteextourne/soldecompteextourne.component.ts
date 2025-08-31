import {Component, OnInit} from '@angular/core';
import {LocalService} from "../../../../services/local.service";
import {AuthService} from "../../../../core/modules/auth";
import {OperationextournevdeService} from "../../../services/operationextournevde.service";
import {catchError, finalize} from "rxjs/operators";
import {of} from "rxjs";

@Component({
    selector: 'app-soldecompteextourne',
    templateUrl: './soldecompteextourne.component.html',
    styleUrl: './soldecompteextourne.component.scss',
    standalone: false
})
export class SoldecompteextourneComponent implements OnInit{
  currentSeance: any;
  verification: boolean;
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
    this.verification=true
    const entity={
      idOpcvm: this.localStore.getData("currentOpcvm")?.idOpcvm,
      numCompteComptable:null,
      dateEstimation:new Date(this.currentSeance?.dateFermeture)
    }
    this.operationExtourneVDEService.soldeCompteExtourne(entity).pipe(
      catchError((err) => {
        this.verification=false
        return of(err.message);
      }),
      finalize(() => {
        this.verification=false
      })
    ).subscribe(

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
