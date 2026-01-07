import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalService } from '../../../../services/local.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormuleService } from '../../../../core/services/formule.service';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
import { ExerciceService } from '../../../services/exercice.service';
import { LibrairiesService } from '../../../../services/librairies.service';
import { param } from 'jquery';
import { PageInfoService } from '../../../../template/_metronic/layout';
import { AuthService } from '../../../../core/modules/auth';
import { Alerte } from '../../../../crm/models/alerte.model';

@Component({
  selector: 'app-exercicecloture',
  standalone: false,
  templateUrl: './exercicecloture.html',
  styleUrl: './exercicecloture.scss'
})
export class Exercicecloture implements OnInit{
  form:FormGroup
  currentOpcvm:any;
  currentSeance:any;
  submitted:boolean
  submitting:boolean
  valider:boolean

  submittingSuivant:boolean
  submittingPrecedent:boolean
  exercice$:any;
  ligneMvtClotureExercice$:any;
  ligneMvtClotureExercice2$:any;
  ligneMvtClotureExercice3$:any;
  solde$:any
  nbreSuivant:number
  constructor(
    public exerciceService:ExerciceService,
    public formuleService:FormuleService,
    public librairiesService:LibrairiesService,
    public pageInfo:PageInfoService,
    public localStore:LocalService,
    public authService:AuthService,
    public fb:FormBuilder
  ){
    this.currentOpcvm=localStore.getData("currentOpcvm")
    this.currentSeance=localStore.getData("currentSeance")
    console.log(this.currentOpcvm)
  }
  ngOnInit(): void {
    this.nbreSuivant=1
    this.pageInfo.setTitle("CLOTURE D'EXERCICE (DEBUT)")
    this.form=this.fb.group({
      sigle:[this.currentOpcvm.sigleOpcvm],
      designation:[this.currentOpcvm.denominationOpcvm],
      codeTypeAffectation:['DISTRIBUTION'/*this.currentOpcvm.typeAffectationTitre.libelleTypeAffectation*/],
      codeExercice:[null],
      dateDebut:[null],
      dateFin:[null],
      dateCloture:[null],
      tauxBen:[0],
      montantMinimum:[0],
      typeOperation:[null],
      ran:[0],
      montantAcapitaliser:[0],
      codePlan:[null],
      libelle:[null],
      cpteCapital:[0],
      cpteBenefice:[0],
      cptePerte:[0],
      cpteDistribution:[0]
    })

    this.afficherExercice();
    this.form.patchValue({typeOperation:"CAPITALISATION PARTIELLE"})
    this.afficherSolde();
  }
  typeOperationChange(){
    let typeOperation=this.form.value.typeOperation
    switch (typeOperation)
      {
      case "DECLASSEMENT":
          this.form.patchValue({ran:"0"})
           this.form.patchValue({montantAcapitaliser:"0"})
          // msk_Montant.ReadOnly = true;
          // msk_A_Capitaliser.ReadOnly = true;
          break;

      case "CAPITALISATION PARTIELLE":
          this.afficherSolde();
          this.form.patchValue({montantAcapitaliser:"0"})
          // msk_Montant.ReadOnly = true;
          // msk_A_Capitaliser.ReadOnly = false;
          break;

      default:
        this.afficherSolde();
          // msk_A_Capitaliser.Value = montant;
          // msk_Montant.ReadOnly = true;
          // msk_A_Capitaliser.ReadOnly = true;
          break;

      }
  }
  precedent(){
    this.submittingPrecedent=true
    this.submittingSuivant=false
    this.nbreSuivant--;
    if(this.nbreSuivant===2)
    {
      this.pageInfo.setTitle("REGULARISATION DES COMPTES DE CAPITAUX(Etape (1/3))")
      // this.afficherEtape(1);
    }
    else
      if(this.nbreSuivant===3)
      {
        this.pageInfo.setTitle("RESULTAT DE L'EXERCICE CLOS(Etape (2/3))")
        // this.afficherEtape(2);
        this.submittingSuivant=false
        this.submittingPrecedent=false
        
      }
      else
        if(this.nbreSuivant===4)
        {
          
          this.pageInfo.setTitle("IMPOSITION(Etape (3/3))")
          // this.afficherEtape(3);
          this.submittingSuivant=false
          this.submittingPrecedent=false
        }
        else
          if(this.nbreSuivant===1){
            this.pageInfo.setTitle("CLOTURE D'EXERCICE (DEBUT)")
          }
  }
  suivant(){
    let montantAcapitaliser=Number(this.form.value.montantAcapitaliser)
    let ran=Number(this.form.value.ran)
    let typeOperation=this.form.value.typeOperation
     if (montantAcapitaliser>ran)
      {
          alert("Le montant à capitaliser ne peut exceder celui en RAN");
          return;
      }

      if (montantAcapitaliser!=0 && montantAcapitaliser == ran && typeOperation === "CAPITALISATION PARTIELLE")
      {
          alert( "Le montant à capitaliser ne peut etre égale à celui en RAN pour une capitalisation partielle");
          //msk_A_Capitaliser.Value = 0;
          return;
      }
    this.submittingSuivant=true
    this.submittingPrecedent=false
    this.nbreSuivant++;
    if(this.nbreSuivant===2)
    {
      this.pageInfo.setTitle("REGULARISATION DES COMPTES DE CAPITAUX(Etape (1/3))")
      this.afficherEtape();
    }
    else
      if(this.nbreSuivant===3)
      {
        this.pageInfo.setTitle("RESULTAT DE L'EXERCICE CLOS(Etape (2/3))")
        this.submittingSuivant=false
        this.submittingPrecedent=false
        // this.afficherEtape(2);
        
      }
      else
        if(this.nbreSuivant===4)
        {
          
          this.pageInfo.setTitle("IMPOSITION(Etape (3/3))")
          this.submittingSuivant=false
                this.submittingPrecedent=false
          // this.afficherEtape(3);
        }
        else
          if(this.nbreSuivant===1){
            this.pageInfo.setTitle("CLOTURE D'EXERCICE (DEBUT)")
          }
        else
          if(this.nbreSuivant===5){
            this.pageInfo.setTitle("CLOTURE D'EXERCICE (FIN)")
          }
  }
  terminer(){
    this.valider=true
     let dateCloture: any;
    if(this.form.controls.dateCloture.value)
    {
      dateCloture = new Date(
        this.form.controls.dateCloture.value.year,
        this.form.controls.dateCloture.value.month-1,
        this.form.controls.dateCloture.value.day+1);
    }
    let ran=Number(this.form.value.montantAcapitaliser)
    let entity={
      idOpcvm:this.currentOpcvm.idOpcvm,
      ran:ran,
      dateCloture:dateCloture
    }
    this.librairiesService.clotureExercice(entity,
      this.authService.currentUserValue?.username).subscribe(
        (data)=>{
          console.log(data.data)
          alert(data.data)
          this.valider=false
        }
      )
  }
  afficherEtape(){
    
       let dateCloture: any;
    if(this.form.controls.dateCloture.value)
    {
      dateCloture = new Date(
        this.form.controls.dateCloture.value.year,
        this.form.controls.dateCloture.value.month-1,
        this.form.controls.dateCloture.value.day+1);
    }
    let ran=Number(this.form.value.montantAcapitaliser)
    let entity={
      idOpcvm:this.currentOpcvm.idOpcvm,
      etape:1,
      ran:ran,
      dateCloture:dateCloture
    }
    this.librairiesService.ligneMvtClotureExercice(entity).subscribe(
      (data)=>{
        this.ligneMvtClotureExercice$=data.data
        console.log("1=",this.ligneMvtClotureExercice$)
        entity={
          idOpcvm:this.currentOpcvm.idOpcvm,
          etape:2,
          ran:ran,
          dateCloture:dateCloture
        }
        this.librairiesService.ligneMvtClotureExercice(entity).subscribe(
          (data)=>{
            this.ligneMvtClotureExercice2$=data.data
            console.log("2=",this.ligneMvtClotureExercice2$)
            entity={
              idOpcvm:this.currentOpcvm.idOpcvm,
              etape:3,
              ran:ran,
              dateCloture:dateCloture
            }
            this.librairiesService.ligneMvtClotureExercice(entity).subscribe(
              (data)=>{
                this.ligneMvtClotureExercice3$=data.data
                console.log("3=",this.ligneMvtClotureExercice3$)
                console.log(this.ligneMvtClotureExercice$)
                this.submittingSuivant=false
                this.submittingPrecedent=false
              }
            )
          }
        )
        // console.log(this.ligneMvtClotureExercice$)
        // this.submittingSuivant=false
        // this.submittingPrecedent=false
      }
    )
  }
  get totalDebit(): number {
    return this.ligneMvtClotureExercice$
      ?.reduce((sum, l) => sum + (Number(l.debit) || 0), 0) || 0;
  }
get totalCredit(): number {
    return this.ligneMvtClotureExercice$
      ?.reduce((sum, l) => sum + (Number(l.credit) || 0), 0) || 0;
  }
  get totalCredit2(): number {
    return this.ligneMvtClotureExercice2$
      ?.reduce((sum, l) => sum + (Number(l.credit) || 0), 0) || 0;
  }
  get totalDebit2(): number {
    return this.ligneMvtClotureExercice2$
      ?.reduce((sum, l) => sum + (Number(l.debit) || 0), 0) || 0;
  }

  get totalCredit3(): number {
    return this.ligneMvtClotureExercice3$
      ?.reduce((sum, l) => sum + (Number(l.credit) || 0), 0) || 0;
  }
  get totalDebit3(): number {
    return this.ligneMvtClotureExercice3$
      ?.reduce((sum, l) => sum + (Number(l.debit) || 0), 0) || 0;
  }

  
  afficherSolde(){
     let dateCloture: any;
    if(this.form.controls.dateCloture.value)
    {
      dateCloture = new Date(
        this.form.controls.dateCloture.value.year,
        this.form.controls.dateCloture.value.month-1,
        this.form.controls.dateCloture.value.day+1);
    }
    let entity={
      ib:this.currentOpcvm.idOpcvm,
      rubrique:'58000',
      position:'20',
      date:dateCloture
    }
    this.formuleService.soldeCompte(entity).subscribe(
      (data)=>{
        this.solde$=data.data
        this.form.patchValue({ran:this.solde$})
        let typeOperation=this.form.value.typeOperation
        if(typeOperation==="CAPITALISATION TOTALE"){
                  this.form.patchValue({montantAcapitaliser:this.solde$})
                }
        if(this.solde$===0){
            entity={
              ib:this.currentOpcvm.idOpcvm,
              rubrique:'58000',
              position:'30',
              date:dateCloture
            }
            this.formuleService.soldeCompte(entity).subscribe(
              (data)=>{
                let typeOperation=this.form.value.typeOperation
                this.solde$=data.data
                this.form.patchValue({ran:this.solde$})
                console.log(typeOperation)
                if(typeOperation==="CAPITALISATION TOTALE"){
                  this.form.patchValue({montantAcapitaliser:this.solde$})
                }
              }
            )
        }
      }
    )
  }
  afficherExercice(){
    this.exerciceService.afficherExerciceCourant(this.currentOpcvm.idOpcvm).subscribe
    ((data)=>{
      this.exercice$=data.data
       console.log(this.exercice$)
          // this.form.patchValue({tauxBen:this.exercice$.tauxBenefice})
          // this.form.patchValue({montantMinimum:this.exercice$.montantMinimum})
          this.form.patchValue({codeExercice:this.exercice$.codeExercice})
      let dateDebut = new Date(this.exercice$.dateDebut);
          this.form.patchValue({dateDebut: new NgbDate(
              dateDebut.getFullYear(), dateDebut.getMonth()+1, dateDebut.getDate())});
          let dateFin = new Date(this.exercice$.dateFin);
          this.form.patchValue({dateFin: new NgbDate(
              dateFin.getFullYear(), dateFin.getMonth()+1, dateFin.getDate())});
          let dateCloture = new Date(this.exercice$.dateCloture);
          this.form.patchValue({dateCloture: new NgbDate(
              dateFin.getFullYear(), dateFin.getMonth()+1, dateFin.getDate())});
          this.form.patchValue({codePlan:this.exercice$.plan.codePlan.trim()})
          this.form.patchValue({libelle:this.exercice$.plan.libellePlan.trim()})
          this.form.patchValue({cpteBenefice:this.exercice$.plan.numCompteBenefice.trim()})
          this.form.patchValue({cpteCapital:this.exercice$.plan.numCompteCapital.trim()})
          this.form.patchValue({cptePerte:this.exercice$.plan.numComptePerte.trim()})
          this.form.patchValue({cpteDistribution:this.exercice$.plan.numCompteResInsDistribution.trim()})
    })
  }
  get f(){
    return this.form.controls;
  }
}
