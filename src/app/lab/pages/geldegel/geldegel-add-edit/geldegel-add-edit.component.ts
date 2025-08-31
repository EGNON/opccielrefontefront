import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from "rxjs";
import {Monnaie} from "../../../../crm/models/monnaie.model";
import {Pays} from "../../../../crm/models/pays.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize} from "rxjs/operators";
import {GelDegelService} from "../../../services/geldegel.service";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {Personne} from "../../../../crm/models/personne/personne.model";
import {PersonnePhysiqueService} from "../../../../crm/services/personne/personne.physique.service";
import {PersonneMoraleService} from "../../../../crm/services/personne/personne.morale.service";

@Component({
    selector: 'app-geldegel-add-edit',
    templateUrl: './geldegel-add-edit.component.html',
    styleUrl: './geldegel-add-edit.component.scss',
    standalone: false
})
export class GeldegelAddEditComponent implements OnInit, OnDestroy{
  id?: number;
  monnaies$: Observable<Monnaie[]>;
  pays$: Observable<Pays[]>;
  personne$: any;
  personne: Personne;
  personnePhysique: any;
  personneMorale: any;
  personneSelonId: Personne;
  isLoading = false;
  submitting = false;
  paysSelect:any;
  idPays:number;
  idPersonne:any;
  submitted = false;
  entityForm: FormGroup;
  entity:any;
  buttonText:string;
  private subscriptions: Subscription[] = [];

  constructor(
    public entityService: GelDegelService,
    public personneService: PersonneService,
    public personnePhysiqueService: PersonnePhysiqueService,
    public personneMoraleService: PersonneMoraleService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        idGelDegel: [this.id],
        dateDebut: [null],
        dateFin: [null],
        personneDto: [null, Validators.required],
      }
    );
    // this.getPersonne()
    // this.getPersonneById()
    this.buttonText="Geler"
    // this.paysSelect = document.getElementById("ComboPaysLab");
    if(this.id)
    {
      this.buttonText="Dégeler"

      const sb = this.personneService.getById(this.id)
        // .pipe(tap(
        //   entity => {
        //
        //   }
        // ))
        .subscribe((entity)=>{
          this.entity=entity;
          this.loadFormValues(entity);
        });
      this.subscriptions.push(sb);
    }

  }
  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({id: entity.idGelDegel});
    this.entityForm.patchValue({dateFin: entity.dateFin});
    this.entityForm.patchValue({personneDto: entity});
    this.personne=entity;
    this.entityForm.patchValue({dateDebut: entity.dateDebut});
  }
  getPersonne(){
    this.personneService.afficherPersonneExposeJuge().subscribe(
      (data)=>{
        this.personne$=data;
      }
    )
  }
  getPersonneById(){
    this.idPersonne=this.id;
    this.personneService.afficherPersonneSelonId(this.idPersonne).subscribe(
      (data)=>{
        this.personne=data;
      }
    )
  }
  retournerPays()
  {
    this.idPays = this.paysSelect.options[this.paysSelect.selectedIndex].value;
    this.id=this.idPays;
    const sb = this.entityService.getEntityById(this.idPays)
      .subscribe((entity)=>{
        this.entity=entity;
        this.loadFormValues(entity);
      });
    this.subscriptions.push(sb);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }


  get f() { return this.entityForm.controls; }

  onSaveEntity()
  {
    this.isLoading = true;
    this.submitted = true;
    let entity=null;
    if(this.entityForm.invalid) return;
    const sb = this.saveEntity()
      .pipe(
        catchError((err) => {
          return of(undefined);
        }),
        finalize(() => {
          this.submitted = false;
          this.isLoading = false;
          this.router.navigate(['/lab/geldegel']);
        })
      )
      .subscribe(
        (data)=>{

          if(this.personne.typePersonne=="PH"){
            this.personnePhysiqueService.getById(this.id)

              .subscribe((data)=>{
                this.personnePhysique=data;
                entity=null;
                // @ts-ignore
                entity = {...this.personnePhysique,
                  id:this.personnePhysique.idPersonne,
                  estGele:false
                };
                // return
                this.personnePhysiqueService.update(entity)
                  .subscribe();
              });
          }
          else
          {
            this.personneMoraleService.getById(this.id)
              .subscribe((data)=>{
                this.personneMorale=data;
                entity=null;
                // @ts-ignore
                entity = {...this.personneMorale,
                  estGele:false,
                  id:this.personneMorale.idPersonne,

                };
                // return
                this.personneMoraleService.update(entity)
                  .subscribe();
              });
          }
        }
      );
    this.subscriptions.push(sb);
  }

  saveEntity() {
    let dateDebut: any;
    if(this.entityForm.controls.dateDebut.value)
    {
      dateDebut = new Date(
        this.entityForm.controls.dateDebut.value.year,
        this.entityForm.controls.dateDebut.value.month-1,
        this.entityForm.controls.dateDebut.value.day+1);
    }
    let dateFin: any;
    if(this.entityForm.controls.dateFin.value)
    {
      dateFin = [
        this.entityForm.controls.dateFin.value.year,
        this.entityForm.controls.dateFin.value.month-1,
        this.entityForm.controls.dateFin.value.day+1].join('-')+"T"+[
        this.entityForm.controls.dateFin.value.hour,
        this.entityForm.controls.dateFin.value.minutes,
        this.entityForm.controls.dateFin.value.seconds].join(':');
    }
    let entity=null;
    if(this.id) {
      entity = {
        ...this.entityForm.value,
        estGele:false,
        dateDebut:dateDebut,
        dateFin:dateFin
      };
    }
    else
    {
      entity = {
        ...this.entityForm.value,
        estGele:true,
        dateDebut:dateDebut,
        dateFin:dateFin
      };
    }

    return this.id
      ? this.entityService.updateGelDegel(entity,this.id)
      : this.entityService.createRow(entity);
  }
}


