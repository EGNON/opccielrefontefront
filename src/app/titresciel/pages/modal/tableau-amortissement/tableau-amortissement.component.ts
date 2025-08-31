import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {NgbActiveModal, NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {QualiteTitreService} from "../../../services/qualite-titre.service";
import {TitreService} from "../../../services/titre.service";

@Component({
    selector: 'app-tableau-amortissement',
    templateUrl: './tableau-amortissement.component.html',
    styleUrl: './tableau-amortissement.component.scss',
    standalone: false
})
export class TableauAmortissementComponent implements OnInit, AfterViewInit, OnDestroy {
  id?: number;
  periodeenmois: number = 0;
  periodeRestant: boolean = false;
  nbrePeriodeRestant: number = 0;
  nbreligneDiffere: number = 0;

  qualite: string = "";
  qualites$: any;
  titre$: any;
  form: FormGroup;
  submitting = false;
  submitted = false;
  editable: boolean = true;
  exportable: boolean = false;
  canDelete: boolean = true;
  canCancel: boolean = false;

  constructor(private fb: FormBuilder,
              public entityService: TitreService,
              private qualiteService: QualiteTitreService,
              private cdr: ChangeDetectorRef,
              public modal: NgbActiveModal) {
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(+this.id!),
      tabAmortissements: this.fb.array([this.createTabAmortissementForm()]),
    });
    this.echeances.clear();
    if(this.id) {
      this.afficherListeEcheances();
    }
  }

  get f() {
    return this.form.controls;
  }

  get echeances(): FormArray {
    return <FormArray>this.form.get('tabAmortissements')
  }

  createTabAmortissementForm() {
    return this.fb.group({
      // id: new FormControl(null),
      idTabAmortissement: this.fb.group({
        idTitre: new FormControl(+this.id!),
        dateEcheance: new FormControl(null),
      }),
      titre: new FormControl(null),
      numeroEcheance: new FormControl(0),
      tauxAmortissement: new FormControl(0),
      nombreTitre: new FormControl(0),
      capital: new FormControl(0),
      interet: new FormControl(0),
      nombreTitreAmorti: new FormControl(0),
      montantRembourse: new FormControl(0),
      annuiteTotale: new FormControl(0),
      montantFinPeriode: new FormControl(0),
      estGenere: new FormControl(false),
    });
  }

  determinerNbreEcheances(muniteDuree: string, mduree: number = 0, munitePeriode: string, mperiode: number = 1) {
    let nbreEcheances = 1;
    try {
      switch (munitePeriode) {
        case 'JOURS':
          if (muniteDuree == "MOIS") {
            nbreEcheances = (mduree * 12) / mperiode;
          } else {
            if (muniteDuree == "ANNEES") {
              nbreEcheances = (mduree * 365) / mperiode;
            } else {
              nbreEcheances = mduree / mperiode;
            }
          }
          this.periodeenmois = mperiode / 30;
          break;
        case 'MOIS':
          if (muniteDuree == "MOIS") {
            if (mduree % mperiode == 0)
              nbreEcheances = mduree / mperiode;
            else {
              nbreEcheances = (mduree / mperiode) + 1;
              this.periodeRestant = true;
              this.nbrePeriodeRestant = mduree % mperiode;
            }
          } else {
            if (muniteDuree == "ANNEES") {
              nbreEcheances = (mduree * 12) / mperiode;
            } else {
              nbreEcheances = (mduree * (1 / 12)) / mperiode;
            }
          }
          this.periodeenmois = mperiode;
          break;
        case 'ANNEES':
          if (muniteDuree == "MOIS") {
            nbreEcheances = mduree / (12 * mperiode);
            this.nbrePeriodeRestant = (mduree % (12 * mperiode)) / 12;
            this.periodeRestant = true;
          } else {
            if (muniteDuree == "ANNEES") {
              nbreEcheances = mduree / mperiode;
            } else {
              nbreEcheances = mduree / (mperiode * 365);
              this.nbrePeriodeRestant = mduree % (365 * mperiode);
              this.periodeRestant = true;
            }
          }
          this.periodeenmois = mperiode * 12;
          break;
      }
    } catch (e) {
      return 0;
    }

    return nbreEcheances;
  }

  determinationTauxPeriode(mtauxNet: number, mperiode: number = 1, munitePeriode: string) {
    let tauxPeriode = 0;
    switch (munitePeriode) {
      case 'JOURS':
        tauxPeriode = (mtauxNet * mperiode) / 365;
        break;
      case 'MOIS':
        tauxPeriode = (mtauxNet * mperiode) / 12;
        break;
      case 'ANNEES':
        tauxPeriode = (mtauxNet * mperiode);
    }
    return tauxPeriode;
  }

  ajouterFormControl(fieldName: string, fieldValue: any, validators: any[] = []) {
    this.form.addControl(fieldName, this.fb.control(fieldValue, validators));
  }

  afficherListeEcheances(estGenere: boolean = false) {
    this.entityService.afficher(this.id, this.qualite).subscribe((resp: any) => {
      const titre = resp.data;
      console.log("Titre === ", titre);
      const dateJouissance = titre.dateJouissance;
      const datePremPaiement = new Date(titre.datePremierPaiement);
      const periode = titre.periodiciteNbre;
      const unitePeriode = titre.periodiciteUnite;
      const duree = titre.dureeNbre;
      const uniteDuree = titre.dureeUnite;
      const differe = titre.differeNbre;
      const uniteDiffere = titre.differeUnite;
      const nbreTitre = titre.nombreTitre;
      const nominal = titre.nominal;
      const tauxNet = titre.tauxNet * 100;
      const datefin = new Date(titre.dateDernierPaiement);
      const estTcn = true;
      const usance = titre.usance;
      const modeAmortissement = titre.modeAmortissement;
      const typeAmortissement = titre.typeAmortissement;
      const tabs = titre.tabAmortissements;
      if(tabs != null && tabs.length > 0) {
        tabs.sort((x, y) => +x.numeroEcheance! > +y.numeroEcheance! ? 1 : +x.numeroEcheance! < +y.numeroEcheance! ? -1 : 0).forEach((tab: any) => {
          const echeanceForm = this.createTabAmortissementForm();
          const dateEcheance = new Date(tab.idTabAmortissement.dateEcheance);
          echeanceForm.patchValue({
            ...tab,
            idTabAmortissement: {
              idTitre: this.id,
              dateEcheance: new NgbDate(dateEcheance.getFullYear(), dateEcheance.getMonth() + 1, dateEcheance.getDate())
            }
          });
          this.echeances.push(echeanceForm);
        });
      }

      if(estGenere) {
        const nbreLignes = this.determinerNbreEcheances(uniteDuree, duree, unitePeriode, periode);
        if (differe != 0) {
          this.nbreligneDiffere = this.determinerNbreEcheances(uniteDiffere, differe, unitePeriode, periode);
        }
        const tauxPeriode = this.determinationTauxPeriode(tauxNet, periode, unitePeriode);
        this.echeances.clear();
        let j = 1;
        for (let i = 0; i < nbreLignes; i++) {
          let nouvelleDateEcheance = datePremPaiement;
          //Détermination de la date d'échéance
          let dateEcheance = new NgbDate(datePremPaiement.getFullYear(), datePremPaiement.getMonth() + 1, datePremPaiement.getDate());
          if (i !== 0) {
            /*if (i == nbreLignes - 1) {
              dateEcheance = new NgbDate(datefin.getFullYear(), datefin.getMonth() + 1, datefin.getDate());
            } else {
              nouvelleDateEcheance.setMonth(nouvelleDateEcheance.getMonth() + this.periodeenmois);
              dateEcheance = new NgbDate(nouvelleDateEcheance.getFullYear(), nouvelleDateEcheance.getMonth() + 1, nouvelleDateEcheance.getDate());
            }*/
            nouvelleDateEcheance.setMonth(nouvelleDateEcheance.getMonth() + this.periodeenmois);
            dateEcheance = new NgbDate(nouvelleDateEcheance.getFullYear(), nouvelleDateEcheance.getMonth() + 1, nouvelleDateEcheance.getDate());
          }
          for (const key in titre) {
            let value = titre[key];
            if(key.includes("date")) {
              value = new Date(value);
              // value = new NgbDate(date.getFullYear(), date.getMonth()+1, date.getDate());
            }
            this.ajouterFormControl(key, value, []);
          }
          //Ajouter le formulaire echeance
          const echeance = this.createTabAmortissementForm();
          echeance.patchValue({
            idTabAmortissement: {
              idTitre: this.id,
              dateEcheance: dateEcheance,
            },
            titre: {
              idTitre: this.id
            },
            numeroEcheance: j,
            tauxAmortissement: 0,
            nombreTitre: nbreTitre,
            capital: nbreTitre * nominal,
            interet: (nbreTitre * nominal * tauxPeriode) / 100,
            nombreTitreAmorti: nbreTitre / nbreLignes,
            montantRembourse: (nbreTitre / nbreLignes) * nominal,
            annuiteTotale: 0,
            montantFinPeriode: 0,
            estGenere: false,
          });
          this.echeances.push(echeance);
          let lignePrecedente = i === 0 ? this.echeances.controls[i].value : this.echeances.controls[i-1].value;
          let ligne = this.echeances.controls[i].value;
          if (typeAmortissement.codeTypeAmortissement.trim() != "IF") {
            if (modeAmortissement.libelleModeAmortissement.trim() == "SUR QUANTITE") {
              if (typeAmortissement.codeTypeAmortissement.trim() != "ANC") {
                if (i !== 0) {
                  ligne.nombreTitre = lignePrecedente.nombreTitre - lignePrecedente.nombreTitreAmorti;
                  ligne.capital = ligne.nombreTitre * nominal;
                  ligne.interet = (ligne.capital * tauxPeriode) / 100;
                  if (j <= this.nbreligneDiffere) {
                    ligne.nombreTitreAmorti = 0;
                    ligne.montantRembourse = 0;
                  }
                  else {
                    if (i === nbreLignes - 1) {
                      ligne.nombreTitreAmorti = lignePrecedente.montantFinPeriode / nominal;
                      ligne.montantRembourse = lignePrecedente.montantFinPeriode;
                    }
                    else {
                      ligne.nombreTitreAmorti = nbreTitre / (nbreLignes - this.nbreligneDiffere);
                      ligne.montantRembourse = ligne.nombreTitreAmorti * nominal;
                    }
                  }
                }
                else {
                  if (this.nbreligneDiffere != 0) {
                    ligne.nombreTitreAmorti = 0;
                    ligne.montantRembourse = 0;
                  }
                }
                ligne.annuiteTotale = ligne.montantRembourse + ligne.interet;
                ligne.montantFinPeriode = i === 0 ? ligne.capital - ligne.montantRembourse : lignePrecedente.montantFinPeriode - ligne.montantRembourse;
              }
              else {
                ligne.annuiteTotale = (nbreTitre * nominal * (tauxPeriode/100))/(1-Math.pow((1+tauxPeriode/100), -nbreLignes));
                if (i !== 0) {
                  ligne.nombreTitre = lignePrecedente.nombreTitre - lignePrecedente.nombreTitreAmorti;
                  ligne.capital = lignePrecedente.capital - lignePrecedente.montantRembourse;
                  ligne.interet = (ligne.capital * tauxPeriode) / 100;
                  if (j <= this.nbreligneDiffere) {
                    ligne.nombreTitreAmorti = 0;
                    ligne.montantRembourse = 0;
                  }
                  else {
                    if (i === nbreLignes - 1) {
                      ligne.nombreTitreAmorti = lignePrecedente.montantFinPeriode / nominal;
                      ligne.montantRembourse = lignePrecedente.montantFinPeriode;
                    }
                    else {
                      ligne.montantRembourse = ligne.annuiteTotale - ligne.interet;
                      ligne.nombreTitreAmorti = ligne.montantRembourse / nominal;
                    }
                  }
                  ligne.montantFinPeriode = lignePrecedente.montantFinPeriode - ligne.montantRembourse;
                }
                else {
                  if (this.nbreligneDiffere != 0) {
                    ligne.nombreTitreAmorti = 0;
                    ligne.montantRembourse = 0;
                  }
                  else {
                    ligne.montantRembourse = ligne.annuiteTotale - ligne.interet;
                    ligne.nombreTitreAmorti = ligne.montantRembourse / nominal;
                  }
                  ligne.montantFinPeriode = ligne.capital - ligne.montantRembourse;
                }
              }
            }
            else {
              if (typeAmortissement.codeTypeAmortissement.trim() != "ANC") {
                if (i !== 0) {
                  ligne.nombreTitre = lignePrecedente.nombreTitre - lignePrecedente.nombreTitreAmorti;
                  ligne.capital = lignePrecedente.capital - lignePrecedente.montantRembourse;
                  ligne.interet = (ligne.capital * tauxPeriode) / 100;
                  ligne.nombreTitreAmorti = 0;
                  console.log("Nombre de lignes === ", nbreLignes);
                  console.log("J === ", j);
                  console.log("Nombre différé === ", this.nbreligneDiffere);
                  if (j <= this.nbreligneDiffere) {
                    ligne.montantRembourse = 0;
                  }
                  else {
                    if (i === nbreLignes - 1) {
                      ligne.montantRembourse = lignePrecedente.montantFinPeriode;
                    }
                    else {
                      ligne.montantRembourse = (nominal*nbreTitre)/(nbreLignes-this.nbreligneDiffere);
                    }
                  }
                  console.log("Montant remboursé === ", ligne.montantRembourse);
                  console.log("Intérêt === ", ligne.interet);
                  console.log("Annuité === ", ligne.montantRembourse + ligne.interet);
                  ligne.annuiteTotale = ligne.montantRembourse + ligne.interet;
                  ligne.montantFinPeriode = lignePrecedente.montantFinPeriode - ligne.montantRembourse;
                }
                else {
                  if (this.nbreligneDiffere != 0) {
                    ligne.montantRembourse = 0;
                  }
                  else {
                    ligne.montantRembourse = (nbreTitre/nbreLignes)*nominal;
                  }
                  ligne.nombreTitreAmorti = 0;
                  ligne.annuiteTotale = ligne.montantRembourse + ligne.interet;
                  ligne.montantFinPeriode = ligne.capital - ligne.montantRembourse;
                }
              }
              else {
                ligne.annuiteTotale = (nbreTitre * nominal * (tauxPeriode/100))/(1-Math.pow((1+tauxPeriode/100), -nbreLignes));
                if(i !== 0) {
                  ligne.nombreTitre = lignePrecedente.nombreTitre - lignePrecedente.nombreTitreAmorti;
                  ligne.capital = lignePrecedente.capital - lignePrecedente.montantRembourse;
                  ligne.interet = (ligne.capital * tauxPeriode) / 100;
                  ligne.nombreTitreAmorti = 0;
                  if (j <= this.nbreligneDiffere) {
                    ligne.montantRembourse = 0;
                  }
                  else {
                    if (i === nbreLignes - 1) {
                      ligne.montantRembourse = lignePrecedente.montantFinPeriode;
                    }
                    else {
                      ligne.montantRembourse = ligne.annuiteTotale - ligne.interet;
                    }
                  }
                  ligne.montantFinPeriode = lignePrecedente.montantFinPeriode - ligne.montantRembourse;
                }
                else {
                  ligne.nombreTitreAmorti = 0;
                  if (this.nbreligneDiffere != 0) {
                    ligne.montantRembourse = 0;
                  }
                  else {
                    ligne.montantRembourse = ligne.annuiteTotale - ligne.interet;
                  }
                  ligne.montantFinPeriode = ligne.capital - ligne.montantRembourse;
                }
              }
            }
          }
          else {
            console.log("Je suis ici sur In Fine");
          }
          ligne.tauxAmortissement = ligne.montantRembourse / ligne.capital;
          this.echeances.controls[i].patchValue(ligne);
          j++;
        }
      }
      this.cdr.detectChanges();
    });
  }

  genererTabAmortissements() {
    this.afficherListeEcheances(true);
    this.editable = false;
    this.canCancel = true;
    this.canDelete = false;
  }

  supprimerEcheances() {
    this.echeances.clear();
  }

  modifierForm() {
    this.editable = !this.editable;
  }

  save() {
    this.submitting = true;
    this.submitted = true;
    this.canCancel = false;
    if (this.form.invalid) {
      this.submitting = false;
      this.canCancel = true;
      return;
    }
    let titre = this.form.value;
    for (const key in titre)
    {
      let value = titre[key];
      if(value instanceof Array) {
        const newValue = value.map((el: any) => {
          let newEl = {
            ...el,
          };
          for (const cle in newEl) {
            let valeur = newEl[cle];
            if(cle.includes("date") && valeur != null) {
              newEl[cle] = new Date(valeur.year, valeur.month - 1, valeur.day + 1);
            }
            if(valeur instanceof Object) {
              for (const k in valeur) {
                let nouvelleValeur = valeur[k];
                if(k.includes("date") && nouvelleValeur != null) {
                  valeur[k] = new Date(nouvelleValeur.year, nouvelleValeur.month - 1, nouvelleValeur.day + 1);
                }
              }
            }
            newEl[cle] = valeur;
          }
          return newEl;
        });
        titre = {...titre, [key]: newValue};
      }
    }
    this.entityService.updateFn(titre, this.qualite).subscribe((resp: any) => {
      this.modal.dismiss();
      console.log("Enregistrement effectué avec succès === ", resp);
    });
  }

  close() {
    this.modal.dismiss();
  }
}
