import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from "rxjs";
import {Monnaie} from "../../../../crm/models/monnaie.model";
import {Opcvm} from "../../../../core/models/opcvm";
import {Actionnaireopcvm} from "../../../models/actionnaireopcvm.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActionnairecommissionService} from "../../../services/actionnairecommission.service";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {ProfilcommissionsousrachService} from "../../../services/profilcommissionsousrach.service";
import {AuthService} from "../../../../core/modules/auth";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {catchError, filter, finalize, map} from "rxjs/operators";
import {TarificationordinaireService} from "../../../services/tarificationordinaire.service";
import {ClassetitreService} from "../../../../core/services/classetitre.service";
import {PersonneMoraleService} from "../../../../crm/services/personne/personne.morale.service";
import {PlaceService} from "../../../../core/services/place.service";

@Component({
  selector: 'app-tarificationordinaire-add-edit',
  templateUrl: './tarificationordinaire-add-edit.component.html',
  styleUrl: './tarificationordinaire-add-edit.component.scss'
})
export class TarificationordinaireAddEditComponent implements OnInit, OnDestroy{
  qualite: string;
  id?: number;
  id2?: number;
  id3?: number;
  monnaies$: Observable<Monnaie[]>;
  opcvm:Opcvm;
  personne$: any;
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
    public entityService: TarificationordinaireService,
    public personneService: PersonneMoraleService,
    public classeTitreService: ClassetitreService,
    public placeService: PlaceService,
    public authService: AuthService,
    public pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.id2 = this.route.snapshot.params['id2'];
    this.id3 = this.route.snapshot.params['id3'];
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        registraire: [null,Validators.required],
        depositaire: [null,Validators.required],
        place: [null,Validators.required],
        classeTitre: [null,Validators.required],
        codeRole:[null,Validators.required],
        taux:[null],
        borneInferieur:[null,Validators.required],
        borneSuperieur:[null,Validators.required],
        forfait:[null,Validators.required],

      }
    );


    const qualiteSubscription = this.route.parent?.paramMap.pipe(
      filter(paramMap => paramMap.has('qualite')),
      map(paramMap => paramMap.get('qualite'))
    ).subscribe(qualite => {
      this.qualite = qualite!;});
    this.getPersonne()
    this.getClasseTitre()
    if(this.qualite==="place")
    {
      this.getPlace()
    }
    // this.paysSelect = document.getElementById("ComboPaysLab");
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification de conditions de tarification OPC("+this.qualite+")")
      const sb = this.entityService.afficherTarificationSelonId(this.id,this.qualite)
        .subscribe((entity)=>{
          this.entity=entity.data;
          this.loadFormValues(entity.data);
        });
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout de conditions de tarification OPC("+this.qualite+")")



    if(this.qualite==="sgi")
    {
      this.entityForm.controls["depositaire"].setErrors(null);
      this.entityForm.controls["depositaire"].clearValidators();
      this.entityForm.controls["depositaire"].updateValueAndValidity();

      this.entityForm.controls["place"].setErrors(null);
      this.entityForm.controls["place"].clearValidators();
      this.entityForm.controls["place"].updateValueAndValidity();
    }

    if(this.qualite==="depositaire")
    {
      this.entityForm.controls["registraire"].setErrors(null);
      this.entityForm.controls["registraire"].clearValidators();
      this.entityForm.controls["registraire"].updateValueAndValidity();

      this.entityForm.controls["place"].setErrors(null);
      this.entityForm.controls["place"].clearValidators();
      this.entityForm.controls["place"].updateValueAndValidity();
    }
    if(this.qualite==="place")
    {
      this.entityForm.controls["registraire"].setErrors(null);
      this.entityForm.controls["registraire"].clearValidators();
      this.entityForm.controls["registraire"].updateValueAndValidity();

      this.entityForm.controls["depositaire"].setErrors(null);
      this.entityForm.controls["depositaire"].clearValidators();
      this.entityForm.controls["depositaire"].updateValueAndValidity();
    }
  }
  loadFormValues(entity: any)
  {
    let taux=entity.taux;
    let borneInferieur:string=entity.borneInferieur;
    // if(borneInferieur===0)
    //   borneInferieur+="0";
    this.entity = entity;
    console.log("borne",borneInferieur)
    this.entityForm.patchValue({taux:taux.toString().replace('.',',')});
    this.entityForm.patchValue({forfait:entity.forfait.toString().trim()});
    this.entityForm.patchValue({codeRole:entity.codeRole});
    this.entityForm.patchValue({classeTitre:entity.classeTitre});
    this.entityForm.patchValue({borneInferieur: borneInferieur.toString().trim()});
    this.entityForm.patchValue({borneSuperieur: entity.borneSuperieur});
    if(this.qualite==="sgi")
      this.entityForm.patchValue({registraire: entity.registraire});
    else
      if(this.qualite==="depositaire")
        this.entityForm.patchValue({depositaire: entity.depositaire});
      else
        this.entityForm.patchValue({place: entity.place});
    //this.entityForm.patchValue({id: entity.idPays});

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  getPersonne()
  {
    if(this.qualite==="sgi")
    {
      const sb  = this.personneService.afficherPersonneSelonQualite(
        "registraire").subscribe(
        (data)=>{
          this.personne$=data
        }
      )
    }
    else
    {
      const sb  = this.personneService.afficherPersonneSelonQualite(
        "depositaire").subscribe(
        (data)=>{
          this.personne$=data
        }
      )
    }
  }
  getClasseTitre()
  {
    const sb  = this.classeTitreService.afficherTous(
    ).subscribe(
      (data)=>{
        this.classeTitre$=data.data
      }
    )
  }
  getPlace()
  {
    const sb  = this.placeService.afficherTous(
    ).subscribe(
      (data)=>{
        this.place$=data.data
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
          this.router.navigate([`/opcvm/standard/tarification/${this.qualite}`]);
        })
      )
      .subscribe();

    this.subscriptions.push(sb);
  }
  afficherCodeProfil(){
    this.entityForm.patchValue({codeProfil:this.entityForm.value.profilCommissionSousRach.codeProfil});
  }
  saveEntity() {
    this.opcvm=new Opcvm();
    this.opcvm.idOpcvm=this.authService.LocalStorageManager.getValue("currentOpcvm")?.idOpcvm;
    let date: any;

    const entity: any = {
      ...this.entityForm.value,
      opcvm:this.opcvm,
      taux:this.entityForm.value.taux.replace(',','.')
    };
    console.log("act1",entity)
    return this.id
      ? this.entityService.update_TarificationOPC(entity,this.qualite)
      : this.entityService.create(entity);
  }
}
