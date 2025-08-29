import { Routes } from '@angular/router';
import {checkPermissionAccessGuard} from "../../auth/check-permission-access.guard";
import {checkRoleAccessGuard} from "../../auth/check-role-access.guard";

const CoreRouting: Routes = [
  //PARAMETRE
  {
    path: 'standard/etats',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./etats/etats.module').then((m) => m.EtatsModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_ETATS' },
  },
  {
    path: 'standard/historiqueactionnaire',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./historiqueactionnaire/historiqueactionnaire.module').then((m) => m.HistoriqueactionnaireModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_HistoriqueActionnaire' },
  },
  {
    path: 'standard/parametre/degre',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./degre/degre.module').then((m) => m.DegreModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_DEGRE' },
  },
  {
    path: 'standard/parametre/menu',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./menus/menus.module').then((m) => m.MenusModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_MENU' },
  },
  {
    path: 'standard/parametre/societedegestion',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./societedegestion/societedegestion.module').then((m) => m.SocietedegestionModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_SOCIETE_GESTION' },
  },
  {
    path: 'standard/parametre/monnaie',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./monnaie/monnaie.module').then((m) => m.MonnaieModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_MONNAIE' },
  },
  {
    path: 'standard/parametre/souscategorie',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./souscategorie/souscategorie.module').then((m) => m.SouscategorieModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_SOUSCATEGORIE' },
  },
  {
    path: 'standard/parametre/formejuridique',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./formejuridique/formejuridique.module').then((m) => m.FormejuridiqueModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_FORMEJURIDIQUE' },
  },
  {
    path: 'standard/parametre/langue',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./langue/langue.module').then((m) => m.LangueModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_LANGUE' },
  },
  {
    path: 'standard/parametre/systemedinformation',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./systemedinformation/systemedinformation.module').then((m) => m.SystemedinformationModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_SYSTEMEDINFORMATION' },
  },
  {
    path: 'standard/parametre/nomenclature/typecompte',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./revuecompte/typecompte/typecompte.module').then((m) => m.TypecompteModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_TYPECOMPTE' },
  },
  {
    path: 'standard/parametre/nomenclature/typeclient',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./revuecompte/typeclient/typeclient.module').then((m) => m.TypeclientModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_TYPECLIENT' },
  },
  {
    path: 'standard/parametre/nomenclature/soustypecompte',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./revuecompte/soustypecompte/soustypecompte.module').then((m) => m.SoustypecompteModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_SOUSTYPECOMPTE' },
  },
  {
    path: 'standard/parametre/nomenclature/soustypeclient',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./revuecompte/soustypeclient/soustypeclient.module').then((m) => m.SoustypeclientModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_SOUSTYPECLIENT' },
  },
  {
    path: 'standard/parametre/nomenclature/categorieclient',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./revuecompte/categorieclient/categorieclient.module').then((m) => m.CategorieclientModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_CATEGORIECLIENT' },
  },
  {
    path: 'standard/parametre/instrumentfinancier/compartiment',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./compartiment/compartiment.module').then((m) => m.CompartimentModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_COMPARTIMENT' },
  },
  {
    path: 'standard/parametre/instrumentfinancier/natureevenement',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./natureevenement/natureevenement.module').then((m) => m.NatureevenementModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_NATUREEVENEMENT' },
  },
  {
    path: 'standard/parametre/instrumentfinancier/secteurboursier',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./secteurboursier/secteurboursier.module').then((m) => m.SecteurboursierModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_SECTEURBOURSIER' },
  },
  {
    path: 'standard/parametre/instrumentfinancier/soustypeaction',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./soustypeaction/soustypeaction.module').then((m) => m.SoustypeactionModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_SOUSTYPEACTION' },
  },
  {
    path: 'standard/parametre/instrumentfinancier/typeaction',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./typeaction/typeaction.module').then((m) => m.TypeactionModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_TYPEACTION' },
  },
  {
    path: 'standard/parametre/instrumentfinancier/typeemetteur',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./typeemetteur/typeemetteur.module').then((m) => m.TypeemetteurModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_TYPEEMETTEUR' },
  },
  {
    path: 'standard/parametre/instrumentfinancier/typeemission',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./typeemission/typeemission.module').then((m) => m.TypeemissionModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_TYPEEMISSION' },
  },
  {
    path: 'standard/parametre/instrumentfinancier/typeevenement',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./typeevenement/typeevenement.module').then((m) => m.TypeevenementModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_TYPEEVENEMENT' },
  },
  {
    path: 'standard/parametre/instrumentfinancier/typegarant',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./typegarant/typegarant.module').then((m) => m.TypegarantModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_TYPEGARANT' },
  },
  {
    path: 'standard/parametre/instrumentfinancier/typeobligation',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./typeobligation/typeobligation.module').then((m) => m.TypeobligationModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_TYPEOBLIGATION' },
  },
  {
    path: 'standard/parametre/instrumentfinancier/place',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./place/place.module').then((m) => m.PlaceModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_PLACE' },
  },
  {
    path: 'standard/parametre/instrumentfinancier/banque',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./banque/banque.module').then((m) => m.BanqueModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_BANQUE' },
  },
  {
    path: 'standard/parametre/comptabilite/typeoperation',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./typeoperation/typeoperation.module').then((m) => m.TypeoperationModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_TYPEOPERATION' },
  },
  {
    path: 'standard/parametre/comptabilite/journal',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./journal/journal.module').then((m) => m.JournalModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_JOURNAL' },
  },
  {
    path: 'standard/parametre/comptabilite/natureoperation',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./natureoperation/natureoperation.module').then((m) => m.NatureoperationModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_NATUREOPERATION' },
  },
  {
    path: 'standard/parametre/comptabilite/formule',
    loadChildren: () =>
      import('./formule/formule.module').then((m) => m.FormuleModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/comptabilite/modeleformule',
    loadChildren: () =>
      import('./modeleformule/modeleformule.module').then((m) => m.ModeleformuleModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/comptabilite/modeleecriture',
    loadChildren: () =>
      import('./modeleecriture/modeleecriture.module').then((m) => m.ModeleecritureModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/comptabilite/plan',
    loadChildren: () =>
      import('./plan/plan.module').then((m) => m.PlanModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/comptabilite/comptecomptable',
    loadChildren: () =>
      import('./comptecomptable/comptecomptable.module').then((m) => m.ComptecomptableModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/comptabilite/postecomptable',
    loadChildren: () =>
      import('./postecomptable/postecomptable.module').then((m) => m.PostecomptableModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/comptabilite/ibrubriqueposition',
    loadChildren: () =>
      import('./ibrubriqueposition/ibrubriqueposition.module').then((m) => m.IbrubriquepositionModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/comptabilite/correspondance',
    loadChildren: () =>
      import('./correspondance/correspondance.module').then((m) => m.CorrespondanceModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/personne/morale',
    loadChildren: () => import('./personne-morale/personne-morale.module').then((m) => m.PersonneMoraleModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/pays',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./pays/pays.module').then((m) => m.PaysModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_PAYS' },
  },
  {
    path: 'standard/parametre/physique',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./physique/physique.module').then((m) => m.PhysiqueModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_PHYSIQUE' },
  },
  {
    path: 'standard/parametre/morale',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./morale/morale.module').then((m) => m.MoraleModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_MORALE' },
  },
  {
    path: 'standard/parametre/opcvm',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./opcvm/opcvm.module').then((m) => m.OpcvmModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_OPCVM' },
  },
  {
    path: 'standard/parametre/personne/physique',
    loadChildren: () => import('./personne-physique/personne-physique.module').then((m) => m.PersonnePhysiqueModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/produit',
    loadChildren: () => import('./produit/produit.module').then((m) => m.ProduitModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/profession',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./profession/profession.module').then((m) => m.ProfessionModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_PROFESSION' },
  },
  {
    path: 'administration/profile',
    loadChildren: () => import('./utilisateur/profile/profile.module').then((m) => m.ProfileModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/qualite',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./qualite/qualite.module').then((m) => m.QualiteModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_QUALITE' },
  },
  {
    path: 'standard/parametre/secteur',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./secteur/secteur.module').then((m) => m.SecteurModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_SECTEUR' },
  },
  {
    path: 'standard/parametre/typedocument',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./typedocument/typedocument.module').then((m) => m.TypedocumentModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_TYPEDOCUMENT' },
  },
  //ADMINISTRATION
  {
    path: 'administration/personnels',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./personnel/personnel.module').then((m) => m.PersonnelModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_PERSONNEL' },
  },
  {
    path: 'administration/utilisateurs',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./utilisateur/utilisateur.module').then((m) => m.UtilisateurModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_UTILISATEUR' },
  },
  {
    path: 'administration/roles',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./role/role.module').then((m) => m.RoleModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_ACCESS' },
  },
  {
    path: 'administration/permissions',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./permission/permission.module').then((m) => m.PermissionModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_PERMISSION' },
  },
  // //REPORTINGS
  // {
  //   path: 'reportings',
  //   loadChildren: () =>
  //     import('./print-layout/print-layout.module').then((m) => m.PrintLayoutModule),
  //   data: { layout: 'dark-sidebar' },
  // },
];

export { CoreRouting };
