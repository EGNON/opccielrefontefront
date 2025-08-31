import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Observable, of, Subscription, switchMap, tap} from "rxjs";
import {NgbDate, NgbDateParserFormatter, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {QualiteTitreService} from "../../../services/qualite-titre.service";
import {QualiteTitreModel} from "../../../models/qualite-titre.model";
import {TitreService} from "../../../services/titre.service";
import {PaysService} from "../../../../crm/services/pays.service";
import {CompartimentService} from "../../../../core/services/compartiment.service";
import {TypetitreService} from "../../../../core/services/typetitre.service";
import {TypeemissionService} from "../../../../core/services/typeemission.service";
import {SecteurService} from "../../../../crm/services/secteur.service";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {PlaceService} from "../../../../core/services/place.service";
import {catchError, finalize} from "rxjs/operators";
import {TypeobligationService} from "../../../../core/services/typeobligation.service";
import {TypeactionService} from "../../../../core/services/typeaction.service";
import {SoustypeactionService} from "../../../../core/services/soustypeaction.service";
import {TypeAmortissementService} from "../../../services/type-amortissement.service";
import {ModeAmortissementService} from "../../../services/mode-amortissement.service";
import {ActionService} from "../../../services/action.service";
import {FormeJuridiqueOpcService} from "../../../../core/services/forme-juridique-opc.service";
import {TypeAffectationVlService} from "../../../../core/services/type-affectation-vl.service";
import {ClassificationOpcService} from "../../../../core/services/classification-opc.service";
import {NatureTcnService} from "../../../services/nature-tcn.service";
import {ModeCalculInteretService} from "../../../services/mode-calcul-interet.service";

@Component({
    selector: 'app-titres-details',
    templateUrl: './titres-details.component.html',
    styleUrl: './titres-details.component.scss',
    standalone: false
})
export class TitresDetailsComponent implements OnInit, AfterViewInit, OnDestroy{
  /********************************** showForm  **********************************
   * showForm = 0 pour la liste
   * showForm = 1 pour l'ajout et la modification
   * showForm = 2 pour l'affichage des détails
   * showForm = 3 pour la suppression
   * **/

  _qualite: QualiteTitreModel;
  qualite: string;
  title: string;
  form: FormGroup;
  formData: FormData = new FormData();
  entityColumns: any[] = [];
  entity: any;
  private subscriptions: Subscription[] = [];

  @Input() id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  @Output() showForm: EventEmitter<number> = new EventEmitter<number>();

  [key: string]: any;

  constructor(
    public entityService: TitreService,
    private paysService: PaysService,
    private compartimentService: CompartimentService,
    private typeTitreService: TypetitreService,
    private typeEmissionService: TypeemissionService,
    private secteurService: SecteurService,
    private personneService: PersonneService,
    private placeService: PlaceService,
    private actionService: ActionService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private element: ElementRef,
    private qualiteService: QualiteTitreService,
    private typeObligationService: TypeobligationService,
    private typeActionService: TypeactionService,
    private sousTypeActionService: SoustypeactionService,
    private modeAmortissementService: ModeAmortissementService,
    private typeAmortissementService: TypeAmortissementService,
    private formeJuridiqueOpcService: FormeJuridiqueOpcService,
    private typeAffectationTitreService: TypeAffectationVlService,
    private classificationOpcService: ClassificationOpcService,
    private natureTcnService: NatureTcnService,
    private modeCalculInteretService: ModeCalculInteretService,
    private parserFormatter: NgbDateParserFormatter,
    private fb: FormBuilder,
    private pageInfo: PageInfoService) {
  }

  ngAfterViewInit(): void {
    this.entityService.afficherToutesLesColonnesParTable(this.qualite).subscribe((data) => {
      const columns: any[] = data;
      this.ajouterFormControl("id", this.id, []);
      this.entityColumns.push("id");
      for (const key in columns) {
        const column = columns[key];
        this.entityColumns.push(column);
        this.ajouterFormControl(column, null, []);
      }
    });
    this.cdr.detectChanges();
    this.getPaysAll();
    this.getCompartimentAll();
    this.getTypesTitreAll();
    this.getTypeEmissionAll();
    this.getSecteurAll();
    this.getPersonnesAll('emetteur');
    this.getPersonnesAll('registraire');
    this.getPersonnesAll('depositaire');
    this.getPersonnesAll('banques');
    this.getPlaceAll();
    this.getTypeObligationAll();
    this.getTypeActionAll();
    this.getSousTypeActionAll();
    this.getTypeAmortissementAll();
    this.getModeAmortissementAll();
    this.getActionAll();
    this.getFormeJuridiqueOpcAll();
    this.getTypeAffectationVlAll();
    this.getClassificationOpcAll();
    this.getNatureTcnAll();
    this.getModeCalculInteretAll();
    if(this.id)
    {
      this.title = "Modification de " + this._qualite.libelleQualite.toLowerCase();
      this.pageInfo.updateTitle(this.title);
      this.entityService.afficherSelonId(this.id, this.qualite).subscribe((entity) => {
        console.log("Titre === ", entity);
        this.entity = entity.data;
        for (const key in entity.data)
        {
          let value = entity.data[key];
          if(key.includes("date")) {
            const date = new Date(value);
            value = new NgbDate(date.getFullYear(), date.getMonth()+1, date.getDate())
          }
          this.form.patchValue({[key]: value});
        }
      });
    }
    else
    {
      this.title = "Ajout de " + this._qualite.libelleQualite.toLowerCase();
      this.pageInfo.updateTitle(this.title);
    }

    console.log("Formulaire initial === ", this.form);
  }

  ngOnDestroy(): void {
    this.showForm.unsubscribe();
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.form = this.fb.group({});
    const $tab = $('a[id*="simple-tab"].active');
    if(typeof $tab !== undefined)
    {
      this._qualite = {
        id: +$tab.attr("data-id")!,
        idQualite: +$tab.attr("data-id")!,
        libelleQualite: $tab[0].textContent.trim(),
        classeTitre: {
          codeClasseTitre: $tab.attr("data-class")!
        }
      };
      this.qualite = $tab[0].textContent.trim().toLowerCase();
    }
  }

  get f() { return this.form.controls; }

  getModeCalculInteretAll = () => {
    this.modeCalculInteretService.afficherTous().subscribe(
      (resp) => {
        this["modeCalculInterets"] = resp.data;
      }
    );
  }

  getNatureTcnAll = () => {
    this.natureTcnService.afficherTous().subscribe(
      (resp) => {
        this["natureTcns"] = resp.data;
      }
    );
  }

  getClassificationOpcAll = () => {
    this.classificationOpcService.afficherTous().subscribe(
      (resp) => {
        this["classificationOpcs"] = resp.data;
      }
    );
  }

  getTypeAffectationVlAll = () => {
    this.typeAffectationTitreService.afficherTous().subscribe(
      (resp) => {
        this["typeAffectationTitres"] = resp.data;
      }
    );
  }

  getFormeJuridiqueOpcAll = () => {
    this.formeJuridiqueOpcService.afficherTous().subscribe(
      (resp) => {
        this["formeJuridiquesOpc"] = resp.data;
      }
    );
  }

  getPaysAll = () => {
    this.paysService.afficherPaysListe().subscribe(
      (data) => {
        this["payss"] = data;
      }
    );
  }

  getCompartimentAll = () => {
    this.compartimentService.afficherTous().subscribe(
      (resp) => {
        this["compartiments"] = resp.data;
      }
    );
  }

  getTypesTitreAll = () => {
    this.typeTitreService.afficherTous().subscribe(
      (resp) => {
        const typeTitres: any[] = resp.data;
        this["typeTitres"] = typeTitres.filter((type) =>
          type.classeTitre?.codeClasseTitre.trim() === this._qualite.classeTitre?.codeClasseTitre.trim());
      }
    );
  }

  getModeAmortissementAll = () => {
    this.modeAmortissementService.afficherTous().subscribe(
      (resp) => {
        this["modeAmortissements"] = resp.data;
      }
    );
  }

  getTypeAmortissementAll = () => {
    this.typeAmortissementService.afficherTous().subscribe(
      (resp) => {
        this["typeAmortissements"] = resp.data;
      }
    );
  }

  getTypeEmissionAll = () => {
    this.typeEmissionService.afficherTous().subscribe(
      (resp) => {
        this["typeEmissions"] = resp.data;
      }
    );
  }

  getPlaceAll = () => {
    this.placeService.afficherTous().subscribe(
      (resp) => {
        this["places"] = resp.data;
      });
  }

  getTypeObligationAll = () => {
    this.typeObligationService.afficherTous().subscribe(
      (resp) => {
        console.log("Type obligations === ", resp);
        this["typeObligations"] = resp.data;
      });
  }

  getActionAll = () => {
    this.actionService.afficherTous().subscribe(
      (resp) => {
        console.log("Actions === ", resp);
        this["actions"] = resp.data;
      });
  }

  getTypeActionAll = () => {
    this.typeActionService.afficherTous().subscribe(
      (resp) => {
        console.log("Type actions === ", resp);
        this["typeActions"] = resp.data;
      });
  }

  getSousTypeActionAll = () => {
    this.sousTypeActionService.afficherTous().subscribe(
      (resp) => {
        console.log("Sous Type actions === ", resp);
        this["sousTypeActions"] = resp.data;
      });
  }

  getSecteurAll = () => {
    this.secteurService.afficherListe().subscribe(
      (resp) => {
        this["secteurs"] = resp;
      }
    );
  }

  getPersonnesAll(qualite: any = null)
  {
    const name = qualite[qualite.length-1] === "s" ? `${qualite}$` : `${qualite}s$`;
    this[name] = this.personneService.afficherPersonneSelonQualite(qualite.toUpperCase().trim());
  }

  renderForm(): boolean {
    return Object.keys(this.form.controls).length === this.entityColumns.length && this.entityColumns.length > 0;
  }

  ajouterFormControl(fieldName: string, fieldValue: any, validators: any[] = []) {
    this.form.addControl(fieldName, this.fb.control(fieldValue, validators));
  }

  retourAlaListe() {
    this.showForm.emit(0);
  }

  onSaveEntity = () => {
    this.isLoading = true;
    this.submitted = true;
    this.submitting = true;
    if(this.form.invalid) return;
    let result: Observable<any>;
    let titre = this.form.value;
    for (const key in titre)
    {
      let value = titre[key];
      if(key.includes("date") && value != null) {
        const date = new Date(value.year, value.month-1, value.day+1);
        titre = {...titre, [key]: date};
      }
    }
    console.log("Submit form === ", titre);
    if(this.id) {
      result = this.entityService.updateFn(titre, this.qualite);
    }
    else {
      result = this.entityService.creerFn(titre, this.qualite);
    }
    result
      .pipe(
        catchError((err) => {
          this.submitting = false;
          return of(err.message);
        }),
        finalize(() => {
          this.isLoading = false;
          this.submitting = false;
          this.submitted = false;

          //Redirigez vers la liste
          this.showForm.emit(0);
          //Mettre à jour le titre
          this.title = "Liste des " + this.qualite + (this.qualite[this.qualite.length-1] === 's' ? '' : 's');
          this.pageInfo.updateTitle(this.title);
        })
      )
      .subscribe(value => {
        console.log("Submit form === ", value);
      });
  }
}
