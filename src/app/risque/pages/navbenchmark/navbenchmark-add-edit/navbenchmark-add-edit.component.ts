import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from "rxjs";
import {Monnaie} from "../../../../crm/models/monnaie.model";
import {Opcvm} from "../../../../core/models/opcvm";
import {Detailprofil} from "../../../../opcvm/models/detailprofil.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocalService} from "../../../../services/local.service";
import {ProfilcommissionsousrachService} from "../../../../opcvm/services/profilcommissionsousrach.service";
import {DetailprofilService} from "../../../../opcvm/services/detailprofil.service";
import {AuthService} from "../../../../core/modules/auth";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize} from "rxjs/operators";
import {SeanceopcvmService} from "../../../../opcvm/services/seanceopcvm.service";

@Component({
    selector: 'app-navbenchmark-add-edit',
    templateUrl: './navbenchmark-add-edit.component.html',
    styleUrl: './navbenchmark-add-edit.component.scss',
    standalone: false
})
export class NavbenchmarkAddEditComponent implements OnInit, OnDestroy{
  id?: number;
  idSeance?: number;
  idOpcvm?: number;
  monnaies$: Observable<Monnaie[]>;
  opcvm:Opcvm;
  personne$: any;
  personne: any;
  detailProfil: Detailprofil;
  detailProfil$: any;
  isLoading = false;
  submitting = false;
  paysSelect:any;
  idPays:number;
  idPersonne:number;
  submitted = false;
  entityForm: FormGroup;
  tableau:HTMLElement;
  nbreLigne: number;
  entity:any;
  private subscriptions: Subscription[] = [];

  constructor(
    private localStore: LocalService,
    public entityService: SeanceopcvmService,
    public authService: AuthService,
    public pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.idOpcvm=this.id
    this.idSeance=this.route.snapshot.params['id2']

    this.entityForm = this.fb.group(
      {
        id: [this.id],
        navBenchmark: [null,Validators.required],
      }
    );

    if(this.id)
    {
      this.pageInfo.updateTitle("Modification du navBenchMark'")
      const sb = this.entityService.afficherSelonId(this.idOpcvm,
        this.idSeance)
        .subscribe((entity)=>{
          // console.log("profil=",entity.data)
          this.entity=entity.data;
          this.loadFormValues(entity.data);
        });
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout du navbenchmark")
  }
  loadFormValues(entity: any)
  {
    this.entity = entity;
    let navBenchMark=""
    navBenchMark=entity.navBenchmark
    navBenchMark=navBenchMark.toString().replace('.',',')
    this.entityForm.patchValue({navBenchmark:
      navBenchMark});

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
          this.router.navigate(['/risque/navbenchmark/liste']);
        })
      )
      .subscribe(
        (data)=>{
        }
      );
    this.subscriptions.push(sb);
  }

  saveEntity() {
    // this.opcvm=new Opcvm();
    // this.opcvm.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm;

    const entity: any = {
        ...this.entityForm.value
    };
    // console.log("act1",entity)
    // console.log(this.idOpcvm,this.idSeance)
    let navBenchMark=this.entityForm.value.navBenchmark
    navBenchMark=navBenchMark.replace(',','.')
    return this.id
      ? this.entityService.modifier(this.idOpcvm,
        this.idSeance,navBenchMark,entity)
      : this.entityService.create(entity);
  }
}
