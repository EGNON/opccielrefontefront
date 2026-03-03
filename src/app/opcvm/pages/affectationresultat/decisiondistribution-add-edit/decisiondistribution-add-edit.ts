import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, catchError, of, finalize } from 'rxjs';
import { Opcvm } from '../../../../core/models/opcvm';
import { AuthService } from '../../../../core/modules/auth';
import { Monnaie } from '../../../../crm/models/monnaie.model';
import { Personne } from '../../../../crm/models/personne/personne.model';
import { PersonneService } from '../../../../crm/services/personne/personne.service';
import { LocalService } from '../../../../services/local.service';
import { PageInfoService } from '../../../../template/_metronic/layout';
import { Actionnaireopcvm } from '../../../models/actionnaireopcvm.model';
import { ActionnaireopcvmService } from '../../../services/actionnaireopcvm.service';
import { LibrairiesService } from '../../../../services/librairies.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-decisiondistribution-add-edit',
  standalone: false,
  templateUrl: './decisiondistribution-add-edit.html',
  styleUrl: './decisiondistribution-add-edit.scss'
})
export class DecisiondistributionAddEdit implements OnInit, OnDestroy{
  id?: number;
  public personneSettings = {};
  monnaies$: Observable<Monnaie[]>;
  opcvm:Opcvm;
  personne$: any;
  couponUnitaire_Enabled :boolean;
  Adistribuer_Enabled:boolean;
  NonDistribuer_Enabled:boolean;
  saveBouton:boolean;

  personne: any;
  actionnaireOpcvm: Actionnaireopcvm;
  isLoading = false;
  submitting = false;
  paysSelect:any;
  idPays:number;
  idPersonne:number;
  submitted = false;
  entityForm: FormGroup;
  tableau:HTMLElement;
  nbreLigne: number;
  entity:any;
  coupon:number;
  currentOpcvm: any;
  currentSeance: any;
  currentUser: any;
  private subscriptions: Subscription[] = [];

  constructor(
     private localStore: LocalService,
      public entityService: LibrairiesService,
      public personneService: PersonneService,
      public authService: AuthService,
      public pageInfo: PageInfoService,
      private fb: FormBuilder,
      private router: Router,
      private route: ActivatedRoute) {
        this.currentUser = this.authService.currentUserValue;
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
      }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    const dateSeance = new Date(this.currentSeance?.dateFermeture);
    this.entityForm = this.fb.group(
        {
          id: [this.id],
          dateDecision: [new NgbDate(dateSeance.getFullYear(),dateSeance.getMonth()+1,
            dateSeance.getDate()),Validators.required],
          dateDetachement: [new NgbDate(dateSeance.getFullYear(),dateSeance.getMonth()+1,
            dateSeance.getDate()),Validators.required],
          resultat: [0,Validators.required],
          aDistribueEnpourcentage: [0,Validators.required],
          montantDistribue: [0,Validators.required],
          montantNonDistribue: [0,Validators.required],
          nbrePartEnCirculation: [0,Validators.required],
          coupUnitaireADistribuer: [0,Validators.required],
          statutMontNonDistribue: [null,Validators.required],
          
        }
    );
    this.entityService.verificationMiseEnAffectationObjet(this.currentOpcvm.idOpcvm).subscribe(
      (data)=>{
          this.entity=data.data
          console.log(this.entity)
           this.entityForm.patchValue({resultat: this.entity.resultat});
           this.entityForm.patchValue({nbrePartEnCirculation: this.entity.nbrePartEnCirculation});
           if (Number(this.entity.resultat) < 0)
            {
               
                this.couponUnitaire_Enabled = true;
                this.Adistribuer_Enabled = true;
                this.NonDistribuer_Enabled = true;
            }
            else
            {
               this.couponUnitaire_Enabled = false;
               this.Adistribuer_Enabled = false;
               this.NonDistribuer_Enabled = false;
            }
      }
    )
   
   
  }

  onCouponKeyPress($event) {
    this.coupon=$event.target.value
    this.calculer()
  }
  calculer(){
      let meb_Adistribuer = Number(this.entityForm.value.nbrePartEnCirculation) * this.coupon;
      let meb_Pourcentage = Number(meb_Adistribuer) * 100 / Number(this.entityForm.value.resultat);
      let meb_NonDistribuer =  Number(this.entityForm.value.resultat) - Number(meb_Adistribuer);
      
      this.entityForm.patchValue({montantDistribue: meb_Adistribuer});
      this.entityForm.patchValue({aDistribueEnpourcentage: meb_Pourcentage});
      this.entityForm.patchValue({montantNonDistribue: meb_NonDistribuer});

  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  get personnes(): FormArray { return <FormArray>this.entityForm.get('personne')}


  public onFilterChange(item: any) {
    // console.log('onFilterChange', item);
  }

  public onDropDownClose(item: any) {
    // console.log('onDropDownClose', item);
  }

  public onItemSelect(item: any) {
    // console.log('onItemSelect', item);
  }
  public onDeSelect(item: any) {
    // console.log('onDeSelect', item);
  }

  public onSelectAll(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAll(items: any) {
    // console.log('onDeSelectAll', items);
  }

  get f() { return this.entityForm.controls; }

 
  onSaveEntity()
  {
    
    this.isLoading = true;
    this.submitted = true;
    this.saveBouton=true
    if(this.entityForm.invalid) 
      {
        this.saveBouton=false
        return;

      }
    const sb = this.saveEntity()
        .pipe(
            catchError((err) => {
              return of(undefined);
            }),
            finalize(() => {
              this.submitted = false;
              this.isLoading = false;
              this.saveBouton=false
              this.router.navigate(['/opcvm/affectation_resultat/decisiondistribution']);
            })
        )
        .subscribe(
          (data)=>{
          /*  this.nbreLigne = document.getElementById("table_PersonneOpcvm").getElementsByTagName('tr').length;//[0].getElementsByTagName('td').length;
            var i: number = 2;
            //        console.log(this.nbreLigne);
            for (i === 2; i < this.nbreLigne; i++) {
              this.actionnaireOpcvm=new Actionnaireopcvm();
              this.actionnaireOpcvm.opcvm=new Opcvm();
              this.actionnaireOpcvm.opcvm.idOpcvm=this.authService.LocalStorageManager.getValue("currentOpcvm").idOpcvm;
              this.actionnaireOpcvm.personne=new Personne();
              // @ts-ignore
              this.actionnaireOpcvm.personne.idPersonne=document.getElementById("table_PersonneOpcvm").getElementsByTagName('tr')[i].cells[0].innerHTML;
              // console.log("act"+i,this.actionnaireOpcvm)
              this.entityService.create(this.actionnaireOpcvm).subscribe();
            }*/
          }
      );
    this.subscriptions.push(sb);
  }

  saveEntity() {
     this.opcvm=new Opcvm();
    let dateDecision: any;
    if(this.entityForm.controls.dateDecision.value)
    {
      dateDecision = new Date(
        this.entityForm.controls.dateDecision.value.year,
        this.entityForm.controls.dateDecision.value.month-1,
        this.entityForm.controls.dateDecision.value.day+1);
    }
     
    let dateDetachement: any;
    if(this.entityForm.controls.dateDecision.value)
    {
      dateDetachement = new Date(
        this.entityForm.controls.dateDetachement.value.year,
        this.entityForm.controls.dateDetachement.value.month-1,
        this.entityForm.controls.dateDetachement.value.day+1);
    }
     
    const entity: any = {
      ...this.entityForm.value,
      idOpcvm:this.currentOpcvm.idOpcvm,
      dateDetachement:dateDetachement,
      dateDecision:dateDecision,
      idSeance:this.currentSeance?.idSeanceOpcvm.idSeance,
      userLogin:this.currentUser.username
    };
    return this.id
        ? this.entityService.enregistrerDecisionDistribution(entity)
        : this.entityService.enregistrerDecisionDistribution (entity);
  }
}

