import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import {catchError, finalize, Observable, of, Subscription } from 'rxjs';
import { Natureoperation } from '../../../../core/models/natureoperation.model';
import { Opcvm } from '../../../../core/models/opcvm';
import { AuthService } from '../../../../core/modules/auth';
import { NantissementService } from '../../../../core/services/nantissement.service';
import { Monnaie } from '../../../../crm/models/monnaie.model';
import { PersonneService } from '../../../../crm/services/personne/personne.service';
import { LoaderService } from '../../../../loader.service';
import { PageInfoService } from '../../../../template/_metronic/layout';
import { Detailprofil } from '../../../models/detailprofil.model';
import { DepotrachatService } from '../../../services/depotrachat.service';
import {LocalService} from "../../../../services/local.service";
import { Personne } from '../../../../crm/models/personne/personne.model';

@Component({
    selector: 'app-intentionrachat-add-edit',
    templateUrl: './intentionrachat-add-edit.component.html',
    styleUrl: './intentionrachat-add-edit.component.scss',
    standalone: false
})
export class IntentionrachatAddEditComponent implements OnInit, OnDestroy{
  id?: number;
  id2?: number;
  opcvm:Opcvm;
  natureOperation:Natureoperation;
  personneDistributeur$: any;
  personneActionnaire$: any;
  personneActionnaire: any;
  actionnaireSelectionne: Personne[];
  personne: any;
  objetPart: any;
  objetNanti: any;
  partNanti:number;
  partDispo:number;
  partRestant:number;
  isLoading = false;
  submitting = false;
  idPersonne:number;
  submitted = false;
  entityForm: FormGroup;
  estVerifie2:boolean;
  entity:any;
  currentSeance: any;
  public personneSettings = {};
  private subscriptions: Subscription[] = [];

  constructor(
    public entityService: DepotrachatService,
    public nantissementService: NantissementService,
    public personneService: PersonneService,
    public authService: AuthService,
    private loadingService: LoaderService,
    public localStore: LocalService,
    public pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.id2 = this.route.snapshot.params['id2'];
    /*console.log("id=",this.id)
    console.log("id2=",this.id2)*/
     this.currentSeance = this.localStore.getData("currentSeance");
    console.log("Séance actuelle === ", this.currentSeance);
    const dateSeance = new Date(this.currentSeance?.dateFermeture);
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        referencePiece: [null,Validators.required],
        modeVL: [null,Validators.required],
        dateOperation: [new NgbDate(dateSeance.getFullYear(), dateSeance.getMonth()+1, dateSeance.getDate()),
                        Validators.required],
        personne: [null,Validators.required],
        actionnaire: [null,Validators.required],
        partDisponible: [null],
        partNanti: [null],
        partRestant: [null],
        quantite: [null,Validators.required],
        libelleOperation: [null],
      }
    );
    this.afficherActionnaire()
    this.afficherDistributeur()
    this.actionnaireSelectionne=[]
    this.personneSettings = {
      singleSelection: true,
      idField: 'idPersonne',
      textField: 'numeroCpteDeposit',
      enableCheckAll: true,
      selectAllText: 'Sélectionnez tous',
      unSelectAllText: 'Ne pas tout sélectionné',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Rechercher un élément',
      noDataAvailablePlaceholderText: 'Aucune donnée à afficher',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
    // this.paysSelect = document.getElementById("ComboPaysLab");
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification d'intention de rachat'")
      const sb = this.entityService.getById(this.id)
        .subscribe((entity)=>{
          this.entity=entity.data;
          this.estVerifie2=this.entity.estVerifie2
          console.log(this.estVerifie2)
          if(!this.estVerifie2)
            this.loadFormValues(entity.data);
        });
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout d'intention de rachat")
  }
  afficherDistributeur()
  {
    this.personneService.afficherPersonneSelonQualite("DISTRIBUTEURS").subscribe(
      (data)=>{
        this.personneDistributeur$=data;
      }
    )
  }
  afficherActionnaire(){
    this.personneService.afficherPersonneInOpcvmEtStatutCompte(
      this.localStore.getData("currentOpcvm").idOpcvm
    ).subscribe(
      (data)=>{
        this.personneActionnaire$=data;
        this.personneActionnaire=data;
       // console.log(data)
      }
    )
  }
  public onFilterChange(item: any) {
    // console.log('onFilterChange', item);
  }
  public onDropDownClose(item: any) {
    // console.log('onDropDownClose', item);
  }

  public onItemSelect2(item: any) {
    // console.log('onItemSelect', item);
    let idPersonne=item.idPersonne;
    this.idPersonne=item.idPersonne
    this.afficherNbrePart(0)
  }
  public onDeSelect2(item: any) {
    // console.log('onDeSelect', item);
    let idPersonne=item.idPersonne;
    this.idPersonne=0
   
    
  }

  public onSelectAll2(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAll2(items: any) {
    // console.log('onDeSelectAll', items);
  }

  public onFilterChange2(item: any) {
    // console.log('onFilterChange', item);
  }
  public onDropDownClose2(item: any) {
    // console.log('onDropDownClose', item);
  }

  
  afficherNbrePart(idActionnaire:any){
    //console.log("pass")
    if(idActionnaire===0)
      idActionnaire=this.idPersonne
    this.loadingService.setLoading(true);
      this.entityService.afficherNbrePart(this.localStore.getData("currentOpcvm").idOpcvm,
        idActionnaire).subscribe(
        (data)=>{
          this.objetPart=data
          console.log(this.objetPart)
          //console.log(this.objetPart[0][4])
          /*this.entityForm.patchValue({partDisponible:this.objetPart[0][1]})
          this.entityForm.patchValue({partNanti:this.objetPart[0][0]})
          this.entityForm.patchValue({partRestant:this.objetPart[0][2]})*/

          this.entityForm.patchValue({partDisponible:this.objetPart[0].partDispo})
          this.entityForm.patchValue({partNanti:this.objetPart[0].partNanti})
          this.entityForm.patchValue({partRestant:this.objetPart[0].partRestant})
          this.loadingService.setLoading(false)
        }
      )
  }
  quantiteChange(){
    this.entityForm.patchValue({libelleOperation:'RACHAT DE '+this.entityForm.value.quantite+' PART(S)'})
  }
   get actionnaires(): FormArray { return <FormArray>this.entityForm.get('actionnaire')}
  loadFormValues(entity: any)
  {
    this.entity = entity;
    console.log("entity=",this.entity)
    this.entityForm.patchValue({referencePiece:
      entity.referencePiece});
    this.entityForm.patchValue({libelleOperation: entity.libelleOperation});
    let dateOparation = new Date(entity.dateOperation);
    this.entityForm.patchValue({dateOperation: new NgbDate(
        dateOparation.getFullYear(), dateOparation.getMonth()+1, dateOparation.getDate())});
    //this.entityForm.patchValue({dateOperation: entity.libelleOperation});
    this.entityForm.patchValue({id: entity.idDepotRachat});
    let quantite:string=entity.quantite.toLocaleString()
    this.entityForm.patchValue({quantite:quantite.replace('.',',')});
    this.entityForm.patchValue({modeVL: entity.modeVL});
    // this.entityForm.patchValue({actionnaire: entity.actionnaire});
    this.actionnaireSelectionne=[];
      
    this.actionnaireSelectionne.push(entity.actionnaire)
      
      // console.log(this.paysSelectionne)
      this.actionnaires.patchValue(this.actionnaireSelectionne);
    this.entityForm.patchValue({personne: entity.personne});
    // console.log("actionnaire=",entity.actionnaire)
    this.afficherNbrePart(entity.actionnaire.idPersonne)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() { return this.entityForm.controls; }

  onSaveEntity()
  {

    this.isLoading = true;
    this.submitted = true;
    if(this.entityForm.invalid) return;
    const sb = this.saveEntity()
      .pipe(
        catchError((err) => {
          return of(undefined);
        }),
        finalize(() => {
          this.submitted = false;
          this.isLoading = false;
          this.router.navigate(['/opcvm/rachat/intentionrachat']);
        })
      )
      .subscribe(
        (data)=>{
        }
      );
    this.subscriptions.push(sb);
  }

  saveEntity() {
    console.log(this.entityForm.value)
    this.opcvm=new Opcvm();
    this.opcvm.idOpcvm=this.localStore.getData("currentOpcvm").idOpcvm

    this.natureOperation=new Natureoperation();
    this.natureOperation.codeNatureOperation="INT_RACH";
    let dateOperation: any;
    if(this.entityForm.controls.dateOperation.value)
    {
      dateOperation = new Date(
        this.entityForm.controls.dateOperation.value.year,
        this.entityForm.controls.dateOperation.value.month-1,
        this.entityForm.controls.dateOperation.value.day+1);
    }
    let idActionnaire: any;
    if(this.entityForm.controls.actionnaire.value)
    {
      // idActionnaire =this.entityForm.value.actionnaire.idPersonne
      idActionnaire =this.idPersonne
    }

    let idPersonne: any;
    if(this.entityForm.controls.personne.value)
    {
      idPersonne =this.entityForm.value.personne.idPersonne
    }
    let dateSaisie=new Date();
    let dateVerification1=new Date("2050-12-31");
    let dateVerification=new Date("2014-12-20");

    let quantite=this.entityForm.value.quantite
    if(this.entityForm.controls.quantite.value)
    {
       quantite=this.entityForm.value.quantite.replace(',',".")
    }


    let valeurCodeAnalytique="OPC:" + this.opcvm.idOpcvm +
      ";ACT:" + idActionnaire;
    let actionnaire=new Personne();
    actionnaire.idPersonne=idActionnaire;

    let ValeurFormule="6:" + quantite;
    const entity: any = {
    ...this.entityForm.value,
      idSeance:this.id2,
      opcvm:this.opcvm,
      natureOperation:this.natureOperation,
      quantite:quantite,
      dateOperation:dateOperation,
      dateValeur:dateSaisie,
      dateSaisie:dateSaisie,
      datePiece:dateSaisie,
      estOD:false,
      estVerifie1:false,
      estVerifie2:false,
      estVerifier:false,
      estGenere:false,
      dateVerification:dateVerification,
      dateVerification1:dateVerification1,
      dateVerification2:dateVerification1,
      userLoginVerificateur1:"",
      userLoginVerificateur2:"",
      idTransaction:1,
      idOperation:0,
      ecriture:'A',
      type:'R',
      idActionnaire:idActionnaire,
      actionnaire:actionnaire,
      idPersonne:idPersonne,
      dateDernModifClient:dateSaisie,
      montant:0,
      montantSouscrit:0,
      qte:0,
      commission:0,
      interetCouru:0,
      interetPrecompte:0,
      nomVerificateur:"",
      valeurCodeAnalytique:valeurCodeAnalytique,
      valeurFormule:ValeurFormule
    };
   // console.log("act1",entity)
    return this.id
      ? this.entityService.update(entity)
      : this.entityService.create(entity);
  }
}


