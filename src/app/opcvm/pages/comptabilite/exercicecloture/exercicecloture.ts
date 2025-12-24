import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalService } from '../../../../services/local.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormuleService } from '../../../../core/services/formule.service';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
import { ExerciceService } from '../../../services/exercice.service';

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
  exercice$:any;
  solde$:any
  nbreSuivant:number
  constructor(
    public exerciceService:ExerciceService,
    public formuleService:FormuleService,
    public localStore:LocalService,
    public fb:FormBuilder
  ){
    this.currentOpcvm=localStore.getData("currentOpcvm")
    this.currentSeance=localStore.getData("currentSeance")
    console.log(this.currentOpcvm)
  }
  ngOnInit(): void {
    this.nbreSuivant=1
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
    this.nbreSuivant--;
  }
  suivant(){
    this.nbreSuivant++;
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
      // console.log(this.exercice$)
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
    })
  }
  get f(){
    return this.form.controls;
  }
}
