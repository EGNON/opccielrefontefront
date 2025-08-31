import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {OperationextournevdeService} from "../../../services/operationextournevde.service";
import {LocalService} from "../../../../services/local.service";
import {subscribe} from "diagnostics_channel";
import {AuthService} from "../../../../core/modules/auth";
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";
import moment from "moment";
import {catchError, finalize} from "rxjs/operators";
import {of} from "rxjs";

@Component({
    selector: 'app-verificationniveau1modalvde',
    templateUrl: './verificationniveau1modalvde.component.html',
    styleUrl: './verificationniveau1modalvde.component.scss',
    standalone: false
})
export class Verificationniveau1modalvdeComponent implements OnInit{
  currentSeance: any;
  allData:any;
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
      this.localStore.getData("currentOpcvm")?.idOpcvm,false,false,false,1).pipe(
      catchError((err) => {
        this.exportPdf=false
        return of(err.message);
      }),
      finalize(() => {
        this.exportPdf=false
      })
    ).subscribe(
      (data)=>{

      }
    )
  }
  excelVDE(){
    this.operationExtourneVDEService.excelVDE(this.currentSeance?.idSeanceOpcvm.idSeance,
      this.localStore.getData("currentOpcvm")?.idOpcvm,false,false,false,1).subscribe(

    )
  }
  exportExcel() {
    this.export=true
    // 1️⃣ Définir les entêtes
    // const headers = ['ID','N°COMPTE SGI','NOM / SIGLE','PRENOMS / RAISON SOCIALE'];

    this.operationExtourneVDEService.excelVDE(this.currentSeance?.idSeanceOpcvm.idSeance,
      this.localStore.getData("currentOpcvm")?.idOpcvm,false,false,false,1).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "verificationExtourneVDE_Niveau1"+"_" + moment(new Date()).format("DD MM YYYY") +".xlsx";
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
