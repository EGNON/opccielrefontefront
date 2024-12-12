import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {Personne} from "../../../models/personne/personne.model";
import {PersonnePhysiqueService} from "../../../services/personne/personne.physique.service";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataTablesResponse} from "../../../models/data-tables.response.model";
import {Config} from "datatables.net";

@Component({
  selector: 'app-fichekyc-print',
  templateUrl: './fichekyc-print.component.html',
  styleUrls: ['./fichekyc-print.component.scss']
})
export class FichekycPrintComponent implements OnInit, OnDestroy{
  baseRoute: string = "";
  qualite?: string | null;
  entity: any;
  newButtonTitle: string = "Nouveau";
  personnes$: any;
  personnesSelonId$: any;
  title: string;
  isLoading: boolean = false;
  private subscriptions: Subscription[] = [];
  personnes: DataTablesResponse<any>;

  datatableConfig: Config = {};
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  aPersonne: Observable<Personne>;
  idPersonne:number;
  selectPersonne:any;
  formData: FormGroup;
  pDateNaissanceConjoint:string;
  pDateNaissancePere:string;
  pDateNaissanceMere:string;
  constructor(
    public personnePhysiqueService: PersonnePhysiqueService,
    private route: ActivatedRoute,
    private fb: FormBuilder) {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    // this.prospect="Personne physique";
    this.formData = this.fb.group(
      {
        autresRevenus: [null],
        periodicite: [null],
        statutMatrimonial: [null],
        nbreEnfants: [null],
        nbrePersonneCharge: [null],
        nomEmployeur: [null],
        adressePostaleEmployeur: [null],
        adresseGeographiqueEmployeur: [null],
        secteurActivite: [null],
        telephone: [null],
        email: [null],
        nomPere: [null],
        prenomPere: [null],
        dateNaissancePere: [null],
        nationalitePere: [null],
        nomMere: [null],
        prenomMere: [null],
        dateNaissanceMere: [null],
        nationaliteMere: [null],
        nomConjoint: [null],
        prenomConjoint: [null],
        dateNaissanceConjoint: [null],
        nationaliteConjoint: [null],
        origineFonds: [null],
        transactionEnvisage: [null],
        immobiliere: [null],
        autresBiens: [null],
        surfaceTotale: [null],
        salaire: [null]
      });
    this.afficherClient();
    this.selectPersonne = document.getElementById("ComboClientFicheKyc");
  }
  afficherClientSelonIdQualite(){
    this.idPersonne=this.selectPersonne.options[this.selectPersonne.selectedIndex].value;
    this.qualite="actionnaires".toUpperCase();
    this.personnePhysiqueService.afficherSelonIdQualite(this.idPersonne,this.qualite).subscribe(
      (data)=>{this.personnesSelonId$=data;
        this.pDateNaissanceConjoint=this.personnesSelonId$.dateNaissanceConjoint;
        if(this.pDateNaissanceConjoint!=null)
        {
          this.pDateNaissanceConjoint=this.pDateNaissanceConjoint.substring(0,10);
        }
        this.pDateNaissancePere=this.personnesSelonId$.dateNaissancePere;
        if(this.pDateNaissancePere!=null)
        {
          this.pDateNaissancePere=this.pDateNaissancePere.substring(0,10);
        }
        this.pDateNaissanceMere=this.personnesSelonId$.dateNaissanceMere;
        if(this.pDateNaissanceMere!=null)
        {
          this.pDateNaissanceMere=this.pDateNaissanceMere.substring(0,10);
        }
        this.formData.patchValue(
          {autresRevenus:this.personnesSelonId$.autresRevenus,
                periodicite:this.personnesSelonId$.periodicite,
                statutMatrimonial:this.personnesSelonId$.statutMatrimonial,
                nbreEnfants:this.personnesSelonId$.nbrEnfant,
                nbrePersonneCharge:this.personnesSelonId$.nbrPersonneACharge,
                nomEmployeur:this.personnesSelonId$.nomEmployeur,
                adressePostaleEmployeur:this.personnesSelonId$.adressePostaleEmp,
                adresseGeographiqueEmployeur: this.personnesSelonId$.adresseGeoEmp,
                secteurActivite: this.personnesSelonId$.secteur?.libelleSecteur,
                telephone: this.personnesSelonId$.telEmp,
                email: this.personnesSelonId$.emailEmp,
                nomPere:this.personnesSelonId$.nomPere,
                prenomPere: this.personnesSelonId$.prenomsPere,
                dateNaissancePere: this.pDateNaissancePere,
                nationalitePere: this.personnesSelonId$.paysPere?.libelleFr,
                nomMere: this.personnesSelonId$.nomMere,
                prenomMere: this.personnesSelonId$.prenomsMere,
                dateNaissanceMere: this.pDateNaissanceMere,
                nationaliteMere: this.personnesSelonId$.paysMere?.libelleFr,
                nomConjoint: this.personnesSelonId$.nomConjoint,
                prenomConjoint: this.personnesSelonId$.prenomConjoint,
                dateNaissanceConjoint: this.pDateNaissanceConjoint,
                nationaliteConjoint: this.personnesSelonId$.paysConjoint?.libelleFr,
                origineFonds: this.personnesSelonId$.origineFonds,
                transactionEnvisage: this.personnesSelonId$.transactionEnvisagee,
                immobiliere: this.personnesSelonId$.immobilier,
                autresBiens: this.personnesSelonId$.autresBiens,
                surfaceTotale: this.personnesSelonId$.surfaceTotale,
                salaire: this.personnesSelonId$.salaire
          }
        )
      }
    )
  }
  afficherClient(){
    this.qualite="actionnaires".toUpperCase();
    // this.personnes$ = this.route.paramMap
    //   .pipe(
    //     switchMap((qualite) => this.personnePhysiqueService.afficherPersonneSelonQualite(this.qualite))
    //   );
    this.personnePhysiqueService.afficherPersonneSelonQualite(this.qualite).subscribe(
      (data)=>{
        this.personnes$=data;
        //console.log(this.personnes$)
      }
    )
  }
  ngOnDestroy(): void {

    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}


