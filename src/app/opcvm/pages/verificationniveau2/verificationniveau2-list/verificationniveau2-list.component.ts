import { Component, EventEmitter, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {ActivatedRoute, Router } from '@angular/router';
import {NgbActiveModal, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Config } from 'datatables.net';
import {Subscription, switchMap } from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';
import { AuthService } from '../../../../core/modules/auth';
import { LoaderService } from '../../../../loader.service';
import { DepotrachatService } from '../../../services/depotrachat.service';
import { SeanceopcvmService } from '../../../services/seanceopcvm.service';
import {LocalService} from "../../../../services/local.service";

@Component({
  selector: 'app-verificationniveau2-list',
  templateUrl: './verificationniveau2-list.component.html',
  styleUrl: './verificationniveau2-list.component.scss'
})
export class Verificationniveau2ListComponent implements OnInit, OnDestroy {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  idSeance:number;
  nbreLigne: number;
  verifier:boolean;
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

          return this.entityService.verifierIntentionRachatRestant(
            this.localStore.getData("currentOpcvm").idOpcvm
            ,this.idSeance,"INT_RACH",true,false,false);
        })
      ).subscribe(resp=> {
      this.depotRachat$=resp.data
      if(this.depotRachat$.length!==0)
      {
        this.verifier=true
        this.verifier_Bouton=true
      }
      else{
        this.verifier=false;
        this.verifier_Bouton=false;
        this.entityService.afficherFT_DepotRachat(
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
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  renderActionColumn(): void {
    if (this.datatableConfig.columns) {
      let actions = this.datatableConfig.columns[this.datatableConfig.columns?.length-1];
      actions.render = (data: any, type: any, full: any) => {
        const parentActionStart = `
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      Action
                    </button>
                    <ul class="dropdown-menu">`;
        const show = `
                <li>
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idDepotRachat}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idDepotRachat}"
                    data-id2="${full.idSeance}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.idDepotRachat}"
                    >Supprimer</a>
                </li>`;
        const parentActionEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentActionStart);
        // actions.push(show);
        actions.push(edit);
        actions.push(separator);
        actions.push(delete1);
        actions.push(parentActionEnd);

        return actions.join('');
      }
    }
  }
  verifiIntentionRachatN2()
  {
    this.entityService.verifIntentionRachatN1N2(
      this.localStore.getData("currentOpcvm").idOpcvm,true,false).subscribe(
      (data)=>{
        // console.log(data)
      }
    )
  }
  verifiIntentionRachatN2_Final()
  {
    this.entityService.verifIntentionRachatN1N2(
      this.localStore.getData("currentOpcvm").idOpcvm,true,true).subscribe(
      (data)=>{
        // console.log(data)
      }
    )
  }
  validerRachat(){
   /* const entity={
      idOpcvm:this.localStore.getData("currentOpcvm").idOpcvm,
      codeNatureOperation:"INT_RACH",
      niveau:"1",
      userLoginVerif:this.authService.currentUserValue?.denomination
    }*/
    this.loadingService.setLoading(true);
    let id=[]
    // @ts-ignore
     this.tableau=document.getElementById("table_Verif2");
    this.nbreLigne = document.getElementById("table_Verif2").getElementsByTagName('tr').length;//[0].getElementsByTagName('td').length;
    let i: number = 1;
    //        console.log(this.nbreLigne);
    for (i === 1; i < this.nbreLigne; i++) {
      // @ts-ignore
      //console.log(document.getElementById("table_Verif2").getElementsByTagName('tr')[i].cells[0].Value)
      // @ts-ignore
      id.push(document.getElementById("table_Verif2").getElementsByTagName('tr')[i].cells[0].innerHTML);
    }
    console.log("id=",id)
    //return

    this.entityService.creerOperation(id,this.authService.currentUserValue?.username)
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



