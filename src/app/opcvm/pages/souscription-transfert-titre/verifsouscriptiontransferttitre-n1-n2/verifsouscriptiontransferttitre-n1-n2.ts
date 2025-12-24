import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { catchError, of, finalize, switchMap } from 'rxjs';
import { AuthService } from '../../../../core/modules/auth';
import { LocalService } from '../../../../services/local.service';
import { OperationextournevdeService } from '../../../services/operationextournevde.service';
import { DepotrachatService } from '../../../services/depotrachat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SeanceopcvmService } from '../../../services/seanceopcvm.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-verifsouscriptiontransferttitre-n1-n2',
  standalone: false,
  templateUrl: './verifsouscriptiontransferttitre-n1-n2.html',
  styleUrl: './verifsouscriptiontransferttitre-n1-n2.scss'
})
export class VerifsouscriptiontransferttitreN1N2 implements OnInit{
  currentSeance: any;
  allData:any;
  export = false;
  exportPdf = false;
  valider = false;
  verifier_Bouton = false;
  verifier = false;
  depotRachat$:any;
  depotRachat2$:any;

  constructor(
              private localStore: LocalService,
              private authService: AuthService,
              private router: Router,
              public seanceOpcvmService: SeanceopcvmService,
              public entityService:DepotrachatService) {
    this.currentSeance = this.localStore.getData("currentSeance");
  }
  ngOnInit(): void {
      // this.entityForm = this.fb.group(
      //       {
      //         denominationOpcvm: [null],
      //         idSeance: [null],
      //         dateOuverture: [null],
      //         dateFermeture: [null],
      //       }
      //     );
      //     console.log("currentOpcvm=",this.authService.LocalStorageManager.getValue("currentOpcvm"))
      //     console.log("idOpcvm=",this.localStore.getData("currentOpcvm").idOpcvm)
          this.seanceOpcvmService.afficherSeanceEnCours(this.localStore.getData("currentOpcvm").idOpcvm)
            .pipe(
              switchMap( (val) => {
                //console.log("val=",val)
                // this.seance=val.data;
                // this.idSeance=val.data.idSeanceOpcvm.idSeance;
                // this.entityForm.patchValue({denominationOpcvm:this.seance.opcvm?.denominationOpcvm})
                // this.entityForm.patchValue({idSeance:this.seance.idSeanceOpcvm.idSeance})
                // let dateOuverture = new Date(this.seance.dateOuverture);
                // this.entityForm.patchValue({dateOuverture: new NgbDate(
                //     dateOuverture.getFullYear(), dateOuverture.getMonth()+1, dateOuverture.getDate())});
      
                // let dateFermeture = new Date(this.seance.dateFermeture);
                // this.entityForm.patchValue({dateFermeture: new NgbDate(
                //     dateFermeture.getFullYear(), dateFermeture.getMonth()+1, dateFermeture.getDate())});
      
                return this.entityService.verifSouscriptionTransfertTitre2(
                  this.localStore.getData("currentOpcvm").idOpcvm
                  ,false,false,false);
              })
            ).subscribe(resp=> {
            this.depotRachat$=resp
            console.log(this.depotRachat$)
            if(this.depotRachat$!==null)
            {
              this.verifier=true
              this.verifier_Bouton=true
            }
            else{
              this.verifier=false;
              this.verifier_Bouton=false;
              this.entityService.afficherSouscriptionTransfertTitre(
                this.localStore.getData("currentOpcvm").idOpcvm,true,false).subscribe(
                (data)=>{
                  this.depotRachat2$=data;
                  if(this.depotRachat2$.length===0)
                    this.verifier_Bouton=true;
                }
              );
            }
      
          })
  }
  close() {
   // this.dialogRef.close();
  }
 verifSouscriptionTRansfertTitre()
  {
    this.exportPdf=true
    this.entityService.verifSouscriptionTRansfertTitreVerifN1N2(
      this.localStore.getData("currentOpcvm").idOpcvm,false,false).pipe(
        finalize(()=>{
          this.exportPdf=false
        })
      ).subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'verif_souscription_transfert_titre_niveau1.pdf';
        a.click();
      });
  }
  validerSouscriptionTransfertTitre(){
    this.valider=true
    const entity={
      idOpcvm:this.localStore.getData("currentOpcvm").idOpcvm,
      codeNatureOperation:"TRANS_TIT_ACT;TRANS_TIT_OBLC;TRANS_TIT_OBLNC;TRANS_TIT_TCN;TRANS_TIT_FCP",
      niveau:"1",
      userLoginVerif:this.authService.currentUserValue?.username
    }
    this.entityService.verifSouscriptionTransfertTitreN1(entity)
          .subscribe(
            {
              next: (value) => {
                this.valider=false
                alert("Confirmation effectuée avec succès")
                let currentUrl = this.router.url;
                this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                  this.router.navigate([currentUrl]);
                  this.verifier_Bouton=true
                });
              },
              error: err => {

              }
            }
          )
  }

}
