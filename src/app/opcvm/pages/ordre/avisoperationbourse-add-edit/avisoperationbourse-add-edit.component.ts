import {Component, OnDestroy, OnInit} from '@angular/core';
import {Opcvm} from "../../../../core/models/opcvm";
import {Natureoperation} from "../../../../core/models/natureoperation.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {catchError, finalize, of, Subscription} from "rxjs";
import {DepotrachatService} from "../../../services/depotrachat.service";
import {NantissementService} from "../../../../core/services/nantissement.service";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {AuthService} from "../../../../core/modules/auth";
import {LoaderService} from "../../../../loader.service";
import {LocalService} from "../../../../services/local.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {AvisoperationbourseService} from "../../../services/avisoperationbourse.service";
import {Ordre} from "../../../models/ordre.model";
import {TitreModel} from "../../../../titresciel/models/titre.model";
import {OrdreService} from "../../../services/ordre.service";
import {FormuleService} from "../../../../core/services/formule.service";

@Component({
  selector: 'app-avisoperationbourse-add-edit',
  templateUrl: './avisoperationbourse-add-edit.component.html',
  styleUrl: './avisoperationbourse-add-edit.component.scss'
})
export class AvisoperationbourseAddEditComponent implements OnInit, OnDestroy{
  id?: number;
  idOrdre?: number;
  opcvm:Opcvm;
  natureOperation:Natureoperation;
  personneDistributeur$: any;
  personneActionnaire$: any;
  personne: any;
  avisOperationBourse$:any;
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
  ordre$:any;
  coursLimite:any;
  quantiteLimite:any;
  private subscriptions: Subscription[] = [];

  constructor(
    public entityService: AvisoperationbourseService,
    public ordreService: OrdreService,
    public personneService: PersonneService,
    public formuleService: FormuleService,
    public authService: AuthService,
    private loadingService: LoaderService,
    public localStore: LocalService,
    public pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id3'];
    this.idOrdre = this.route.snapshot.params['id'];
    // this.id2 = this.route.snapshot.params['id2'];
    /*console.log("id=",this.id)
    console.log("id2=",this.id2)*/
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        referenceAvis: [null,Validators.required],
        referencePiece: [null],
        dateReceptionLivraisonPrevu: [null,Validators.required],
        dateOperation: [null,Validators.required],
        quantiteLimite: [null,Validators.required],
        coursLimite: [null,Validators.required],
        coursLimiteOrdre: [null],
        cump: [null],
        commissionPlace:[null],
        commissionDepositaire:[null],
        commissionSGI:[null],
        tAF:[null],
        interetPrecompte:[null],
        interet:[null],
        plusOuMoinsValue:[null],
        montantBrut:[null],
        montantNet:[null],
        role:[null],
        symboleTitre:[null],
        codeClasseTitre:[null],
        codeTypeTitre:[null],
        idTitre:[null],
      }
    );
    this.quantiteLimite=0
    this.coursLimite=0
    this.entityForm.patchValue({statut:"NON ENVOYE"})
    this.entityForm.patchValue({montantBrut:"0"})
    this.entityForm.patchValue({interet:"0"})
    this.entityForm.patchValue({commissionPlace:"0"})
    this.entityForm.patchValue({commissionDepositaire:"0"})
    this.entityForm.patchValue({commissionSGI:"0"})
    this.entityForm.patchValue({tAF:"0"})
    this.entityForm.patchValue({plusOuMoinsValue:"0"})
    this.entityForm.patchValue({interetPrecompte:"0"})
    this.entityForm.patchValue({montantNet:"0"})
    this.entityForm.patchValue({quantiteLimite:"0"})
    this.entityForm.patchValue({coursLimite:"0"})
    let date=new Date(this.localStore.getData("currentSeance").dateFermeture)
    this.entityForm.patchValue({dateOperation: new NgbDate(
        date.getFullYear(), date.getMonth()+1, date.getDate())});

    this.dateChange()

    // this.paysSelect = document.getElementById("ComboPaysLab");
    let entity:any;
    this.ordreService.afficherSelonId(this.idOrdre).subscribe(
      (data)=>{
        entity=data.data
        console.log(entity)
        this.entityForm.patchValue({referencePiece:entity.referencePiece})
        this.entityForm.patchValue({role:entity.role.toString().trim()})
        this.entityForm.patchValue({idTitre:entity.titre.idTitre.toString()})
        this.entityForm.patchValue({symboleTitre:entity.titre.symbolTitre.toString().trim()})
        this.entityForm.patchValue({codeClasseTitre:entity.titre.typeTitre.classeTitre.codeClasseTitre.toString().trim()})
        this.entityForm.patchValue({codeTypeTitre:entity.titre.typeTitre.codeTypeTitre.toString().trim()})
        this.entityForm.patchValue({coursLimiteOrdre:entity.coursLimite.toString()})
      }
    )
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification avis d'exécution d'ordre'")
      const sb = this.entityService.getById(this.id)
        .subscribe((entity)=>{
          this.entity=entity.data;
          this.loadFormValues(entity.data);
        });
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout d'avis d'exécution d'ordre")
  }
  afficherNbrePart(idActionnaire:any){
    //console.log("pass")
    if(idActionnaire===0)
      idActionnaire=this.entityForm.value.actionnaire.idPersonne
    this.loadingService.setLoading(true);
    // this.entityService.afficherNbrePart(this.localStore.getData("currentOpcvm").idOpcvm,
    //   idActionnaire).subscribe(
    //   (data)=>{
    //     this.objetPart=data
    //     console.log(this.objetPart)
    //     //console.log(this.objetPart[0][4])
    //     /*this.entityForm.patchValue({partDisponible:this.objetPart[0][1]})
    //     this.entityForm.patchValue({partNanti:this.objetPart[0][0]})
    //     this.entityForm.patchValue({partRestant:this.objetPart[0][2]})*/
    //
    //     this.entityForm.patchValue({partDisponible:this.objetPart[0].partDispo})
    //     this.entityForm.patchValue({partNanti:this.objetPart[0].partNanti})
    //     this.entityForm.patchValue({partRestant:this.objetPart[0].partRestant})
    //     this.loadingService.setLoading(false)
    //   }
    // )
  }
  quantiteChange(){
    this.entityForm.patchValue({libelleOperation:'RACHAT DE '+this.entityForm.value.quantite+' PART(S)'})
  }
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
    let quantite:string=entity.quantite
    this.entityForm.patchValue({quantite:quantite.replace('.',',')});
    this.entityForm.patchValue({modeVL: entity.modeVL});
    this.entityForm.patchValue({actionnaire: entity.actionnaire});
    this.entityForm.patchValue({personne: entity.personne});
    console.log("actionnaire=",entity.actionnaire)
    this.afficherNbrePart(entity.actionnaire.idPersonne)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() { return this.entityForm.controls; }
  onCoursKeyPress($event) {
    this.coursLimite=$event.target.value
    this.calculer()
  }
  onQuantiteKeyPress($event) {
    this.quantiteLimite=$event.target.value
    this.calculer()
  }
  calculer(){
    // console.log(this.entityForm.controls.dateOperation.value)
    this.loadingService.setLoading(true)

    if(Number(this.coursLimite)===0 || Number(this.quantiteLimite===0)){
      this.entityForm.patchValue({montantBrut:"0"})
      this.entityForm.patchValue({interet:"0"})
      this.entityForm.patchValue({commissionPlace:"0"})
      this.entityForm.patchValue({commissionDepositaire:"0"})
      this.entityForm.patchValue({commissionSGI:"0"})
      this.entityForm.patchValue({tAF:"0"})
      this.entityForm.patchValue({plusOuMoinsValue:"0"})
      this.entityForm.patchValue({interetPrecompte:"0"})
      this.entityForm.patchValue({montantNet:"0"})
      this.loadingService.setLoading(false)
      return
    }
    let dateOperation: any;
    if(this.entityForm.controls.dateOperation.value)
    {
      dateOperation = new Date(
        this.entityForm.controls.dateOperation.value.year,
        this.entityForm.controls.dateOperation.value.month-1,
        this.entityForm.controls.dateOperation.value.day+1);
    }
    let dateReceptionLivraison: any;
    if(this.entityForm.controls.dateReceptionLivraisonPrevu.value)
    {
      dateReceptionLivraison = new Date(
        this.entityForm.controls.dateReceptionLivraisonPrevu.value.year,
        this.entityForm.controls.dateReceptionLivraisonPrevu.value.month-1,
        this.entityForm.controls.dateReceptionLivraisonPrevu.value.day+1);
    }

    this.opcvm=new Opcvm();
    this.opcvm.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm;
    this.ordreService.afficherSelonId(this.idOrdre).subscribe(
      (data)=>{
        this.ordre$=data.data
        const entity={
          ...this.entityForm.value,
          coursLimite:Number(this.coursLimite),
          quantiteLimite:Number(this.quantiteLimite),
          dateOperation:dateOperation,
          dateReceptionLivraisonPrevu:dateReceptionLivraison,
          ordre:this.ordre$
        }
        console.log("entity=",entity)
        this.entityService.calculer(entity).subscribe(
          (data)=>{
            this.avisOperationBourse$=data.data
            console.log(this.avisOperationBourse$)
            this.entityForm.patchValue({montantBrut:this.avisOperationBourse$.montantBrut.toString()})
            this.entityForm.patchValue({montantNet:this.avisOperationBourse$.montantNet.toString()})
            this.entityForm.patchValue({plusOuMoinsValue:this.avisOperationBourse$.plusOuMoinsValue.toString()})
            this.entityForm.patchValue({interetPrecompte:this.avisOperationBourse$.interetPrecompte.toString()})
            this.entityForm.patchValue({commissionPlace:this.avisOperationBourse$.commissionPlace.toString()})
            this.entityForm.patchValue({commissionSGI:this.avisOperationBourse$.commissionSGI.toString()})
            this.entityForm.patchValue({commissionDepositaire:this.avisOperationBourse$.commissionDepositaire.toString()})
            this.entityForm.patchValue({interet:this.avisOperationBourse$.interet.toString()})
            this.entityForm.patchValue({tAF:this.avisOperationBourse$.tAF.toString()})
            this.loadingService.setLoading(false)

          }
        )
      }
    )
  }
  dateChange(){
    // if(!dtp_DateOperation.ReadOnly)
    // {
    this.loadingService.setLoading(true)
    let obj=new Ordre()
    this.ordreService.afficherSelonId(this.idOrdre).subscribe(
      (data)=>{
        obj=data.data
        if(obj!=null)
        {
          let dateOperation = new Date(
            this.entityForm.controls.dateOperation.value.year,
            this.entityForm.controls.dateOperation.value.month-1,
            this.entityForm.controls.dateOperation.value.day+1);
          let dateReceptionLivraisonPrevu = new Date(dateOperation);

          if(obj.role.trim().toLowerCase() === "souscription")
          {
            this.entityForm.patchValue({dateReceptionLivraisonPrevu: new NgbDate(
                dateReceptionLivraisonPrevu.getFullYear(),
                dateReceptionLivraisonPrevu.getMonth()+1, dateReceptionLivraisonPrevu.getDate())});
          }
          else
          {
            let day = this.entityForm.controls.dateOperation.value.day+1;
            if(Number(day)==1 || Number(day)==2)
            {
              this.entityForm.patchValue({dateReceptionLivraisonPrevu: new NgbDate(
                  dateReceptionLivraisonPrevu.getFullYear(),
                  dateReceptionLivraisonPrevu.getMonth()+1, dateReceptionLivraisonPrevu.getDate()+2)});
            }
            else
            {
              this.entityForm.patchValue({dateReceptionLivraisonPrevu: new NgbDate(
                  dateReceptionLivraisonPrevu.getFullYear(),
                  dateReceptionLivraisonPrevu.getMonth()+1, dateReceptionLivraisonPrevu.getDate()+4)});
            }
          }
          let valeur =0
          this.formuleService.cump(this.localStore.getData("currentOpcvm")?.idOpcvm,
          this.entityForm.value.idTitre, dateOperation).subscribe(
            (data)=>{
              valeur=data.data
            }
          );
          this.entityForm.patchValue({cump: valeur.toString()});
          this.calculer();
          this.loadingService.setLoading(false)
        }
      }
    )
  }
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
          this.router.navigate([`/opcvm/ordre/liste/avisoperationbourse`]);
        })
      )
      .subscribe(
        (data)=>{
        }
      );
    this.subscriptions.push(sb);
  }

  saveEntity() {
    // console.log(this.entityForm.value)
    // let quantiteLimite = Convert.ToDecimal(meb_Quantite.Value);
    let natureOperation:Natureoperation;
    let quantiteLimite=this.entityForm.value.quantiteLimite
    if(this.entityForm.controls.quantiteLimite.value)
    {
      quantiteLimite=this.entityForm.value.quantiteLimite.replace(',',".")
    }
    let coursLimite=this.entityForm.value.coursLimite
    if(this.entityForm.controls.coursLimite.value)
    {
      coursLimite=this.entityForm.value.coursLimite.replace(',',".")
    }
    let ordre=new Ordre();
    ordre.idOrdre = this.idOrdre;
    let idSeance = this.localStore.getData("currentSeance").idSeanceOpcvm?.idSeance;
    let dateOperation: any;
    let ValeurFormule:any;

    if(this.entityForm.controls.dateOperation.value)
    {
      dateOperation = new Date(
        this.entityForm.controls.dateOperation.value.year,
        this.entityForm.controls.dateOperation.value.month-1,
        this.entityForm.controls.dateOperation.value.day+1);
    }
    let datePiece = dateOperation ;
    let dateValeur = dateOperation;
    let dateReceptionLivraisonPrevu: any;
    if(this.entityForm.controls.dateReceptionLivraisonPrevu.value)
    {
      dateReceptionLivraisonPrevu = new Date(
        this.entityForm.controls.dateReceptionLivraisonPrevu.value.year,
        this.entityForm.controls.dateReceptionLivraisonPrevu.value.month-1,
        this.entityForm.controls.dateReceptionLivraisonPrevu.value.day+1);
    }
    let dateSaisie = new Date();
    let montantBrut=this.entityForm.value.montantBrut
    if(this.entityForm.controls.montantBrut.value)
    {
      montantBrut=this.entityForm.value.montantBrut.replace(',',".")
    }
    let interet=this.entityForm.value.interet
    if(this.entityForm.controls.interet.value)
    {
      interet=this.entityForm.value.interet.replace(',',".")
    }
    let ecriture = "A";
    let CommissionSGI=this.entityForm.value.commissionSGI
    if(this.entityForm.controls.commissionSGI.value)
    {
      CommissionSGI=this.entityForm.value.commissionSGI.replace(',',".")
    }

    let TAF=this.entityForm.value.tAF
    if(this.entityForm.controls.tAF.value)
    {
      TAF=this.entityForm.value.tAF.replace(',',".")
    }
    let CommissionPlace=this.entityForm.value.commissionPlace
    if(this.entityForm.controls.commissionPlace.value)
    {
      CommissionPlace=this.entityForm.value.commissionPlace.replace(',',".")
    }
    let CommissionDepositaire=this.entityForm.value.commissionDepositaire
    if(this.entityForm.controls.commissionDepositaire.value)
    {
      CommissionDepositaire=this.entityForm.value.commissionDepositaire.replace(',',".")
    }
    let PlusOuMoinsValue=this.entityForm.value.plusOuMoinsValue
    if(this.entityForm.controls.plusOuMoinsValue.value)
    {
      PlusOuMoinsValue=this.entityForm.value.plusOuMoinsValue.replace(',',".")
    }
    // let IRVM=this.entityForm.value.iRVM
    // if(this.entityForm.controls.iRVM.value)
    // {
    //   IRVM=this.entityForm.value.iRVM.replace(',',".")
    // }
    let Montant=this.entityForm.value.montantNet
    if(this.entityForm.controls.montantNet.value)
    {
      Montant=this.entityForm.value.montantNet.replace(',',".")
    }
    let InteretPrecompte=this.entityForm.value.interetPrecompte
    if(this.entityForm.controls.interetPrecompte.value)
    {
      InteretPrecompte=this.entityForm.value.interetPrecompte.replace(',',".")
    }
    let coursLimiteOrdre=this.entityForm.value.coursLimiteOrdre
    if(this.entityForm.controls.coursLimiteOrdre.value)
    {
      coursLimiteOrdre=this.entityForm.value.coursLimiteOrdre.replace(',',".")
    }
    let role=this.entityForm.value.role
    let type=""
    let symboleTitre=this.entityForm.value.symboleTitre
    let codeTypeTitre=this.entityForm.value.codeTypeTitre
    let libelleOperation=""
    let codeClasseTitre=""
    if (role.toLowerCase().trim() === "achat" )
    {
      libelleOperation = "ACHAT DE " + quantiteLimite + " " +
        symboleTitre.trim();
      natureOperation=new Natureoperation();
      natureOperation.codeNatureOperation = "ACHAT";
      let montantSansFrais = Number(Montant) -Number(CommissionSGI) -
        Number(TAF) - Number(CommissionDepositaire) -Number(CommissionPlace) -Number(interet);

      let  comTTC =Number(CommissionSGI) + Number(TAF) + Number(CommissionDepositaire) +
        Number(CommissionPlace);
      codeClasseTitre=this.entityForm.value.codeClasseTitre
      if (codeClasseTitre.trim().toUpperCase() === "TCN")
      {
        let coursLimiteOrdre=this.entityForm.value.coursLimiteOrdre
        ValeurFormule = "2:" + montantBrut.toString().replace(',', '.') +
          ";9:" + comTTC.toString().replace(',', '.') +
          ";28:" + interet.toString().replace(',', '.')+
          ";55:" + quantiteLimite.toString().replace(',', '.')+
          ";34:" + (Math.round(Number(quantiteLimite) *
            Number(coursLimiteOrdre))).toString().replace(',', '.') +
          ";30:" + InteretPrecompte.toString().replace(',', '.')+
          ";4:" + Montant.toString().replace(',', '.');
      }
      else
      {
        ValeurFormule =
          "2:" + montantSansFrais.toString().replace(',', '.') +
          ";4:" + Montant.toString().replace(',', '.') +
          ";9:" + comTTC.toString().replace(',', '.') +
          ";34:" + (Math.round(Number(quantiteLimite) *
            Number(coursLimiteOrdre))).toString().replace(',', '.') +
          ";55:" + quantiteLimite.toString().replace(',', '.') +
          ";28:" + interet.toString().replace(',', '.') +
          ";73:0";
      }
      type = "ACH";
    }
    else if (role.trim().toLowerCase() === "vente")
    {
      libelleOperation = "VENTE DE " + quantiteLimite + " " +
        symboleTitre.trim();
      natureOperation=new Natureoperation();
      natureOperation.codeNatureOperation = "VENTE";
      let montantSansFrais = Number(Montant) + Number(interet);
      let comTTC = Number(CommissionSGI) + Number(TAF) + Number(CommissionDepositaire)+
      Number(CommissionPlace);
      codeClasseTitre=this.entityForm.value.codeClasseTitre
      if (codeClasseTitre.trim().toUpperCase() === "TCN")
      {
        if (codeTypeTitre === "BOT")
        {
          ValeurFormule = "30:" + InteretPrecompte.toString().replace(',', '.') +
            ";4:" + Montant.toString().replace(',', '.') +
            ";9:" + comTTC.toString().replace(',', '.') +
            ";55:" + quantiteLimite.toString().replace(',', '.') +
            ";34:" + (Math.round(Number(quantiteLimite) *
              Number(coursLimiteOrdre))).toString().replace(',', '.') +
            ";28:" + interet.toString().replace(',', '.') +
            ";2:" + (montantBrut).toString().replace(',', '.');
        }
        else
        {
          let cump=this.entityForm.value.cump
          ValeurFormule = "4:" + Montant.toString().replace(',', '.') +
            ";9:" + comTTC.toString().replace(',', '.') +
            ";28:" + interet.toString().replace(',', '.') +
            ";32:" + (Number(PlusOuMoinsValue) > 0 ? 0 : Math.abs(Number(PlusOuMoinsValue))).toString().replace(',', '.') +
            ";34:" + (Math.round(Number(quantiteLimite) *
              Number(coursLimiteOrdre))).toString().replace(',', '.') +
            ";46:" + (Number(PlusOuMoinsValue) < 0 ? 0 : Math.abs(Number(PlusOuMoinsValue))).toString().replace(',', '.') +
            ";55:" + quantiteLimite.toString().replace(',', '.') +
            ";21:" + (Math.round(Number(quantiteLimite) * Number(cump))).toString().replace(',', '.');
        }
      }
      else
      {
        ValeurFormule =
          "2:" + (Number(montantBrut) - Number(PlusOuMoinsValue)).toString().replace(',', '.') +
          ";21:" + (Number(montantBrut) - Number(PlusOuMoinsValue)).toString().replace(',', '.') +
          ";4:" + Montant.toString().replace(',', '.') +
          ";9:" + comTTC.toString().replace(',', '.') +
          ";32:" + (Number(PlusOuMoinsValue) > 0 ? 0 : Math.abs(Number(PlusOuMoinsValue))).toString().replace(',', '.') +
          ";34:" + (Math.round(Number(quantiteLimite) *
            Number(coursLimiteOrdre))).toString().replace(',', '.') +
          ";46:" + (Number(PlusOuMoinsValue) < 0 ? 0 : Math.abs(Number(PlusOuMoinsValue))).toString().replace(',', '.') +
          ";55:" + quantiteLimite.toString().replace(',', '.') +
          ";28:" + interet.toString().replace(',', '.') +
          ";30:" + InteretPrecompte.toString().replace(',', '.');
      }
      type = "VEN";
    }
    else
    {
      libelleOperation = "SOUSCRIPTION A " + quantiteLimite + " " +
        symboleTitre.trim();
      natureOperation=new Natureoperation();
      natureOperation.codeNatureOperation = "SOUS";
      let montantSansFrais = Number(Montant) +
      Number(interet);
      let comTTC = Number(CommissionSGI) + Number(TAF)+ Number(CommissionDepositaire) +
      Number(CommissionPlace);
      codeClasseTitre=this.entityForm.value.codeClasseTitre
      ValeurFormule =
        "2:" + montantBrut.toString().replace(',', '.') +
        ";34:" + (Math.round((Number(quantiteLimite) *
          Number(coursLimiteOrdre)))).toString().replace(',', '.') +
        ";55:" + quantiteLimite.toString().replace(',', '.') +
        ((codeClasseTitre.trim().toUpperCase() === "TCN" && codeTypeTitre.trim().toUpperCase() !== "BEFI") ? (";30:" + InteretPrecompte.toString().replace(',', '.')) : "") +
        ((codeClasseTitre.trim().toUpperCase() === "TCN" && codeTypeTitre.trim().toUpperCase() !== "BEFI") ? (";4:" + Montant.toString().replace(',', '.')) : "");
      type = "SOU";
    }
    let idTitre=this.entityForm.value.idTitre
    let referencePiece=this.entityForm.value.referenceAvis
    let ValeurCodeAnalytique = "OPC:" + this.localStore.getData("currentOpcvm").idOpcvm.toString() +
      ";TIT:" + idTitre.toString();

    const entity: any = {
      ...this.entityForm.value,
      idAvis:0,
      idTransaction:0,
      idSeance:idSeance,
      natureOperation:natureOperation,
      dateOperation:dateOperation,
      dateSaisie:dateSaisie,
      dateValeur:dateValeur,
      datePiece:datePiece,
      referencePiece:referencePiece,
      montant:Montant,
      ecriture:ecriture,
      libelleOperation:libelleOperation,
      estOD:false,
      type:type,
      ordre:ordre,
      dateReceptionLivraisonPrevu:dateReceptionLivraisonPrevu,
      quantiteLimite:quantiteLimite,
      coursLimite:coursLimite,
      commissionPlace:CommissionPlace,
      commissionDepositaire:CommissionDepositaire,
      commissionSGI:CommissionSGI,
      tAF:TAF,
      iRVM:this.entityForm.value.cump,
      interet:interet,
      plusOuMoinsValue:PlusOuMoinsValue,
      montantBrut:montantBrut,
      idOperationRL:0,
      userLogin:this.authService.currentUserValue?.username,
      valeurFormule:ValeurFormule,
      valeurCodeAnalytique:ValeurCodeAnalytique
    };

    return this.id
      ? this.entityService.update(entity)
      : this.entityService.create(entity);
  }
}



