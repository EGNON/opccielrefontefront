import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, catchError, of, finalize } from 'rxjs';
import { MonnaieService } from '../../../../crm/services/monnaie.service';
import { LibrairiesService } from '../../../../services/librairies.service';
import { PageInfoService } from '../../../../template/_metronic/layout';

@Component({
  selector: 'app-definitionarrondi-add-edit',
  standalone: false,
  templateUrl: './definitionarrondi-add-edit.html',
  styleUrl: './definitionarrondi-add-edit.scss'
})
export class DefinitionarrondiAddEdit implements OnInit, AfterViewInit, OnDestroy{
  id?: number;
  monnaies$: any;
  isLoading = false;
  submitting = false;
  submitted = false;
  entityForm: FormGroup;
  entity:any;
  private subscriptions: Subscription[] = [];

  constructor(
    public entityService: LibrairiesService,
    public monnaieService: MonnaieService,
    public pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    let date =new Date();
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        numLigne: [this.id],
        codeDefinitionArrondi: [null, Validators.required],
        libelleDefinitionArrondi: [null, Validators.required],
        nbreDecimaux: [null, Validators.required],
        estParDefaut: [false],
        arrondis: ['S'],
        arrondisNormal: ['I'],
       
      }
    );
    
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification définition arrondi")
      const sb = this.entityService.afficherDefinitionArrondiById(this.id)
        .subscribe((entity)=>{
          this.entity=entity.data;
          this.loadFormValues(entity.data);
        });
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout définition arrondi")
  }
  normalChanged(){

  }
  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({codeDefinitionArrondi:entity.codeDefinitionArrondi});
    this.entityForm.patchValue({libelleDefinitionArrondi:entity.libelleDefinitionArrondi});
    this.entityForm.patchValue({nbreDecimaux: entity.nbreDecimaux});
    this.entityForm.patchValue({estParDefaut: entity.estParDefaut});
    let type=entity.typeArrondi
    this.entityForm.patchValue({arrondis: type.trim()});
    if(entity.estParValSup===true)
      type="S"
    else
      type="I"
    this.entityForm.patchValue({arrondisNormal: type.trim()});
    
    
   }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  getMonnaieAll()
  {
    this.monnaieService.afficherMonnaieListe().subscribe(
      (data)=>{
        this.monnaies$=data;
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
          this.router.navigate(['/app/standard/parametre/definitionarrondi']);
        })
      )
      .subscribe();
    this.subscriptions.push(sb);
  }

  saveEntity() {
    // let date: any;
    //   if (this.entityForm.controls.date.value) {
    //     date = new Date(
    //       this.entityForm.controls.date.value.year,
    //       this.entityForm.controls.date.value.month-1,
    //       this.entityForm.controls.date.value.day+1);
    //   }
    let valSup=false;
    let typeArrondi="";
    if (this.entityForm.value.arrondis==="I")
    {
        valSup = false;
        typeArrondi = "I";
    }
    else
    {
        if (this.entityForm.value.arrondis==="S")
        {
            valSup = true;
            typeArrondi = "S";
        }
        else
        {
            if (this.entityForm.value.arrondisNormal==="I")
            {
                valSup = false;
                typeArrondi = "N";
            }
            else
            {
                if (this.entityForm.value.arrondisNormal==="S")
                {
                    valSup = true;
                    typeArrondi = "N";
                }
                else
                {
                    valSup = false;
                    typeArrondi = "N";
                }
            }
        }
    }
    let entity: any = {
      ...this.entityForm.value,
      typeArrondi:typeArrondi,
      estParValSup:valSup,
      obserVationModeleArrondis:""
    };
    if(this.id)
      entity={
    ...entity,
    numLigne:this.id
    }
    return this.id
      ? this.entityService.modifierDefinitionArrondi(entity)
      : this.entityService.enregistrerDefinitionArrondi(entity);
  }

  ngAfterViewInit(): void {
    $('.select2').select2();
  }
}
