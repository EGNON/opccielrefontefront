import {Component, OnInit} from '@angular/core';
import {LocalService} from "../../../../services/local.service";
import {AuthService} from "../../../../core/modules/auth";
import {OperationextournevdeService} from "../../../services/operationextournevde.service";
import moment from "moment/moment";
import {catchError, finalize} from "rxjs/operators";
import {of} from "rxjs";

@Component({
    selector: 'app-verificationniveau2modalvde',
    templateUrl: './verificationniveau2modalvde.component.html',
    styleUrl: './verificationniveau2modalvde.component.scss',
    standalone: false
})
export class Verificationniveau2modalvdeComponent implements OnInit{
  currentSeance: any;
  export = false;
  exportPdf = false;
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
    this.exportPdf=true
    this.operationExtourneVDEService.verifVDE(this.currentSeance?.idSeanceOpcvm.idSeance,
      this.localStore.getData("currentOpcvm")?.idOpcvm,false,true,false,2).pipe(
      catchError((err) => {
        this.exportPdf=false
        return of(err.message);
      }),
      finalize(() => {
        this.exportPdf=false
      })
    ).subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'verification_extourne_vde_niveau2.pdf';
        a.click();
      });
  }
  exportExcel() {
    this.export=true
    // 1️⃣ Définir les entêtes
    // const headers = ['ID','N°COMPTE SGI','NOM / SIGLE','PRENOMS / RAISON SOCIALE'];

    this.operationExtourneVDEService.excelVDE(this.currentSeance?.idSeanceOpcvm.idSeance,
      this.localStore.getData("currentOpcvm")?.idOpcvm,false,true,false,2).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "verificationExtourneVDE_Niveau2"+"_" + moment(new Date()).format("DD MM YYYY") +".xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      this.export=false
    });
    // 2️⃣ Mapper les données avec les entêtes

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
