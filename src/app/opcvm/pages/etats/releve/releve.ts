import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../core/modules/auth';
import { PersonneMoraleService } from '../../../../crm/services/personne/personne.morale.service';
import { LibrairiesService } from '../../../../services/librairies.service';
import { LocalService } from '../../../../services/local.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { catchError, finalize, of } from 'rxjs';
import * as XLSX from 'xlsx';

interface MouvementCompte {
  dateOperation: string;
  dateValeur: string;
  libelleOperation: string;
  debit: number;
  credit: number;
  soldeParLigne: number;
}
@Component({
  selector: 'app-releve',
  standalone: false,
  templateUrl: './releve.html',
  styleUrl: './releve.scss'
})
export class Releve implements OnInit, AfterViewInit, AfterContentInit, OnDestroy{
 dateDebut: Date //= '2026-01-01';
  dateFin: Date// = '2026-10-12';

  // =====================================================
  // MONTANTS DU RELEVE
  // =====================================================

  soldeDebut: number = 0;
  totDebit: number = 0;
  totCredit: number = 0;
  soldeFin: number = 0;
  currentOpcvm: any;
  currentSeance: any;
  currentUser: any;
  form: FormGroup;
  estAfficher:boolean
  subscriptions: Subscription[] = [];
  // =====================================================
  // LISTE DES MOUVEMENTS
  // Cette liste sera alimentée par l'API Spring Boot.
  // =====================================================
 
  listeMouvements: MouvementCompte[] = [];
  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private localStore: LocalService,
    public distributeurService: PersonneMoraleService,
    private libService: LibrairiesService,
    public renderer: Renderer2) {
    this.currentUser = this.authService.currentUserValue;
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
  
    
  }
  ngAfterContentInit(): void {
  }

  ngAfterViewInit(): void {
    //this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  ngOnInit(): void {

    const dateOuv = new Date(this.currentSeance?.dateOuverture);
    this.dateDebut=new Date(this.currentSeance?.dateFermeture);
    const dateFin = new Date(this.currentSeance?.dateFermeture);
    this.form = this.fb.group({
      dateFin: [
        new NgbDate(dateFin.getFullYear(), dateFin.getMonth()+1, dateFin.getDate()), Validators.required
      ],
      dateDebut: [
        new NgbDate(this.dateDebut.getFullYear(), 1, 1), Validators.required
      ]
    });
  }
  // =====================================================
  // AFFICHER LE RELEVE
  // =====================================================

  afficher(): void {

    // if (!this.dateDebut || !this.dateFin) {
    //   alert('Veuillez renseigner la date de début et la date de fin.');
    //   return;
    // }

    // if (this.dateDebut > this.dateFin) {
    //   alert('La date de début doit être antérieure ou égale à la date de fin.');
    //   return;
    // }
    this.estAfficher=true
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
      param = {
        ...param,
        idPersonne:this.form.value.distributeur==null?null:this.form.value.distributeur.idPersonne,
        dateDebut: new Date(param.dateDebut.year, param.dateDebut.month - 1, param.dateDebut.day + 1),
         dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
      }
    this.libService.releveListe(param).pipe(
            catchError((err) => {
              this.estAfficher = false;
              return of(err.message);
            }),
            finalize(() => {
              this.estAfficher = false;
              
            })
          )
           .subscribe(
      (data)=>{
        this.listeMouvements=data.data
        if(this.listeMouvements.length!=0){
          this.soldeDebut=data.data[0].soldeDebut
          this.soldeFin=data.data[0].soldeFin
          this.totCredit=data.data[0].totCredit
          this.totDebit=data.data[0].totDebit
        }
      }
    )

  }

  // =====================================================
  // APERCU / IMPRESSION
  // =====================================================

  apercu(): void {
    window.print();
  }

  // =====================================================
  // EXPORTER
  // =====================================================

  exporter(): void {

    if (this.listeMouvements.length === 0) {
      alert('Aucun mouvement à exporter.');
      return;
    }

    // TODO : brancher l'export Excel.
    alert('La fonctionnalité d’export Excel reste à intégrer.');
  }

  // =====================================================
  // FORMATAGE DES MONTANTS
  // =====================================================

  formaterMontant(montant: number | null | undefined): string {

    if (montant === null || montant === undefined) {
      return '0';
    }

    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant);
  }
  formaterDate(date: string | Date | null | undefined): string {
    if (!date) {
      return '';
    }

    const d = typeof date === 'string' ? new Date(date) : date;

    // Vérifie que la date est valide
    if (isNaN(d.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(d);
  }
      

    export() {
      if (!this.listeMouvements || this.listeMouvements.length === 0) {
        // Tu peux afficher un message ici
        return;
      }

      // Préparation des données au même format que ton fichier
      const data = this.listeMouvements.map(m => ({
        'DATE OP.': this.formaterDate(m.dateOperation),
        'DATE VAL.': this.formaterDate(m.dateValeur),
        'LIBELLE': m.libelleOperation,
        'DEBIT': this.formaterMontant(m.debit) ?? 0,
        'CREDIT': this.formaterMontant(m.credit) ?? 0,
        'SOLDE': this.formaterMontant(m.soldeParLigne) ?? 0
      }));

      // Création de la feuille
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Largeur des colonnes (optionnel mais plus joli)
      worksheet['!cols'] = [
        { wch: 20 }, // DATE OP.
        { wch: 20 }, // DATE VAL.
        { wch: 60 }, // LIBELLE
        { wch: 18 }, // DEBIT
        { wch: 18 }, // CREDIT
        { wch: 18 }  // SOLDE
      ];

      // Création du classeur
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Relevé de compte');

      // Génération du fichier
      const date = new Date();
      const fileName = `Releve_Compte_${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}.xlsx`;

      XLSX.writeFile(workbook, fileName);
    }
}
