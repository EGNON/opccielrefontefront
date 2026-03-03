import {Component, OnInit} from '@angular/core';
import {LocalService} from "../../../../services/local.service";
import {AuthService} from "../../../../core/modules/auth";
import {OperationextournevdeService} from "../../../services/operationextournevde.service";
import {OperationdifferenceestimationService} from "../../../services/operationdifferenceestimation.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SeanceopcvmService} from "../../../services/seanceopcvm.service";

@Component({
    selector: 'app-generationdifferenceestimation',
    templateUrl: './generationdifferenceestimation.component.html',
    styleUrl: './generationdifferenceestimation.component.scss',
    standalone: false
})
export class GenerationdifferenceestimationComponent implements OnInit{
  currentSeance: any;
  downloading: boolean;
  griseBouton: boolean;
  entityForm: FormGroup;
  constructor(
    private localStore: LocalService,
    private authService: AuthService,
    private fb: FormBuilder,
    public operationDifferenceEstimationService:OperationdifferenceestimationService,
    public seanceOpcvmService:SeanceopcvmService) {
    this.currentSeance = this.localStore.getData("currentSeance");
  }
  ngOnInit(): void {
    this.entityForm = this.fb.group(
      {
        estEnCloture:[false,Validators.required],
      }
    );
    // console.log(this.currentSeance?.estEnCloture)
    this.seanceOpcvmService.afficherSeanceEnCours(this.currentSeance?.idSeanceOpcvm.idOpcvm).subscribe(
      (data)=>{
        this.griseBouton=data.data.estEnCloture
      }
    )

    this.downloading=false;
  }
  close() {
    // this.dialogRef.close();
  }
  generationDifferenceEstimation(){
    this.downloading=true
    console.log(this.entityForm.value.estEnCloture)
    this.operationDifferenceEstimationService.generationDifferenceEstimation(
      this.localStore.getData("currentOpcvm")?.idOpcvm,this.entityForm.value.estEnCloture).subscribe(
      (data)=>{
        console.log(data.data);
        if(data.data!=="Lors de la cloture de séance,aucune autre opération ne pourra etre éffectuée.")
            alert(data.data);
        else
        {
          alert(data.data+"\nVeuillez passer après avoir cliqué sur ok à la génération des différences estimations")
          // alert("Vous pouvez passer maintenant aux autres étapes de la clôture")
           window.location.reload();
        }
          
        this.downloading=false;
      }
    )
  }

}
