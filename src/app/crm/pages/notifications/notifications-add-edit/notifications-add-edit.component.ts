import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Observable, of, shareReplay, Subscription, switchMap, tap, timer} from "rxjs";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, filter, finalize, map} from "rxjs/operators";
import {NgbDate, NgbTimepickerConfig, NgbTimeStruct} from "@ng-bootstrap/ng-bootstrap";
import {AlerteService} from "../../../services/alerte.service";
import {ModeleMsgAlerteService} from "../../../services/modelemsgalerte.service";
import {PersonnelService} from "../../../services/personne/personnel.service";
import {TypePlanificationService} from "../../../services/type-planification.service";
import {PeriodiciteService} from "../../../services/periodicite.service";
import {ProtoAlerteService} from "../../../services/proto-alerte.service";
import {JourService} from "../../../services/jour.service";
import {Jour} from "../../../models/jour.model";
import {NbrJour} from "../../../models/nbr-jour.model";
import {NbrJoursService} from "../../../services/nbr-jours.service";
import {Temps} from "../../../models/temps.model";
import {TempsService} from "../../../services/temps.service";
import {TypePlanification} from "../../../models/type-planification.model";
import {Periodicite} from "../../../models/periodicite.model";
import {PageInfoService} from "../../../../template/_metronic/layout";
//import {NumeroPositifValidatorsDirective} from "../../../../validators/numero-positif-validators.directive";

@Component({
  selector: 'app-notifications-add-edit',
  templateUrl: './notifications-add-edit.component.html',
  styleUrls: ['./notifications-add-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NotificationsAddEditComponent implements OnInit, AfterViewInit, OnDestroy{
  id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  entity: any;
  entityForm: FormGroup;
  models: Array<any> = [];
  personnels: Array<any> = [];
  typePlanifications: Array<any> = [];
  periodicites: Array<any> = [];
  jours$: Observable<Jour[]>;
  nbrJours$: Observable<NbrJour[]>;
  temps$: Observable<Temps[]>;
  private subscriptions: Subscription[] = [];
  uneFois: boolean = false;
  periode: "J" | "S" | "M";

  periodeTitle: any;

  public personnelSettings = {};

  heure: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  heureDebut: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  heureFin: NgbTimeStruct = { hour: 23, minute: 59, second: 59 };

  heureDebutGlobale: null | NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  heureFinGlobale: null | NgbTimeStruct = { hour: 23, minute: 59, second: 59 };

  oneTimeFrequence: boolean = false;

  intervalId: any;

  defaultTypePlanification: null | TypePlanification;
  defaultPeriodicite: Periodicite;
  defaultUniteTemps: Temps;

  idCR?: number;
  dateFinReadOnly = false;

  private _time$: Observable<Date> = timer(0, 1000).pipe(
    map(tick => {
      let date = new Date();
      this.heure = {
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds()
      };
      return date;
    }),
    shareReplay(1)
  );

  constructor(
    private config: NgbTimepickerConfig,
    private entityService: AlerteService,
    private modelService: ModeleMsgAlerteService,
    private personnelService: PersonnelService,
    private pageInfo: PageInfoService,
    private typePlanificationService: TypePlanificationService,
    private periodiciteService: PeriodiciteService,
    private protoAlerteService: ProtoAlerteService,
    private jourService: JourService,
    private nbrJourService: NbrJoursService,
    private tempsService: TempsService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef) {
    config.seconds = true;
    config.spinners = false;
    config.size =  "small";
    config.meridian = false;
  }

  ngOnInit(): void {
    const date = new Date();
    const ngbDate: NgbDate = new NgbDate(
      date.getFullYear(),
      date.getMonth()+1,
      date.getDate());
    this.id = this.route.snapshot.params['id'];
    if(this.id)
      this.pageInfo.updateTitle("Modification d'alerte")
    else
      this.pageInfo.updateTitle("Ajout d'alerte")

    this.entityForm = this.fb.group(
      {
        id: [this.id],
        idAlerte: [this.id],
        dateDebut: [ngbDate, Validators.required],
        dateFin: [null],
        heureDebut: [null],
        heureFin: [null],
        frequence: [1, Validators.required],
        //frequence: [1, [Validators.required],[this.numeroPositifValidator.onInputChange]],
        periodicite: [null],
        typePlanification: [null, Validators.required],
        typeAlerte: ["Desktop", Validators.required],
        nbreJoursAlertes: this.fb.array([
          this.fb.group({
            nbreJours: [null]
          })
        ]),
        joursAlertes: this.fb.array([]),
        tempsAlertes: this.fb.array([
          this.fb.group({
            temps: [null],
            frequence: [1],
            heureDebut: [null],
            heureFin: [null]
          })
        ]),
        protoAlertes: this.fb.array([
          this.fb.group({
            modeleMsgAlerte: [null, Validators.required],
            contenu: [null, Validators.required],
            personnels: [null],
            // diffusionAlertes: this.fb.array([
            //   this.fb.group({
            //     alerte: [null],
            //     statut: [null],
            //     modeleMsgAlerte: [null],
            //     personnel: [null],
            //   })
            // ])
          })
        ]),
      }
    );
    this.getJoursAll();
    this.getNbrJoursAll();
    this.afficherTempsTous();
    console.log(this.route.paramMap);
    //Récupération de l'object correspondant à id
    const sb = this.route.paramMap
      .pipe(
        filter(paramMap => paramMap.has('id') || paramMap.has('idCR')),
        map(paramMap => [paramMap.has('id') ? +paramMap.get('id')! : 0, paramMap.has('idCR') ? +paramMap.get('idCR')! : 0]),
        tap(ids => {
          this.idCR = ids[1];
          if(this.entityService.currentCRValue)
          {
            let dateFinRappel = this.entityService.currentCRValue.elementRappel == "DPR" ?
              new Date(this.entityService.currentCRValue.dateProchainRDV) :
              (this.entityService.currentCRValue.elementRappel == "DEP" ?
                new Date(this.entityService.currentCRValue.dateEffectivePromesse) : null);
            if(dateFinRappel)
            {
              this.dateFinReadOnly = true;
              this.entityForm.patchValue({dateFin: new NgbDate(
                  dateFinRappel.getFullYear(),
                  dateFinRappel.getMonth()+1,
                  dateFinRappel.getDate())});
            }
          }
        }),
        filter(ids => ids[0] > 0),
        tap((ids) => this.id = ids[0]),
        switchMap(ids => this.entityService.getEntityById(ids[0]))
      ).subscribe(entity => this.loadFormValues(entity));
    this.subscriptions.push(sb);
    this.getModelMsgAlertesAll();
    this.getPersonnelsAll();
    this.getTypePlanificationAll();
    this.getPeriodiciteAll();
    // setting and support i18n
    this.personnelSettings = {
      singleSelection: false,
      idField: 'idPersonne',
      textField: 'denomination',
      enableCheckAll: true,
      selectAllText: 'Sélectionnez tous',
      unSelectAllText: 'Ne pas tout sélectionné',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Rechercher un élément',
      noDataAvailablePlaceholderText: 'Aucune donnée à afficher',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    //Ecouter le changement de type planification
    this.entityForm.get("typePlanification")?.valueChanges.subscribe(f=> {
      this.onTypePlanificationChange(f);
    });

    //Ecouter le changement de la périodicité
    this.entityForm.get("periodicite")?.valueChanges.subscribe(f=> {
      this.onPeriodiciteChange(f);
    });

    this.time.subscribe();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get time() {
    return this._time$;
  }

  get f() { return this.entityForm.controls; }

  private addDaysToForm(data: any) {
    // data.forEach(() => this.jourAlertes.push(new FormControl(false)));
    this.jourAlertes.clear();
    data.forEach((value: any) => this.jourAlertes.push(this.createItem({...value, jours:value, etat: false})));
    this.cd.detectChanges();
  }

  private addNumberOfDaysToForm(data: any) {
    data.forEach(() => this.nbrJourAlertes.push(new FormControl(null)));
  }

  afficherTempsTous()
  {
    this.temps$ = this.tempsService.afficherTempsTous().pipe(
      tap(temps => {
        temps.forEach(value => {
          if(value.libelle.toLowerCase() === "heure") {
            this.defaultUniteTemps = value;
            return;
          }
        });
      })
    );
  }

  getNbrJoursAll()
  {
    this.nbrJours$ = this.nbrJourService.getNbrJoursAll();
  }

  getJoursAll()
  {
    this.jours$ = this.jourService.getJoursAll().pipe(
      tap(data => this.addDaysToForm(data))
    );
  }

  getPeriodiciteAll()
  {
    const sb = this.periodiciteService.isLoading$.subscribe((res: boolean) => this.isLoading = res);
    this.subscriptions.push(sb);
    this.periodiciteService.fetch();
    const sb1 = this.periodiciteService.items$.subscribe(data => {
      this.periodicites = data;
      data.forEach((value, index, array) => {
        if(value.libelle.toLowerCase() === "quotidienne") {
          this.defaultPeriodicite = value;
          this.entityForm.patchValue({periodicite: value});
          return;
        }
      });
    });
    this.subscriptions.push(sb1);
  }

  getTypePlanificationAll()
  {
    const sb = this.typePlanificationService.isLoading$.subscribe((res: boolean) => this.isLoading = res);
    this.subscriptions.push(sb);
    this.typePlanificationService.fetch();
    const sb1 = this.typePlanificationService.items$.subscribe(data => {
      this.typePlanifications = data;
      data.forEach((value, index, array) => {
        if(value.libelleTypePlanification.toLowerCase() === "périodique") {
          this.defaultTypePlanification = value;
          this.entityForm.patchValue({typePlanification:value});
          return;
        }
      });
    });
    this.subscriptions.push(sb1);
  }

  getModelMsgAlertesAll() {
   /* const sb = this.modelService.isLoading$.subscribe((res: boolean) => this.isLoading = res);
    this.subscriptions.push(sb);
    this.modelService.fetch();
    const sb1 = this.modelService.items$.subscribe(data => {
      this.models = data;
    });
    this.subscriptions.push(sb1);*/
    this.modelService.afficherSelonTypeModele("Notifications").subscribe(
      (data)=>{
        this.models=data;
      }
    )
  }

  get protoAlertes2(): FormArray {
    return <FormArray>this.entityForm.get("protoAlertes");
  }

  afficherContenu(id:any){
   console.log(this.protoAlertes2.controls[id].value)
    this.protoAlertes2.controls[id].patchValue({contenu:this.protoAlertes2.controls[id].value.modeleMsgAlerte.contenu})
  }
  getPersonnelsAll()
  {
    const sb = this.personnelService.isLoading$.subscribe((res: boolean) => this.isLoading = res);
    this.subscriptions.push(sb);
    this.personnelService.fetch();
    const sb1 = this.personnelService.items$.subscribe(data => {
      this.personnels = data;
    });
    this.subscriptions.push(sb1);
  }

  createItem(data: any): FormGroup {
    return this.fb.group(data);
  }

  get jourAlertes() {
    return this.entityForm.controls.joursAlertes as FormArray;
  }

  get tempsAlertes(): FormArray {
    return <FormArray>this.entityForm.get('tempsAlertes')
  }

  get nbrJourAlertes(): FormArray {
    return <FormArray>this.entityForm.get('nbreJoursAlertes')
  }

  get protoAlertes(): FormArray {
    return <FormArray>this.entityForm.get('protoAlertes')
  }

  diffusionAlertes(index: number) {
    return <FormArray>this.protoAlertes.controls[index].get('diffusionAlertes');
  }

  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({id: entity.id});
    this.entityForm.patchValue({idAlerte: entity.idAlerte});
    this.entityForm.patchValue({frequence: entity.frequence});
    this.entityForm.patchValue({periodicite: entity.periodicite});
    this.entityForm.patchValue({typePlanification: entity.typePlanification});

    let dateDebut = new Date(entity.dateDebut);
    this.entityForm.patchValue({dateDebut: new NgbDate(
        dateDebut.getFullYear(),
        dateDebut.getMonth()+1,
        dateDebut.getDate())});

    let dateFin = new Date(entity.dateFin);
    this.entityForm.patchValue({dateFin: new NgbDate(
        dateFin.getFullYear(),
        dateFin.getMonth()+1,
        dateFin.getDate())});
  }

  onTypePlanificationChange(data: any)
  {
    if(data != null)
    {
      if(data.libelleTypePlanification.toLowerCase() === "une fois")
      {
        const date = new Date();
        this.entityForm.patchValue({dateDebut: new NgbDate(
            date.getFullYear(),
            date.getMonth()+1,
            date.getDate())});
        this.entityForm.patchValue({dateFin: new NgbDate(
            date.getFullYear(),
            date.getMonth()+1,
            date.getDate())});
        this.heureFinGlobale = this.heureDebutGlobale = this.heure;
        this.dateFinReadOnly = true
        this.uneFois = true;
      }
      else
      {
        this.heureDebutGlobale = this.heureFinGlobale = null;
        this.oneTimeFrequence = false;
        this.dateFinReadOnly = false
        this.uneFois = false;
      }
    }
  }

  onPeriodiciteChange(data: any) {
    if(data != null)
    {
      if(data.libelle.toLowerCase() === "mensuelle")
      {
        this.periodeTitle = "mois";
        this.periode = "M";
      }
      if(data.libelle.toLowerCase() === "quotidienne")
      {
        this.periodeTitle = "jour(s)";
        this.periode = "J";
      }
      if(data.libelle.toLowerCase() === "hebdomadaire")
      {
        this.periodeTitle = "semaine(s)";
        this.periode = "S";
      }
    }
  }

  onHeureDebutChange($event: any)
  {
    // console.log($event.hour);
  }

  onCheckBoxClick($event: any)
  {
    this.tempsAlertes.controls.forEach((control: any) => {
      if($event.target.checked)
      {
        this.heureFinGlobale = this.heureDebutGlobale = this.heure;
        this.oneTimeFrequence = true;
        control.controls.frequence.disable();
        control.controls.heureDebut.disable();
        control.controls.heureFin.disable();
        control.controls.temps.disable();
      }
      else
      {
        this.heureDebutGlobale = this.heureFinGlobale = null;
        this.oneTimeFrequence = false;
        control.controls.frequence.enable();
        control.controls.heureDebut.enable();
        control.controls.heureFin.enable();
        control.controls.temps.enable();
      }
    });
  }

  onAddProtoAlerte() {
    this.protoAlertes.push(this.createItem({
      alerte: null,
      modeleMsgAlerte: null,
      contenu: null,
      personnels: null,
      diffusionAlertes: null,
    }));
  }

  onSaveEntity()
  {
    this.isLoading = true;
    this.submitted = true;

    if(this.entityForm.invalid) return;
    // return;
    this.submitting = true;
    const sb = this.saveEntity()
      .pipe(
        catchError((err) => {
          return of(undefined);
        }),
        finalize(() => {
          this.isLoading = false;
          this.router.navigate(['alertes'], {relativeTo: this.route});
        })
      )
      .subscribe();
    this.subscriptions.push(sb);
  }

  saveEntity() {
    let entity = {
      ...this.entityForm.value,
      dateDebut: null,
      dateFin: null,
    }
    if(this.entityForm.controls.dateDebut.value)
    {
      let dateDebut = new Date(
        this.entityForm.controls.dateDebut.value.year,
        this.entityForm.controls.dateDebut.value.month-1,
        this.entityForm.controls.dateDebut.value.day+1);
      entity = {
        ...entity,
        dateDebut: dateDebut
      }
    }

    if (this.entityForm.controls.dateFin.value)
    {
      let dateFin = new Date(
        this.entityForm.controls.dateFin.value.year,
        this.entityForm.controls.dateFin.value.month-1,
        this.entityForm.controls.dateFin.value.day+1);
      entity = {
        ...entity,
        dateFin: dateFin,
      }
    }
    //
    // if(this.entityForm.controls.heureDebut.value)
    // {
    //   let hour = this.entityForm.controls.heureDebut.value.hour;
    //   let minute = this.entityForm.controls.heureDebut.value.minute;
    //   let second = this.entityForm.controls.heureDebut.value.second;
    //   entity.heureDebut = ('0' + hour).slice(-2) + ":"
    //     + ('0' + minute).slice(-2) + ":" + ('0' + second).slice(-2);
    // }
    // if(this.entityForm.controls.heureFin.value)
    // {
    //   let hour = this.entityForm.controls.heureFin.value.hour;
    //   let minute = this.entityForm.controls.heureFin.value.minute;
    //   let second = this.entityForm.controls.heureFin.value.second;
    //   entity.heureFin = ('0' + hour).slice(-2) + ":"
    //     + ('0' + minute).slice(-2) + ":" + ('0' + second).slice(-2);
    //   console.log(entity.heureFin);
    // }

    if(this.heureDebut)
    {
      let hour = this.heureDebut.hour;
      let minute = this.heureDebut.minute;
      let second = this.heureDebut.second;
      entity.heureDebut = ('0' + hour).slice(-2) + ":"
        + ('0' + minute).slice(-2) + ":" + ('0' + second).slice(-2);
    }
    if(this.heureFin)
    {
      let hour = this.heureFin.hour;
      let minute = this.heureFin.minute;
      let second = this.heureFin.second;
      entity.heureFin = ('0' + hour).slice(-2) + ":"
        + ('0' + minute).slice(-2) + ":" + ('0' + second).slice(-2);
    }
    if(this.heureDebutGlobale)
    {
      let hour = this.heureDebutGlobale.hour;
      let minute = this.heureDebutGlobale.minute;
      let second = this.heureDebutGlobale.second;
      entity.heureDebut = ('0' + hour).slice(-2) + ":"
        + ('0' + minute).slice(-2) + ":" + ('0' + second).slice(-2);
    }
    if(this.tempsAlertes != null && this.tempsAlertes.length > 0 && entity.hasOwnProperty("tempsAlertes"))
    {
      for (let i = 0; i < this.tempsAlertes.length; i++) {
        let tempsAlerteForm = <FormGroup>this.tempsAlertes.controls[i];
        if(tempsAlerteForm.controls.heureDebut.value)
        {
          let hour = tempsAlerteForm.controls.heureDebut.value.hour;
          let minute = tempsAlerteForm.controls.heureDebut.value.minute;
          let second = tempsAlerteForm.controls.heureDebut.value.second;
          entity.tempsAlertes[i].heureDebut = ('0' + hour).slice(-2) + ":"
            + ('0' + minute).slice(-2) + ":" + ('0' + second).slice(-2);
        }

        if(tempsAlerteForm.controls.heureFin.value)
        {
          let hour = tempsAlerteForm.controls.heureFin.value.hour;
          let minute = tempsAlerteForm.controls.heureFin.value.minute;
          let second = tempsAlerteForm.controls.heureFin.value.second;
          entity.tempsAlertes[i].heureFin = ('0' + hour).slice(-2) + ":"
            + ('0' + minute).slice(-2) + ":" + ('0' + second).slice(-2);
        }
      }
    }
    if(this.uneFois)
    {
      entity.dateFin = entity.dateDebut;
      // entity.heureDebut=this.heureDebutGlobale;
      entity.heureFin = entity.heureDebut;
      entity.periodicite = null;
    }
    if(this.oneTimeFrequence)
    {
      entity.heureFin = entity.heureDebut;
    }
    return this.id
      ? this.entityService.updateRow(entity)
      : this.entityService.createRow(entity);
  }

  public onFilterChange(item: any) {
    // console.log('onFilterChange', item);
  }
  public onDropDownClose(item: any) {
    // console.log('onDropDownClose', item);
  }

  public onItemSelect(item: any) {
    // console.log('onItemSelect', item);
  }
  public onDeSelect(item: any) {
    // console.log('onDeSelect', item);
  }

  public onSelectAll(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAll(items: any) {
    // console.log('onDeSelectAll', items);
  }

  ngAfterViewInit(): void {
  }
}
