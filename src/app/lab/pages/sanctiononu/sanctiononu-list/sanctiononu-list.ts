import { Component } from '@angular/core';
import * as xls from "xlsx";
import { Sanctiononu } from '../sanctiononu';
import { SanctionOnuService } from '../../../services/sanctiononu.service';
@Component({
  selector: 'app-sanctiononu-list',
  standalone: false,
  templateUrl: './sanctiononu-list.html',
  styleUrl: './sanctiononu-list.scss'
})
export class SanctiononuList {
 listeNoms: string[] = [];

  fichierSelectionne: File | null = null;

resultats: any[] = [];
constructor(
  private sanctionService: SanctionOnuService
) {}
verificationEnCours = false;
  chargerExcel(event: any): void {

    const fichier: File = event.target.files[0];

    if (!fichier) {
      return;
    }

    this.fichierSelectionne = fichier;

    const reader = new FileReader();

    reader.onload = (e: any) => {

      const data = new Uint8Array(e.target.result);

      const workbook = xls.read(data, {
        type: 'array'
      });

      // Première feuille du fichier Excel
      const nomFeuille = workbook.SheetNames[0];

      const feuille = workbook.Sheets[nomFeuille];

      // Conversion Excel → tableau JSON
      const lignes: any[] = xls.utils.sheet_to_json(feuille);

     // console.log('DONNEES EXCEL : ', lignes);

      // Récupération uniquement de la colonne "Nom"
      this.listeNoms = lignes
        .map(ligne => ligne['Nom'])
        .filter(nom => nom !== undefined && nom !== null && nom.toString().trim() !== '')
        .map(nom => nom.toString().trim());

     // console.log('LISTE DES NOMS : ', this.listeNoms);
    };

    reader.readAsArrayBuffer(fichier);
  }
  verifier(): void {

  if (this.listeNoms.length === 0) {
    alert('Veuillez d’abord charger un fichier Excel.');
    return;
  }

  this.verificationEnCours = true;

  this.sanctionService.afficherTous(this.listeNoms)
    .subscribe(

       (response) => {

        // console.log(
        //   'RESULTATS SANCTIONS :',
        //   response
        // );

        this.resultats = response.data;

        this.verificationEnCours = false;
      },

     

    );
}
}
