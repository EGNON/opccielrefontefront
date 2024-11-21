import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from "rxjs";
import {Monnaie} from "../../../../crm/models/monnaie.model";
import {Opcvm} from "../../../../core/models/opcvm";
import {Actionnaireopcvm} from "../../../models/actionnaireopcvm.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActionnaireopcvmService} from "../../../services/actionnaireopcvm.service";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {AuthService} from "../../../../core/modules/auth";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize} from "rxjs/operators";
import {Personne} from "../../../../crm/models/personne/personne.model";
import {ActionnairecommissionService} from "../../../services/actionnairecommission.service";
import {ProfilcommissionsousrachService} from "../../../services/profilcommissionsousrach.service";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {LocalService} from "../../../../services/local.service";

@Component({
  selector: 'app-actionnairecommission-add-edit',
  templateUrl: './actionnairecommission-add-edit.component.html',
  styleUrl: './actionnairecommission-add-edit.component.scss'
})
export class ActionnairecommissionAddEditComponent implements OnInit, OnDestroy{
  id?: number;
  id2?: number;
  id3?: number;
  monnaies$: Observable<Monnaie[]>;
  opcvm:Opcvm;
  personne$: any;
  profil$: any;
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
    private localStore: LocalService,
    public entityService: ActionnairecommissionService,
    public personneService: PersonneService,
    public profilCommissionSousRachService: ProfilcommissionsousrachService,
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
        personne: [null,Validators.required],
        codeProfil:[null],
        libelleProfil:[null],
        typeCommission:[null,Validators.required],
        date:[null,Validators.required],
        profilCommissionSousRach:[null],

      }
    );
    this.getPersonne()
    // this.paysSelect = document.getElementById("ComboPaysLab");
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification de conditions de tarification des actionnaires")
      const sb = this.entityService.afficherSelonId(this.id,this.id2,this.id3)
        .subscribe((entity)=>{
          this.entity=entity.data;
          this.loadFormValues(entity.data);
        });
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout de conditions de tarification")
  }
  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({typeCommission:entity.typeCommission});
    this.entityForm.patchValue({codeProfil: entity.codeProfil});
    this.entityForm.patchValue({personne: entity.personne});
    //this.entityForm.patchValue({id: entity.idPays});
    this.dateRecup=entity.date;
    //let date1 = new Date((this.dateRecup[0]+"/"+this.dateRecup[1]+"/"+this.dateRecup[2]));
    let date1 = new Date(entity.date);
    console.log("data",date1)
    this.entityForm.patchValue({date: new NgbDate(
        date1.getFullYear(), date1.getMonth()+1, date1.getDate())});
    this.getProfil()
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  getPersonne()
  {
    const sb  = this.personneService.afficherPersonneInOpcvm(
      this.localStore.getData("currentOpcvm")?.idOpcvm).subscribe(
      (data)=>{
        this.personne$=data
      }
    )
  }
  getProfil()
  {
    const sb  = this.profilCommissionSousRachService.afficherSelonTypeCommissionOpcvm(
      this.entityForm.value.typeCommission,
      this.localStore.getData("currentOpcvm")?.idOpcvm
    ).subscribe(
      (data)=>{
        this.profil$=data.data
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
          this.router.navigate(['/opcvm/standard/tarificationactionnaire']);
        })
      )
      .subscribe();

    this.subscriptions.push(sb);
  }
  afficherCodeProfil(){
    this.entityForm.patchValue({codeProfil:this.entityForm.value.profilCommissionSousRach.codeProfil.trim()});
  }
  saveEntity() {
    this.opcvm=new Opcvm();
    this.opcvm.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm;
    let date: any;
    if (this.entityForm.controls.date.value) {
      date = new Date(
        this.entityForm.controls.date.value.year,
        this.entityForm.controls.date.value.month-1,
        this.entityForm.controls.date.value.day+1);
    }
    let libelleProfil=""
    if(this.entityForm.value.profilCommissionSousRach!=null){
      libelleProfil=this.entityForm.value.profilCommissionSousRach.libelleProfil
    }
    const entity: any = {
      ...this.entityForm.value,
      libelleProfil:libelleProfil,
      date:date,
      opcvm:this.opcvm
    };
     console.log("act1",entity)
    return this.id
      ? this.entityService.modifier(this.id,this.id2,this.id3,entity)
      : this.entityService.create(entity);
  }
}
