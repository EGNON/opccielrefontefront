import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router } from '@angular/router';
import {catchError, finalize, Observable, of, Subscription } from 'rxjs';
import { Opcvm } from '../../../../core/models/opcvm';
import { AuthService } from '../../../../core/modules/auth';
import { NantissementService } from '../../../../core/services/nantissement.service';
import { Monnaie } from '../../../../crm/models/monnaie.model';
import { PersonneService } from '../../../../crm/services/personne/personne.service';
import { PageInfoService } from '../../../../template/_metronic/layout';
import { Detailprofil } from '../../../models/detailprofil.model';
import { DepotrachatService } from '../../../services/depotrachat.service';

@Component({
  selector: 'app-intentionrachat-add-edit',
  templateUrl: './intentionrachat-add-edit.component.html',
  styleUrl: './intentionrachat-add-edit.component.scss'
})
export class IntentionrachatAddEditComponent implements OnInit, OnDestroy{
  id?: number;
  id2?: number;
  opcvm:Opcvm;
  personneDistributeur$: any;
  personneActionnaire$: any;
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
  entity:any;
  private subscriptions: Subscription[] = [];

  constructor(
    public entityService: DepotrachatService,
    public nantissementService: NantissementService,
    public personneService: PersonneService,
    public authService: AuthService,
    public pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.id2 = this.route.snapshot.params['id2'];
    /*console.log("id=",this.id)
    console.log("id2=",this.id2)*/
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        referencePiece: [null,Validators.required],
        modeVL: [null,Validators.required],
        dateOperation: [null,Validators.required],
        personne: [null,Validators.required],
        personneActionnaire: [null,Validators.required],
        partDisponible: [null],
        partNanti: [null],
        partRestant: [null],
        quantite: [null,Validators.required],
        libelleOperation: [null],
      }
    );
    this.afficherActionnaire()
    this.afficherDistributeur()
    // this.paysSelect = document.getElementById("ComboPaysLab");
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification d'intention de rachat'")
      /*const sb = this.entityService.afficherSelonOpcvm(this.id,
        this.authService.LocalStorageManager.getValue("currentOpcvm")?.idOpcvm)
        .subscribe((entity)=>{
          console.log("profil=",entity.data)
          this.entity=entity.data;
          this.loadFormValues(entity.data);
        });
      this.subscriptions.push(sb);*/
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
      this.authService.LocalStorageManager.getValue("currentOpcvm")?.idOpcvm
    ).subscribe(
      (data)=>{
        this.personneActionnaire$=data;
        console.log(data)
      }
    )
  }
  afficherNbrePart(){
    console.log("pass")
      this.entityService.afficherNbrePart(this.authService.LocalStorageManager.getValue("currentOpcvm")?.idOpcvm,
        this.entityForm.value.personneActionnaire.idPersonne).subscribe(
        (data)=>{
          this.objetPart=data
          console.log(this.objetPart)
          //console.log(this.objetPart[0][4])
          this.entityForm.patchValue({partDisponible:this.objetPart[0][1]})
          this.entityForm.patchValue({partNanti:this.objetPart[0][0]})
          this.entityForm.patchValue({partRestant:this.objetPart[0][2]})
          //this.partDispo=data[0][4]
          /*this.nantissementService.afficherPartNanti(this.authService.LocalStorageManager.getValue("currentOpcvm")?.idOpcvm,
            this.entityForm.value.personneActionnaire.idPersonne).subscribe(
            (data)=>{
              this.objetNanti=data;
              console.log(this.objetNanti)
              this.entityForm.patchValue({partNanti:data})
              this.partDispo=data
              this.partRestant=this.partDispo-this.partNanti
              this.entityForm.patchValue({partRestant:this.partRestant})
            }
          )*/
        }
      )
  }
  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({codeProfil:
      entity.codeProfil});
    this.entityForm.patchValue({libelleProfil: entity.libelleProfil});
    this.entityForm.patchValue({id: entity.codeProfil});
    this.entityForm.patchValue({typeCommission: entity.typeCommission});
    this.entityForm.patchValue({standard: entity.standard});
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
    this.opcvm=new Opcvm();
    this.opcvm.idOpcvm=this.authService.LocalStorageManager.getValue("currentOpcvm").idOpcvm;

    const entity: any = {
    ...this.entityForm,
      idSeance:this.id2,
      opcvm:this.opcvm
    };
    console.log("act1",entity)
    return this.id
      ? this.entityService.update(entity)
      : this.entityService.create(entity);
  }
}


