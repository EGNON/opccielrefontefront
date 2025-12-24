import { Component, EventEmitter, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Config } from 'datatables.net';
import { Subscription, switchMap, finalize } from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';
import { AuthService } from '../../../../core/modules/auth';
import { LoaderService } from '../../../../loader.service';
import { LocalService } from '../../../../services/local.service';
import { DepotrachatService } from '../../../services/depotrachat.service';
import { SeanceopcvmService } from '../../../services/seanceopcvm.service';

@Component({
  selector: 'app-verifsouscriptiontransferttitre-n2',
  standalone: false,
  templateUrl: './verifsouscriptiontransferttitre-n2.html',
  styleUrl: './verifsouscriptiontransferttitre-n2.scss'
})
export class VerifsouscriptiontransferttitreN2 implements OnInit, OnDestroy {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  idSeance:number;
  nbreLigne: number;
  verifier:boolean;
  valider:boolean;
  validerFinal:boolean;
  verifier_Bouton:boolean;
  id:any[];
  datatableConfig: Config = {};
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  depotRachat$:any;
  depotRachat2$:any;
  swalOptions: SweetAlertOptions = {};
  seance:any;
  tableau:HTMLElement;
  private clickListener: () => void;
  private idInAction: number;
  entityForm: FormGroup;

  // @ts-ignore
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    public entityService: DepotrachatService,
    public seanceOpcvmService: SeanceopcvmService,
    private loadingService: LoaderService,
    public localStore: LocalService,
    public authService: AuthService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.entityForm = this.fb.group(
      {
        denominationOpcvm: [null],
        idSeance: [null],
        dateOuverture: [null],
        dateFermeture: [null],
      }
    );
    // console.log("currentOpcvm=",this.authService.LocalStorageManager.getValue("currentOpcvm"))
    // console.log("idOpcvm=",this.localStore.getData("currentOpcvm").idOpcvm)
    this.seanceOpcvmService.afficherSeanceEnCours(this.localStore.getData("currentOpcvm").idOpcvm)
      .pipe(
        switchMap( (val) => {
          //console.log("val=",val)
          this.seance=val.data;
          this.idSeance=val.data.idSeanceOpcvm.idSeance;
          this.entityForm.patchValue({denominationOpcvm:this.seance.opcvm?.denominationOpcvm})
          this.entityForm.patchValue({idSeance:this.seance.idSeanceOpcvm.idSeance})
          let dateOuverture = new Date(this.seance.dateOuverture);
          this.entityForm.patchValue({dateOuverture: new NgbDate(
              dateOuverture.getFullYear(), dateOuverture.getMonth()+1, dateOuverture.getDate())});

          let dateFermeture = new Date(this.seance.dateFermeture);
          this.entityForm.patchValue({dateFermeture: new NgbDate(
              dateFermeture.getFullYear(), dateFermeture.getMonth()+1, dateFermeture.getDate())});

          return this.entityService.verifSouscriptionTransfertTitre2(
            this.localStore.getData("currentOpcvm").idOpcvm
            ,false,false,true);
        })
      ).subscribe(resp=> {
      this.depotRachat$=resp
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

  ngOnDestroy(): void {
   
  }

  
  verifSouscriptionTransfertTitreN2()
  {
    this.verifier=true
    this.entityService.verifSouscriptionTRansfertTitreVerifN1N2(
      this.localStore.getData("currentOpcvm").idOpcvm,true,false).pipe
      (finalize(()=>{
        this.verifier=false
      })).subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'verif_souscription_transfert_titre_niveau2.pdf';
        a.click();
      });
  }
  verifSouscriptionTransfertTitreN2_Final()
  {
    this.validerFinal=true
    this.entityService.verifSouscriptionTRansfertTitreVerifN1N2(
      this.localStore.getData("currentOpcvm").idOpcvm,true,true).pipe(
        finalize(()=>{
          this.validerFinal=false
        })
      ).subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'verif_souscription_transfert_titre_final.pdf';
        a.click();
      });
  }
  validerRachat(){
   /* const entity={
      idOpcvm:this.localStore.getData("currentOpcvm").idOpcvm,
      codeNatureOperation:"INT_RACH",
      niveau:"1",
      userLoginVerif:this.authService.currentUserValue?.denomination
    }*/
    // this.loadingService.setLoading(true);
    this.valider=true;
    let id=[]
    // @ts-ignore
     this.tableau=document.getElementById("table_Verif_Sous2");
    this.nbreLigne = document.getElementById("table_Verif_Sous2").getElementsByTagName('tr').length;//[0].getElementsByTagName('td').length;
    let i: number = 1;
    //        console.log(this.nbreLigne);
    for (i === 1; i < this.nbreLigne; i++) {
      // @ts-ignore
      //console.log(document.getElementById("table_Verif2").getElementsByTagName('tr')[i].cells[0].Value)
      // @ts-ignore
      id.push(document.getElementById("table_Verif_Sous2").getElementsByTagName('tr')[i].cells[0].innerHTML);
    }
    console.log("id=",id)
    //return

    this.entityService.creerOperation(id,this.authService.currentUserValue?.username).pipe
    (finalize(()=>{
      this.valider=false;
      alert("Confirmation effectuée avec succès")
    }))
      .subscribe(
        {
          next: (value) => {
            let currentUrl = this.router.url;
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this.router.navigate([currentUrl]);
            });
          },
          error: err => {

          }
        }
      )
    this.loadingService.setLoading(false);
  }
}



