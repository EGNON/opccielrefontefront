import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from "rxjs";
import {Monnaie} from "../../../../crm/models/monnaie.model";
import {Opcvm} from "../../../../core/models/opcvm";
import {Actionnaireopcvm} from "../../../models/actionnaireopcvm.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TarificationordinaireService} from "../../../services/tarificationordinaire.service";
import {PersonneMoraleService} from "../../../../crm/services/personne/personne.morale.service";
import {ClassetitreService} from "../../../../core/services/classetitre.service";
import {PlaceService} from "../../../../core/services/place.service";
import {AuthService} from "../../../../core/modules/auth";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, filter, finalize, map} from "rxjs/operators";
import {ChargeService} from "../../../services/charge.service";
import {NatureevenementService} from "../../../../core/services/natureevenement.service";
import {NatureoperationService} from "../../../../core/services/natureoperation.service";

@Component({
  selector: 'app-charge-add-edit',
  templateUrl: './charge-add-edit.component.html',
  styleUrl: './charge-add-edit.component.scss'
})
export class ChargeAddEditComponent implements OnInit, OnDestroy{
  qualite: string;
  id?: number;
  id2?: number;
  id3?: number;
  monnaies$: Observable<Monnaie[]>;
  opcvm:Opcvm;
  natureOperation$: any;
  estVisibleAppliquerTypeCharge:boolean;
  place$: any;
  classeTitre$: any;
  personne: any;
  actionnaireOpcvm: Actionnaireopcvm;
  isLoading = false;
  submitting = false;
  paysSelect:any;
  idPays:number;
  dateRecup:string[];
  idPersonne:number;
  submitted = false;
  entityForm: FormGroup;
  tableau:HTMLElement;
  nbreLigne: number;
  entity:any;
  private subscriptions: Subscription[] = [];

  constructor(
    public entityService: ChargeService,
    public natureOperationService: NatureoperationService,
    public authService: AuthService,
    public pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        codeCharge: [null,Validators.required],
        typeCharge: [null,Validators.required],
        designation: [null,Validators.required],
        montant: [null,Validators.required],
        natureOperation:[null,Validators.required],
        appliquerSurActifNet:[null,Validators.required],

      }
    );

    this.getNatureOperation()

    // this.paysSelect = document.getElementById("ComboPaysLab");
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification de charge à étaler")
      const sb = this.entityService.getById(this.id)
        .subscribe((entity)=>{
          this.entity=entity.data;
          this.loadFormValues(entity.data);
        });
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout de charge à étaler")

  }
  loadFormValues(entity: any)
  {
    let taux=entity.montant;
    this.entity = entity;
    this.entityForm.patchValue({montant:taux.toString().replace('.',',')});
    this.entityForm.patchValue({codeCharge:entity.codeCharge});
    this.entityForm.patchValue({typeCharge:entity.typeCharge});
    this.appliquerTypeCharge()
    this.entityForm.patchValue({appliquerSurActifNet:entity.appliquerSurActifNet});
    this.entityForm.patchValue({natureOperation:entity.natureOperation});
    this.entityForm.patchValue({designation: entity.designation});

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  getNatureOperation()
  {

      const sb  = this.natureOperationService.afficherTous().subscribe(
        (data)=>{
          this.natureOperation$=data.data
        }
      )
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
          this.router.navigate([`/opcvm/standard/chargeaetaler/${this.qualite}`]);
        })
      )
      .subscribe();

    this.subscriptions.push(sb);
  }
  appliquerTypeCharge(){
    if(this.entityForm.value.typeCharge==="VARIABLE")
      this.estVisibleAppliquerTypeCharge=true;
    else
      this.estVisibleAppliquerTypeCharge=false;
  }
  saveEntity() {
    this.opcvm=new Opcvm();
    this.opcvm.idOpcvm=this.authService.LocalStorageManager.getValue("currentOpcvm")?.idOpcvm;
    let date: any;

    const entity: any = {
      ...this.entityForm.value,
      opcvm:this.opcvm,
      montant:this.entityForm.value.montant.replace(',','.'),
      estActif:true
    };
    console.log("act1",entity)
    return this.id
      ? this.entityService.update(entity)
      : this.entityService.create(entity);
  }
}
