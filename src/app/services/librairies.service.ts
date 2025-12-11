import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {environment} from "../../environments/environment";
import { json } from 'stream/consumers';

@Injectable({
  providedIn: 'root'
})
export class LibrairiesService {
  private API_URL = `${environment.apiUrl}/libraries`;
  constructor(private http: HttpClient) { }

  registreActionnaires(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/registre/actionnaire/opcvm/xxxxxxx`, param);
  }

  registreActionnaire(param: any) {
    return this.http.post<any>(`${this.API_URL}/registre/actionnaire/opcvm`, param);
  }
  portefeuilleetat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/portefeuille`, param,
       {responseType: 'blob' as any }
    );
  }
  portefeuille(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/portefeuille`, param);
  }
  portefeuilleListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/portefeuille/liste`, param);
  }
  releveTitreFCP(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/relevetitrefcp`, param);
  }
  releveTitreFCPEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/relevetitrefcp`, param
      , {responseType: 'blob' as any });
  }
  releveTitreFCPListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/relevetitrefcp/liste`, param);
  }
  relevePartFCP(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/relevepartfcp`, param);
  }
  relevePartFCPEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/relevepartfcp`, param
      , {responseType: 'blob' as any }
    );
  }
  relevePartFCPListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/relevepartfcp/liste`, param);
  }
  soldeCompteComptable(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/soldedescomptescomptables`, param);
  }
  soldeCompteComptableEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/soldedescomptescomptables`, param, 
      {responseType: 'blob' as any });
  }
  soldeCompteComptableListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/soldedescomptescomptables/liste`, param);
  }
  balanceAvantInventaire(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/balanceavantinventaire`, param);
  }
  balanceAvantInventaireEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/balanceavantinventaire`, param, 
      {responseType: 'blob' as any });
  }
  balanceAvantInventaireListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/balanceavantinventaire/liste`, param);
  }
  souscriptionDetaille(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/pointsouscriptiondetaille`, param);
  }
  souscriptionDetailleEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/pointsouscriptiondetaille`, param, 
      {responseType: 'blob' as any });
  }
  souscriptionDetailleListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/pointsouscriptiondetaille/liste`, param);
  }
  rachatDetaille(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/pointrachatdetaille`, param);
  }
  rachatDetailleEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/pointrachatdetaille`, param, 
      {responseType: 'blob' as any });
  }
  rachatDetailleListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/pointrachatdetaille/liste`, param);
  }
  souscriptionglobal(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/pointsouscriptionglobal`, param);
  }
  souscriptionglobalEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/pointsouscriptionglobal`, param, 
      {responseType: 'blob' as any });
  }
  souscriptionglobalListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/pointsouscriptionglobal/liste`, param);
  }
  rachatglobal(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/pointrachatglobal`, param);
  }
  rachatglobalEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/pointrachatglobal`, param, 
      {responseType: 'blob' as any });
  }
  rachatglobalListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/pointrachatglobal/liste`, param);
  }
  balance(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/balance`, param);
  }
  balanceEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/balance`, param, 
      {responseType: 'blob' as any });
  }
  balanceListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/balance/liste`, param);
  }
  bilanAnnuelF1Etat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannuelf1bilan`, param, 
      {responseType: 'blob' as any });
  }
  bilanAnnuelF2Etat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannuelf2bilan`, param, 
      {responseType: 'blob' as any });
  }
  noteetatsfinanciersannuelsEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannexesnotesetatsfinanciers`, param, 
      {responseType: 'blob' as any });
  }
  etatfinanciertrimestrielbilantrimestrielEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinanciertrimestrielbilantrimestriel`, param, 
      {responseType: 'blob' as any });
  }
  notesrevenusportefeuilletitreannuelf1Etat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannuelf1notesrevenusportefeuilletitre`, param, 
      {responseType: 'blob' as any });
  }
  etatfinancierannexesactionadmisecote(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannexesactionadmisecote`, param, 
      {responseType: 'blob' as any });
  }
  notesrevenusportefeuilletitreannuelf2Etat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannuelf2notesrevenusportefeuilletitre`, param, 
      {responseType: 'blob' as any });
  }
  notesportefeuilletitreannuelEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannexesnoteportefeuilletitresannuel`, param, 
      {responseType: 'blob' as any });
  }
  noterevenusplacementsmonetaires(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinanciertrimestrielnotesrevenusplacementsmonetaires`, param, 
      {responseType: 'blob' as any });
  }
  notessommesdistribuablesannuelf1Etat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannuelf1notessommesdistribuables`, param, 
      {responseType: 'blob' as any });
  }
  notessommesdistribuablesannuelf2Etat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannuelf2notessommesdistribuables`, param, 
      {responseType: 'blob' as any });
  }
  etatfinancierannexesnotesurlecapital(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannexesnotesurlecapital`, param, 
      {responseType: 'blob' as any });
  }
  tableauanalysevl(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinanciertrimestrieltableauanalysevl`, param, 
      {responseType: 'blob' as any });
  }
  engagementhorsbilanannuelf1Etat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannuelf1engagementhorsbilan`, param, 
      {responseType: 'blob' as any });
  }
  etatfinancierannexesremunerationgestionnairedepositaire(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannexesremunerationgestionnairedepositaire`, param, 
      {responseType: 'blob' as any });
  }
  noteportefeuilletitre(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinanciertrimestrielnoteportefeuilletitre`, param, 
      {responseType: 'blob' as any });
  }
  noteplacementsmonetaires(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinanciertrimestrielnoteplacementsmonetaires`, param, 
      {responseType: 'blob' as any });
  }
  actionsadmisescote(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinanciertrimestrielactionsadmisescote`, param, 
      {responseType: 'blob' as any });
  }
  noteetatsfinanciers(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinanciertrimestrielnoteetatsfinanciers`, param, 
      {responseType: 'blob' as any });
  }
  etatmensuelsouscription(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinanciertrimestrieletatmensuelsouscriptions`, param, 
      {responseType: 'blob' as any });
  }
  notesurlecapital(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinanciertrimestrielnotecapital`, param, 
      {responseType: 'blob' as any });
  }
  donneesratiosannuelf1Etat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannuelf1donneesactionratiospertinents`, param, 
      {responseType: 'blob' as any });
  }
  montantfraisgestion(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinanciertrimestrielmontantfraisgestion`, param, 
      {responseType: 'blob' as any });
  }
  donneesratiosannuelf2Etat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannuelf2donneesactionratiospertinents`, param, 
      {responseType: 'blob' as any });
  }
  notesrevenusplacementmonetaireannuelf1Etat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannuelf1notesrevenusplacementsmonetaires`, param, 
      {responseType: 'blob' as any });
  }
  notesrevenusplacementmonetaireannuelf2Etat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannuelf2notesrevenusplacementsmonetaires`, param, 
      {responseType: 'blob' as any });
  }
  notesplacementsmonetaireannuel(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannexesnoteplacementsmonetairesannuel`, param, 
      {responseType: 'blob' as any });
  }
  noterevenusportefeuilletitremonetaires(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinanciertrimestrielnoterevenusportefeuilletitre`, param, 
      {responseType: 'blob' as any });
  }
  resultatAnnuelF1Etat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannuelf1resultat`, param, 
      {responseType: 'blob' as any });
  }
  resultatAnnuelF2Etat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannuelf2resultat`, param, 
      {responseType: 'blob' as any });
  }
  entreesportefeuilletitre(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannexesetatsentreesportefeuilletitre`, param, 
      {responseType: 'blob' as any });
  }
  etatfinanciertrimestrielcompteresultat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinanciertrimestrielcompteresultat`, param, 
      {responseType: 'blob' as any });
  }
  etatvariationactifnetannuelf1Etat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannuelf1etatvariationactifnet`, param, 
      {responseType: 'blob' as any });
  }
  etatvariationactifnetannuelf2Etat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannuelf2etatvariationactifnet`, param, 
      {responseType: 'blob' as any });
  }
  sortiesportefeuilletitreEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinancierannexesetatsortiesportefeuilletitre`, param, 
      {responseType: 'blob' as any });
  }
  etatfinanciertrimestrielvariationactifnet(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/etatfinanciertrimestrielvariationactifnet`, param, 
      {responseType: 'blob' as any });
  }
  relevePartActionnaire(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/relevepartactionnaire`, param);
  }
  relevePartActionnaireEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/relevepartactionnaire`, param,
      {responseType: 'blob' as any }
    );
  }
  declarationCommissionSurActif(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/declarationcommissionactif`, param);
  }
  declarationCommissionSurActifListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/declarationcommissionactif/liste`, param);
  }
  declarationCommissionSurActifEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/declarationcommissionactif`, param,
      {responseType: 'blob' as any }
    );
  }
  pointRemboursementEffectuePeriode(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/pointremboursementeffectueperiode`, param);
  }
  pointRemboursementEffectuePeriodeListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/pointremboursementeffectueperiode/liste`, param);
  }
  pointRemboursementEffectuePeriodeEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/pointremboursementeffectueperiode`, param,
      {responseType: 'blob' as any }
    );
  }
  pointPeriodiqueTafa(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/pointperiodiquetafa`, param);
  }
  pointPeriodiqueTafaListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/pointperiodiquetafa/liste`, param);
  }
  pointPeriodiqueTafaEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/pointperiodiquetafa`, param,
      {responseType: 'blob' as any }
    );
  }
  compositiondetailleactif(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/compositiondetailleactif`, param,
      {responseType: 'blob' as any }
    );
  }
  pointActifNetPartVlListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/pointactifnetpartvl/liste`, param);
  }
  grandlivreListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/grandlivre/liste`, param);
  }
  grandlivreEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/grandlivre`, param,
      {responseType: 'blob' as any }
    );
  }
  grandlivreEtatExcel(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/excel/grandlivre`, param,
      {responseType: 'blob' as any }
    );
  }
 liste_verif_SouscriptionEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/documentseancelisteverificationsouscription`, param, 
      {responseType: 'blob' as any });
  }
 liste_verif_RachatEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/documentseancelisteverificationrachats`, param, 
      {responseType: 'blob' as any });
  }
 liste_verif_EcritureEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/documentseancelisteverificationecriture`, param, 
      {responseType: 'blob' as any });
  }
 liste_verif_Ecriture_VDEEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/documentseancelisteverificationecriturevde`, param, 
      {responseType: 'blob' as any });
  }
 liste_verif_Ecriture_CHARGEEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/documentseancelisteverificationecriturecharge`, param, 
      {responseType: 'blob' as any });
  }
 liste_verif_vdeEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/documentseancelisteverificationvde`, param, 
      {responseType: 'blob' as any });
  }
 liste_verif_chargeEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/documentseancelisteverificationcharge`, param, 
      {responseType: 'blob' as any });
  }
 liste_verif_codePosteEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/documentseancelisteverificationcodeposte`, param, 
      {responseType: 'blob' as any });
  }
  operationTransfertPart(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/operationtransfertpart`, param);
  }
  historiqueVL(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/historiquevl/liste`, param);
  }
  avistransfertpartListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/avistransfertpart/liste`, param);
  }
  avistransfertpartEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/avistransfertpart`, param,
      {responseType: 'blob' as any }
    );
  }
  pointinvestissement(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/pointinvestissement`, param);
  }
  pointinvestissementListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/pointinvestissement/liste`, param);
  }
  pointinvestissementEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/pointinvestissement`, param,
      {responseType: 'blob' as any }
    );
  }
  previsionnelremboursements(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/previsionnelremboursements`, param);
  }
  previsionnelremboursementsListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/previsionnelremboursements/liste`, param);
  }
  previsionnelremboursementsEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/previsionnelremboursements`, param,
      {responseType: 'blob' as any }
    );
  }
  suiviecheancetitre(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/suiviecheancetitre`, param);
  }
  suiviecheancetitreListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/suiviecheancetitre/liste`, param);
  }
  suiviecheancetitreEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/suiviecheancetitre`, param,
      {responseType: 'blob' as any }
    );
  }
  journalEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/journal`, param,
      {responseType: 'blob' as any }
    );
  }
  relevePartActionnaireListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/relevepartactionnaire/liste`, param);
  }
  etatSuiviAtionnaire(param: any) {
    return this.http.post<any>(`${this.API_URL}/etatsuiviactionnaire`, param);
  }
  etatSuiviAtionnaireEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/etatsuiviactionnaire`, param,{responseType: 'blob' as any });
  }
  etatSuiviAtionnaireListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/etatsuiviactionnaire/liste`, param);
  }
  etatFraisFonctionnement(param: any) {
    return this.http.post<any>(`${this.API_URL}/etatfraisfonctionnement`, param);
  }
  etatfraisfonctionnementEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/etatfraisfonctionnement`, param
      ,{responseType: 'blob' as any }
    );
  }
  etatfraisfonctionnementListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/etatfraisfonctionnement/liste`, param);
  }
  evolutionVL(param: any) {
    return this.http.post<any>(`${this.API_URL}/evolutionvl`, param);
  }
  soldeCompteClient(idActionnaire: any,idOpcvm:any) {
    return this.http.get<any>(`${this.API_URL}/soldecompteclient/${idActionnaire}/${idOpcvm}`);
  }
  evolutionVLEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/evolutionvl`, param
      ,{responseType: 'blob' as any }
    );
  }
  evolutionVLListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/evolutionvl/liste`, param);
  }
  etatSuiviClientEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/etatsuiviclient`, param
      ,{responseType: 'blob' as any }
    );
  }
  etatSuiviClientListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/etatsuiviclient/liste`, param);
  }
  pointTresorerie(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/pointtresorerie`, param
      ,{responseType: 'blob' as any }
    );
  }
  historiqueActionnaireEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/historiqueactionnaire`, param
      ,{responseType: 'blob' as any }
    );
  }
  historiqueActionnaire(param: any) {
    return this.http.post<any>(`${this.API_URL}/historiqueactionnaire`, param);
  }
  pointSouscriptionEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/pointrachat`, param
      ,{responseType: 'blob' as any }
    );
  }
  pointRachatEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/pointsouscription`, param
      ,{responseType: 'blob' as any }
    );
  }
  pointSousriptionRachat(param: any) {
    return this.http.post<any>(`${this.API_URL}/pointsouscriptionrachat`, param);
  }
  pointSousriptionRachatListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/pointsouscriptionrachat/liste`, param);
  }
  evolutionActifNetEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/evolutionactifnet`, param
      ,{responseType: 'blob' as any }
    );
  }
  pointRepartitionPortefeuilleEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/pointrepartitionportefeuille`, param
      ,{responseType: 'blob' as any }
    );
  }
  pointRepartitionPortefeuille(param: any) {
    return this.http.post<any>(`${this.API_URL}/pointrepartitionportefeuille`, param);
  }
  pointRepartitionPortefeuilleListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/pointrepartitionportefeuille/liste`, param);
  }
  portefeuilleActionnaire(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/portefeuilleactionnaire`, param
      ,{responseType: 'blob' as any }
    );
  }
  portefeuilleActionnaireF2(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/portefeuilleactionnaireformat2`, param
      ,{responseType: 'blob' as any }
    );
  }
  portefeuilleActionnaireAnnee(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/portefeuilleactionnairefinannee`, param
      ,{responseType: 'blob' as any }
    );
  }
  releveActionnaireEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/releveactionnaire`, param
      ,{responseType: 'blob' as any }
    );
  }
  
  performancePortefeuilleActionnaire(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/performanceportefeuilleactionnaire`
      , param,{responseType: 'blob' as any });
  }
  ficheClientEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/ficheclient`,param,{responseType: 'blob' as any });
  }
  releveActionnaire(param: any) {
    return this.http.post<any>(`${this.API_URL}/releveactionnaire`, param);
  }
  afficherPersonnePhysiqueMorale() {
    return this.http.get<any>(`${this.API_URL}/personnephysiquemorale`);
  }
  rechercherPersonnePhysiqueMorale(valeur:any) {
    return this.http.get<any>(`${this.API_URL}/personnephysiquemorale/${valeur}`);
  }
  rechercherPersonnePhysiqueMoraleSelonType(type:any,valeur:any) {
    return this.http.get<any>(`${this.API_URL}/personnephysiquemoraleselontype/${type}/${valeur}`);
  }
  afficherPersonnePhysiqueMoraleSelonType(valeur:any) {
    return this.http.get<any>(`${this.API_URL}/personnephysiquemoraleselontype/${valeur}`);
  }
  historiqueActionnaireListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/historiqueactionnaire/liste`, param);
  }
  procedureComptable() {
    return this.http.get<any>(`${this.API_URL}/etats/procedurecomptable`,{responseType: 'blob' as any });
  }
  telechargerRegistreActionnaire(param: any) {
    return this.http.post<any>(`${this.API_URL}/jasperpdf/export/registre/actionnaire/xxxxxxx/yyyy`, param
      ,{responseType: 'blob' as any }
    );
  }

  cumpActionnaire(param: any) {
    return this.http.post<any>(`${this.API_URL}/cump/actionnaire/opcvm`, param);
  }

  soldeToutCompte(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/solde/tout/compte`, param);
  }
}
