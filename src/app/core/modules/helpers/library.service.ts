import {Injectable, Injector, OnDestroy} from '@angular/core';
import {AuthService} from "../auth";
declare var $:JQueryStatic;
import "select2";
import {CoreRouting} from "../../pages/routing";
import {CrmRouting} from "../../../crm/pages/routing";
import {LabRouting} from "../../../lab/pages/routing";
import {Route, Router, Routes} from "@angular/router";
import {RisqueRouting} from "../../../risque/pages/routing";
import {BehaviorSubject} from "rxjs";
import {hooks} from "prismjs";
import all = hooks.all;

@Injectable({
  providedIn: 'root'
})
export class LibraryService implements OnDestroy{
  menus: any = {};
  opcvmMenus: any = {};
  public urls: string[] = [];

  routerUrls: { path: string; component: any }[] = [];
  allRoutes$: BehaviorSubject<{ path: string; component: any }[]> = new BehaviorSubject<{path: string; component: any}[]>([]);

  constructor(
    private authService: AuthService,
    private injector: Injector,
    private router: Router) {
    // this.toutesLesRoutes(router, injector);
    this.menus = {
      items: [
        {
          allow: this.authService.isGrantedRole('ROLE_DASHBOARD'),
          title: 'Tableau de bord',
          icon: 'element-11',
          page: '/dashboard',
          translate: 'MENU.DASHBOARD',
          role: 'ROLE_DASHBOARD',
          dataLink: '',
          parent: null,
          route: this.routerUrls.find((value, index, obj) =>
            value.path.includes('/dashboard')),
          children: []
        },
        // {
        //   allow: this.authService.isGrantedRole('ROLE_BUILDER'),
        //   title: 'Layout Builder',
        //   icon: 'switch',
        //   page: '/builder',
        //   translate: '',
        //   role: 'ROLE_BUILDER',
        //   dataLink: '',
        //   parent: null,
        //   children: []
        // },
        {
          allow: null,
          type: 'section',
          title: 'ADMINISTRATION',
          icon: '',
          translate: '',
          role: '',
          dataLink: '',
          parent: null,
          children: [
            {
              allow: null,
              title: 'Utilisateurs & Accès',
              icon: 'profile-user',
              dataLink: '/app/administration',
              page: '',
              translate: '',
              role: '',
              parent: 'ADMINISTRATION',
              children: [
                {
                  allow: this.authService.isGrantedRole('ROLE_UTILISATEUR'),
                  title: 'Utilisateurs',
                  page: '/app/administration/utilisateurs',
                  role: 'ROLE_UTILISATEUR',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Utilisateurs & Accès',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_ACCESS'),
                  title: 'Roles',
                  page: '/app/administration/roles',
                  role: 'ROLE_ACCESS',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Utilisateurs & Accès',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_PERMISSION'),
                  title: 'Permissions',
                  page: '/app/administration/permissions',
                  role: 'ROLE_PERMISSION',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Utilisateurs & Accès',
                  children: []
                }
              ]
            },
            {
              allow: this.authService.isGrantedRole('ROLE_MENU'),
              title: 'Menu',
              icon: '',
              page: '/app/standard/parametre/menu',
              role: 'ROLE_MENU',
              translate: '',
              dataLink: '',
              parent: 'ADMINISTRATION',
              children: []
            },
            {
              allow: this.authService.isGrantedRole('ROLE_PERSONNEL'),
              title: 'Personnel',
              icon: '',
              page: '/app/administration/personnels',
              role: 'ROLE_PERSONNEL',
              translate: '',
              dataLink: '',
              parent: 'ADMINISTRATION',
              children: []
            }
          ]
        },
        {
          allow: null,
          type: 'section',
          title: 'STANDARD',
          icon: '',
          translate: '',
          role: '',
          dataLink: '',
          parent: null,
          children: [
            {
              allow: null,
              title: 'Paramètre',
              icon: 'element-plus',
              translate: '',
              role: '',
              dataLink: '',
              page: '',
              parent: 'STANDARD',
              children: [
                {
                  allow: this.authService.isGrantedRole('ROLE_OPCVM'),
                  title: 'Créer un opcvm',
                  icon: '',
                  page: '/app/standard/parametre/opcvm',
                  role: 'ROLE_OPCVM',
                  translate: '',
                  dataLink: '',
                  parent: 'Paramètre',
                  children: []
                },
                /*{
                  allow: null,
                  title: 'Personne',
                  dataLink: '/app/standard/parametre/personne',
                  icon: '',
                  page: '',
                  translate: '',
                  role: '',
                  parent: 'Paramètre',
                  children: [
                    {
                      allow: null,
                      title: 'Physique',
                      dataLink: '/app/standard/parametre/personne/physique',
                      icon: '',
                      page: '',
                      translate: '',
                      role: '',
                      parent: 'Personne',
                      children: [
                        {
                          allow: this.authService.isGrantedRole('ROLE_PHYSIQUE_PROSPECT'),
                          title: 'Prospect',
                          page: '/app/standard/parametre/personne/physique/prospect',
                          role: 'ROLE_PHYSIQUE_PROSPECT',
                          dataLink: '',
                          icon: '',
                          translate: '',
                          parent: 'Physique',
                          children: []
                        },
                        {
                          allow: this.authService.isGrantedRole('ROLE_PHYSIQUE_ACTIONNAIRE'),
                          title: 'Actionnaire',
                          page: '/app/standard/parametre/personne/physique/actionnaire',
                          role: 'ROLE_PHYSIQUE_ACTIONNAIRE',
                          dataLink: '',
                          icon: '',
                          translate: '',
                          parent: 'Physique',
                          children: []
                        },
                        {
                          allow: this.authService.isGrantedRole('ROLE_PHYSIQUE_DISTRIBUTEUR'),
                          title: 'Distributeur',
                          page: '/app/standard/parametre/personne/physique/distributeur',
                          role: 'ROLE_PHYSIQUE_DISTRIBUTEUR',
                          dataLink: '',
                          icon: '',
                          translate: '',
                          parent: 'Physique',
                          children: []
                        },
                        /!*{
                          allow: this.authService.isGrantedRole('ROLE_PHYSIQUE_EXPOSE'),
                          title: 'Personne politiquement exposée',
                          page: '/lab/standard/parametre/personne/physique/politiquementexpose',
                          role: 'ROLE_PHYSIQUE_EXPOSE',
                          dataLink: '',
                          icon: '',
                          translate: '',
                          parent: 'Physique',
                          children: []
                        },
                        {
                          allow: this.authService.isGrantedRole('ROLE_PHYSIQUE_JUGE'),
                          title: 'Personne jugée par des mesures de gel d\''+'avoirs',
                          page: '/lab/standard/parametre/personne/physique/juge',
                          role: 'ROLE_PHYSIQUE_JUGE',
                          dataLink: '',
                          icon: '',
                          translate: '',
                          parent: 'Physique',
                          children: []
                        },*!/
                        {
                          allow: this.authService.isGrantedRole('ROLE_PHYSIQUE_SANCTIONNEE'),
                          title: 'Personne physique sanctionnée',
                          page: '/lab/standard/parametre/personne/physique/sanctionnee',
                          role: 'ROLE_PHYSIQUE_SANCTIONNEE',
                          dataLink: '',
                          icon: '',
                          translate: '',
                          parent: 'Physique',
                          children: []
                        }
                      ]
                    },
                    {
                      allow: null,
                      title: 'Morale',
                      dataLink: '/app/standard/parametre/personne/morale',
                      icon: '',
                      page: '',
                      translate: '',
                      role: '',
                      parent: 'Personne',
                      children: [
                        {
                          allow: this.authService.isGrantedRole('ROLE_MORALE_PROSPECT'),
                          title: 'Prospect',
                          page: '/app/standard/parametre/personne/morale/prospect',
                          role: 'ROLE_MORALE_PROSPECT',
                          dataLink: '',
                          icon: '',
                          translate: '',
                          parent: 'Morale',
                          children: []
                        },
                        {
                          allow: this.authService.isGrantedRole('ROLE_MORALE_ACTIONNAIRE'),
                          title: 'Actionnaire',
                          page: '/app/standard/parametre/personne/morale/actionnaire',
                          role: 'ROLE_MORALE_ACTIONNAIRE',
                          dataLink: '',
                          icon: '',
                          translate: '',
                          parent: 'Morale',
                          children: []
                        },
                        {
                          allow: this.authService.isGrantedRole('ROLE_MORALE_DISTRIBUTEUR'),
                          title: 'Distributeur',
                          page: '/app/standard/parametre/personne/morale/distributeur',
                          role: 'ROLE_MORALE_DISTRIBUTEUR',
                          dataLink: '',
                          icon: '',
                          translate: '',
                          parent: 'Morale',
                          children: []
                        },
                        /!*{
                          allow: this.authService.isGrantedRole('ROLE_MORALE_EXPOSE'),
                          title: 'Personne politiquement exposée',
                          page: '/lab/standard/parametre/personne/morale/politiquementexpose',
                          role: 'ROLE_MORALE_EXPOSE',
                          dataLink: '',
                          icon: '',
                          translate: '',
                          parent: 'Morale',
                          children: []
                        },
                        {
                          allow: this.authService.isGrantedRole('ROLE_MORALE_JUGE'),
                          title: 'Personne jugée par des mesures de gel d\''+'avoirs',
                          page: '/lab/standard/parametre/personne/morale/juge',
                          role: 'ROLE_MORALE_JUGE',
                          dataLink: '',
                          icon: '',
                          translate: '',
                          parent: 'Morale',
                          children: []
                        },*!/
                        {
                          allow: this.authService.isGrantedRole('ROLE_MORALE_SANCTIONNEE'),
                          title: 'Personne morale sanctionnée',
                          page: '/lab/standard/parametre/personne/morale/sanctionnee',
                          role: 'ROLE_MORALE_SANCTIONNEE',
                          dataLink: '',
                          icon: '',
                          translate: '',
                          parent: 'Morale',
                          children: []
                        }
                      ]
                    }
                  ]
                },*/
                {
                  allow: null,
                  title: 'Personne Physique',
                  dataLink: '',
                  icon: '',
                  page: '',
                  role: 'ROLE_PHYSIQUE',
                  translate: '',
                  parent: 'Paramètre',
                  children: [
                    {
                      allow: this.authService.isGrantedRole('ROLE_PHYSIQUE'),
                      title: 'Liste des PP',
                      page: '/app/standard/parametre/physique',
                      role: 'ROLE_PHYSIQUE',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Personne Physique',
                      route: null,
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_PHYSIQUE_SANCTIONNEE'),
                      title: 'Liste des sanctionnées',
                      page: '/lab/standard/parametre/personne/physique/sanctionnee',
                      role: 'ROLE_PHYSIQUE_SANCTIONNEE',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      children: []
                    }
                  ]
                },
                {
                  allow: null,
                  title: 'Personne Morale',
                  dataLink: '',
                  icon: '',
                  page: '',
                  role: '',
                  translate: '',
                  parent: 'Paramètre',
                  children: [
                    {
                      allow: this.authService.isGrantedRole('ROLE_MORALE'),
                      title: 'Liste des PM',
                      page: '/app/standard/parametre/morale',
                      role: 'ROLE_MORALE',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Personne Morale',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_MORALE_SANCTIONNEE'),
                      title: 'Personne morale sanctionnée',
                      page: '/lab/standard/parametre/personne/morale/sanctionnee',
                      role: 'ROLE_MORALE_SANCTIONNEE',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Personne Morale',
                      children: []
                    }
                  ]
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_SOCIETE_GESTION'),
                  title: 'Société de Gestion',
                  icon: '',
                  page: '/app/standard/parametre/societedegestion',
                  role: 'ROLE_SOCIETE_GESTION',
                  translate: '',
                  dataLink: '',
                  parent: 'Paramètre',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_MODE_ETABLISSEMENT'),
                  title: 'Mode établissement',
                  icon: '',
                  page: '/crm/standard/parametre/modeetablissement',
                  role: 'ROLE_MODE_ETABLISSEMENT',
                  translate: '',
                  dataLink: '',
                  parent: 'Paramètre',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_CATEGORIE'),
                  title: 'Categorie',
                  icon: '',
                  page: '/crm/standard/parametre/categorie',
                  role: 'ROLE_CATEGORIE',
                  translate: '',
                  dataLink: '',
                  parent: 'Paramètre',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_DEGRE'),
                  title: 'Dégré de connaissance',
                  icon: '',
                  page: '/app/standard/parametre/degre',
                  role: 'ROLE_DEGRE',
                  translate: '',
                  dataLink: '',
                  parent: 'Paramètre',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_INDICATEUR'),
                  title: 'Indicateur',
                  icon: '',
                  page: '/crm/standard/parametre/indicateur',
                  role: 'ROLE_INDICATEUR',
                  translate: '',
                  dataLink: '',
                  parent: 'Paramètre',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_MONNAIE'),
                  title: 'Monnaie',
                  icon: '',
                  page: '/app/standard/parametre/monnaie',
                  role: 'ROLE_MONNAIE',
                  translate: '',
                  dataLink: '',
                  parent: 'Paramètre',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_PAYS'),
                  title: 'Pays',
                  icon: '',
                  page: '/app/standard/parametre/pays',
                  role: 'ROLE_PAYS',
                  translate: '',
                  dataLink: '',
                  parent: 'Paramètre',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_PAYS_GAFI'),
                  title: 'Pays GAFI',
                  icon: '',
                  page: '/lab/standard/parametre/pays',
                  role: 'ROLE_PAYS_GAFI',
                  translate: '',
                  dataLink: '',
                  parent: 'Paramètre',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_LANGUE'),
                  title: 'Langue',
                  icon: '',
                  page: '/app/standard/parametre/langue',
                  role: 'ROLE_LANGUE',
                  translate: '',
                  dataLink: '',
                  parent: 'Paramètre',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_PERIODICITE'),
                  title: 'Périodicité',
                  icon: '',
                  page: '/crm/standard/parametre/periodicite',
                  role: 'ROLE_PERIODICITE',
                  translate: '',
                  dataLink: '',
                  parent: 'Paramètre',
                  children: []
                },
                /*{
                  allow: this.authService.isGrantedRole('ROLE_PRODUIT'),
                  title: 'Produit',
                  icon: '',
                  page: '/app/standard/parametre/produit',
                  role: 'ROLE_PRODUIT',
                  translate: '',
                  dataLink: '',
                  parent: 'Paramètre',
                  children: []
                },*/
                {
                  allow: this.authService.isGrantedRole('ROLE_PROFESSION'),
                  title: 'Profession',
                  icon: '',
                  page: '/app/standard/parametre/profession',
                  role: 'ROLE_PROFESSION',
                  translate: '',
                  dataLink: '',
                  parent: 'Paramètre',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_QUALITE'),
                  title: 'Qualité',
                  icon: '',
                  page: '/app/standard/parametre/qualite',
                  role: 'ROLE_QUALITE',
                  translate: '',
                  dataLink: '',
                  parent: 'Paramètre',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_SECTEUR'),
                  title: 'Secteur',
                  icon: '',
                  page: '/app/standard/parametre/secteur',
                  role: 'ROLE_SECTEUR',
                  translate: '',
                  dataLink: '',
                  parent: 'Paramètre',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_TYPEDOCUMENT'),
                  title: 'Type document',
                  icon: '',
                  page: '/app/standard/parametre/typedocument',
                  role: 'ROLE_TYPEDOCUMENT',
                  translate: '',
                  dataLink: '',
                  parent: 'Paramètre',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_SOUSCATEGORIE'),
                  title: 'Sous catégorie',
                  icon: '',
                  page: '/app/standard/parametre/souscategorie',
                  role: 'ROLE_SOUSCATEGORIE',
                  translate: '',
                  dataLink: '',
                  parent: 'Paramètre',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_FORMEJURIDIQUE'),
                  title: 'Forme juridique',
                  icon: '',
                  page: '/app/standard/parametre/formejuridique',
                  role: 'ROLE_FORMEJURIDIQUE',
                  translate: '',
                  dataLink: '',
                  parent: 'Paramètre',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_SYSTEMEDINFORMATION'),
                  title: "Système d'information",
                  icon: '',
                  page: '/app/standard/parametre/systemedinformation',
                  role: 'ROLE_SYSTEMEDINFORMATION',
                  translate: '',
                  dataLink: '',
                  parent: 'Paramètre',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_TYPEMODELE'),
                  title: "Type modèle",
                  icon: '',
                  page: '/crm/standard/parametre/typemodele',
                  role: 'ROLE_TYPEMODELE',
                  translate: '',
                  dataLink: '',
                  parent: 'Paramètre',
                  children: []
                },
                {
                  allow: null,
                  title: 'Instruments financiers',
                  dataLink: '/app/standard/parametre/instumentfinancier',
                  icon: '',
                  page: '',
                  translate: '',
                  role: '',
                  parent: 'Paramètre',
                  children: [
                    {
                      allow: this.authService.isGrantedRole('ROLE_COMPARTIMENT'),
                      title: 'Compartiment',
                      page: '/app/standard/parametre/instrumentfinancier/compartiment',
                      role: 'ROLE_COMPARTIMENT',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Instruments financiers',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_NATUREEVENEMENT'),
                      title: 'Nature évènement',
                      page: '/app/standard/parametre/instrumentfinancier/natureevenement',
                      role: 'ROLE_NATUREEVENEMENT',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Instruments financiers',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_SECTEURBOURSIER'),
                      title: 'Secteur boursier',
                      page: '/app/standard/parametre/instrumentfinancier/secteurboursier',
                      role: 'ROLE_SECTEURBOURSIER',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Instruments financiers',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_SOUSTYPEACTION'),
                      title: 'Sous type action',
                      page: '/app/standard/parametre/instrumentfinancier/soustypeaction',
                      role: 'ROLE_SOUSTYPEACTION',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Instruments financiers',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_TYPEACTION'),
                      title: 'Type action',
                      page: '/app/standard/parametre/instrumentfinancier/typeaction',
                      role: 'ROLE_TYPEACTION',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Instruments financiers',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_TYPEEMETTEUR'),
                      title: 'Type emetteur',
                      page: '/app/standard/parametre/instrumentfinancier/typeemetteur',
                      role: 'ROLE_TYPEEMETTEUR',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Instruments financiers',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_TYPEEMISSION'),
                      title: 'Type emission',
                      page: '/app/standard/parametre/instrumentfinancier/typeemission',
                      role: 'ROLE_TYPEEMISSION',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Instruments financiers',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_TYPEEVENEMENT'),
                      title: 'Type évènement',
                      page: '/app/standard/parametre/instrumentfinancier/typeevenement',
                      role: 'ROLE_TYPEEVENEMENT',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Instruments financiers',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_TYPEGARANT'),
                      title: 'Type garant',
                      page: '/app/standard/parametre/instrumentfinancier/typegarant',
                      role: 'ROLE_TYPEGARANT',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Instruments financiers',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_TYPEOBLIGATION'),
                      title: 'Type obligation',
                      page: '/app/standard/parametre/instrumentfinancier/typeobligation',
                      role: 'ROLE_TYPEOBLIGATION',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Instruments financiers',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_PLACE'),
                      title: 'Place boursière',
                      page: '/app/standard/parametre/instrumentfinancier/place',
                      role: 'ROLE_PLACE',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Instruments financiers',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_BANQUE'),
                      title: 'Banque',
                      page: '/app/standard/parametre/instrumentfinancier/banque',
                      role: 'ROLE_BANQUE',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Instruments financiers',
                      children: []
                    },
                    {
                      allow: null,
                      title: 'Gestion des titres',
                      page: '',
                      role: '',
                      dataLink: '/titresciel/standard/parametre/instrumentfinancier',
                      icon: '',
                      translate: '',
                      parent: 'Instruments financiers',
                      children: [
                        {
                          allow: this.authService.isGrantedRole('ROLE_TITRES'),
                          title: 'Liste des titres',
                          page: '/titresciel/standard/parametre/instrumentfinancier/titres',
                          role: 'ROLE_TITRES',
                          dataLink: '',
                          icon: '',
                          translate: '',
                          parent: 'Gestion des titres',
                          children: []
                        },
                        {
                          allow: this.authService.isGrantedRole('ROLE_MAJ_TITRES'),
                          title: 'MAJ cours',
                          page: '/titresciel/standard/parametre/instrumentfinancier/titres/maj/cours',
                          role: 'ROLE_MAJ_TITRES',
                          dataLink: '',
                          icon: '',
                          translate: '',
                          parent: 'Gestion des titres',
                          children: []
                        }
                      ]
                    },
                  ]
                }
                ,
                {
                  allow: null,
                  title: 'Comptabilité',
                  dataLink: '/app/standard/parametre/comptabilite',
                  icon: '',
                  page: '',
                  translate: '',
                  role: '',
                  parent: 'Paramètre',
                  children: [
                    {
                      allow: this.authService.isGrantedRole('ROLE_TYPEOPERATION'),
                      title: 'Type opération',
                      page: '/app/standard/parametre/comptabilite/typeoperation',
                      role: 'ROLE_TYPEOPERATION',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Comptabilité',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_JOURNAL'),
                      title: 'Journal',
                      page: '/app/standard/parametre/comptabilite/journal',
                      role: 'ROLE_JOURNAL',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Comptabilité',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_NATUREOPERATION'),
                      title: 'Nature',
                      page: '/app/standard/parametre/comptabilite/natureoperation',
                      role: 'ROLE_NATUREOPERATION',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Comptabilité',
                      route: CoreRouting.find((value, index, obj) =>
                        ('/app/standard/parametre/comptabilite/natureoperation').includes(value.path!)),
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_FORMULE'),
                      title: 'Formule',
                      page: '/app/standard/parametre/comptabilite/formule',
                      role: 'ROLE_FORMULE',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Comptabilité',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_MODELEFORMULE'),
                      title: 'Modèle formule',
                      page: '/app/standard/parametre/comptabilite/modeleformule',
                      role: 'ROLE_MODELEFORMULE',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Comptabilité',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_MODELEECRITURE'),
                      title: 'Modèle écriture',
                      page: '/app/standard/parametre/comptabilite/modeleecriture',
                      role: 'ROLE_MODELEECRITURE',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Comptabilité',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_PLAN'),
                      title: 'Plan',
                      page: '/app/standard/parametre/comptabilite/plan',
                      role: 'ROLE_PLAN',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Comptabilité',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_COMPTECOMPTABLE'),
                      title: 'Compte comptable',
                      page: '/app/standard/parametre/comptabilite/comptecomptable',
                      role: 'ROLE_COMPTECOMPTABLE',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Comptabilité',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_POSTECOMPTABLE'),
                      title: 'Poste comptable',
                      page: '/app/standard/parametre/comptabilite/postecomptable',
                      role: 'ROLE_POSTECOMPTABLE',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Comptabilité',
                      children: []
                    },
                    {
                      allow: null,
                      title: 'Paramétrage système',
                      page: '',
                      role: '',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Comptabilité',
                      children: [
                        {
                          allow: this.authService.isGrantedRole('ROLE_IBRUBRIQUEPOSITION'),
                          title: 'IB-RUBRIQUE-POSITION',
                          page: '/app/standard/parametre/comptabilite/ibrubriqueposition',
                          role: 'ROLE_IBRUBRIQUEPOSITION',
                          dataLink: '',
                          icon: '',
                          translate: '',
                          parent: 'Paramétrage système',
                          children: []
                        },
                        {
                          allow: this.authService.isGrantedRole('ROLE_CORRESPONDANCE'),
                          title: 'Correspondance',
                          page: '/app/standard/parametre/comptabilite/correspondance',
                          role: 'ROLE_CORRESPONDANCE',
                          dataLink: '',
                          icon: '',
                          translate: '',
                          parent: 'Paramétrage système',
                          children: []
                        }
                      ]
                    }
                  ]
                }
                ,
                {
                  allow: null,
                  title: 'Nomenclature',
                  dataLink: '/app/standard/parametre/nomenclature',
                  icon: '',
                  page: '',
                  translate: '',
                  role: '',
                  parent: 'Paramètre',
                  children: [
                    {
                      allow: this.authService.isGrantedRole('ROLE_TYPECOMPTE'),
                      title: 'Type compte',
                      page: '/app/standard/parametre/nomenclature/typecompte',
                      role: 'ROLE_TYPECOMPTE',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Nomenclature',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_SOUSTYPECOMPTE'),
                      title: 'Sous type compte',
                      page: '/app/standard/parametre/nomenclature/soustypecompte',
                      role: 'ROLE_SOUSTYPECOMPTE',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Nomenclature',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_TYPECLIENT'),
                      title: 'Type client',
                      page: '/app/standard/parametre/nomenclature/typeclient',
                      role: 'ROLE_TYPECLIENT',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Nomenclature',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_SOUSTYPECLIENT'),
                      title: 'Sous type client',
                      page: '/app/standard/parametre/nomenclature/soustypeclient',
                      role: 'ROLE_SOUSTYPECLIENT',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Nomenclature',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_CATEGORIECLIENT'),
                      title: 'Catégorie client',
                      page: '/app/standard/parametre/nomenclature/categorieclient',
                      role: 'ROLE_CATEGORIECLIENT',
                      dataLink: '',
                      icon: '',
                      translate: '',
                      parent: 'Nomenclature',
                      children: []
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          allow: null,
          type: 'section',
          title: 'APPLICATION',
          icon: '',
          page: '',
          translate: '',
          role: '',
          dataLink: '',
          parent: null,
          children: [
            {
              allow: null,
              title: 'Notifications',
              icon: 'message-text-2',
              dataLink: '/crm/notifications',
              page: '',
              translate: '',
              role: '',
              parent: 'APPLICATION',
              children: [
                {
                  allow: this.authService.isGrantedRole('ROLE_MODELE_MSG_ALERTE'),
                  title: 'Modèle message alerte',
                  page: '/crm/notifications/modelemsgalerte',
                  role: 'ROLE_MODELE_MSG_ALERTE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Notifications',
                  route: CrmRouting.find((value, index, obj) =>
                    ('/crm/notifications/modelemsgalerte').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_ALERTE'),
                  title: 'Alertes',
                  page: '/crm/notifications/alertes',
                  role: 'ROLE_ALERTE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Notifications',
                  route: CrmRouting.find((value, index, obj) =>
                    ('/crm/notifications/alertes').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_ALERTE'),
                  title: 'Critère d\'alerte',
                  page: '/lab/notifications/alertes',
                  role: 'ROLE_ALERTE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Notifications',
                  route: LabRouting.find((value, index, obj) =>
                    ('/lab/notifications/alertes').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_MAIL'),
                  title: 'Mail',
                  page: '/crm/notifications/mail',
                  role: 'ROLE_MAIL',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Notifications',
                  route: CrmRouting.find((value, index, obj) =>
                    ('/crm/notifications/mail').includes(value.path!)),
                  children: []
                }
              ]
            },
            {
              allow: null,
              title: 'Rendez-vous',
              icon: 'element-7',
              dataLink: '/crm/rendezvous',
              page: '',
              translate: '',
              role: '',
              parent: 'APPLICATION',
              children: [
                {
                  allow: this.authService.isGrantedRole('ROLE_PLANIFICATION_RDV'),
                  title: 'Plannifier un RDV',
                  page: '/crm/rendezvous/rdv',
                  role: 'ROLE_PLANIFICATION_RDV',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Rendez-vous',
                  route: CrmRouting.find((value, index, obj) =>
                    ('/crm/rendezvous/rdv').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_COMPTE_RENDU'),
                  title: 'Compte Rendu',
                  page: '/crm/rendezvous/compterendu',
                  role: 'ROLE_COMPTE_RENDU',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Rendez-vous',
                  route: CrmRouting.find((value, index, obj) =>
                    ('/crm/rendezvous/compterendu').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_AUTORISATION_CR'),
                  title: 'Autorisation CR',
                  page: '/crm/rendezvous/autorisationcr',
                  role: 'ROLE_AUTORISATION_CR',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Rendez-vous',
                  route: CrmRouting.find((value, index, obj) =>
                    ('/crm/rendezvous/autorisationcr').includes(value.path!)),
                  children: []
                }
              ]
            },
            {
              allow: null,
              title: 'Objectifs',
              icon: 'calendar',
              dataLink: '/crm/objectifs',
              page: '',
              translate: '',
              role: '',
              parent: 'APPLICATION',
              children: [
                {
                  allow: this.authService.isGrantedRole('ROLE_OBJECTIF_A_AFFECTER'),
                  title: 'Définition des objectifs',
                  page: '/crm/objectifs/objectifaffecter',
                  role: 'ROLE_OBJECTIF_A_AFFECTER',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Objectifs',
                  route: CrmRouting.find((value, index, obj) =>
                    ('/crm/objectifs/objectifaffecter').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_AFFECTATION_OBJECTIF'),
                  title: 'Affectation des objectifs',
                  page: '/crm/objectifs/affectation',
                  role: 'ROLE_AFFECTATION_OBJECTIF',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Objectifs',
                  route: CrmRouting.find((value, index, obj) =>
                    ('/crm/objectifs/affectation').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_OBJECTIF_ATTEINT'),
                  title: 'Mes objectifs atteints',
                  page: '/crm/objectifs/objectifatteint',
                  role: 'ROLE_OBJECTIF_ATTEINT',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Objectifs',
                  route: CrmRouting.find((value, index, obj) =>
                    ('/crm/objectifs/objectifatteint').includes(value.path!)),
                  children: []
                }
              ]
            },
            {
              allow: null,
              title: 'Gel/dégel',
              icon: 'calendar',
              page: '',
              role: '',
              translate: '',
              dataLink: '',
              parent: 'APPLICATION',
              children: [
                {
                  allow: this.authService.isGrantedRole('ROLE_GELDEGEL'),
                  title: 'Geler ou dégeler un avoir',
                  page: '/lab/geldegel',
                  role: 'ROLE_GELDEGEL',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Gel/dégel',
                  route: LabRouting.find((value, index, obj) =>
                    ('/lab/geldegel').includes(value.path!)),
                  children: []
                }
              ]
            },
            {
              allow: null,
              title: 'Risque',
              icon: '',
              page: '',
              role: '',
              translate: '',
              dataLink: '',
              parent: 'APPLICATION',
              children: [
                {
                  allow: this.authService.isGrantedRole('ROLE_NAVBENCHMARK'),
                  title: 'NavBenchMark',
                  page: '/risque/navbenchmark/liste',
                  role: 'ROLE_NAVBENCHMARK',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Risque',
                  route: RisqueRouting.find((value, index, obj) =>
                    ('/risque/navbenchmark/liste').includes(value.path!)),
                  children: []
                }
              ]
            }
          ]
        },
        {
          allow: null,
          type: 'section',
          title: 'REPORTINGS',
          icon: '',
          page: '',
          translate: '',
          role: '',
          dataLink: '',
          parent: null,
          children: [
            {
              allow: null,
              title: 'Etats & Statistiques',
              icon: 'printer',
              dataLink: '/crm/etats',
              page: '',
              translate: '',
              role: '',
              parent: 'REPORTINGS',
              children: [
                {
                  allow: this.authService.isGrantedRole('ROLE_RDV_PLAN'),
                  title: 'Liste des RDV planifiés',
                  page: '/crm/etats/rdv/liste',
                  role: 'ROLE_RDV_PLAN',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: CrmRouting.find((value, index, obj) =>
                    ('/crm/etats/rdv/liste').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_LISTE_CR'),
                  title: 'Liste des comptes rendus',
                  page: '/crm/etats/cr/liste',
                  role: 'ROLE_LISTE_CR',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: CrmRouting.find((value, index, obj) =>
                    ('/crm/etats/cr/liste').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_LISTE_PROSPECT'),
                  title: 'Liste des prospects',
                  page: '/crm/etats/prospect/liste',
                  role: 'ROLE_LISTE_PROSPECT',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: CrmRouting.find((value, index, obj) =>
                    ('/crm/etats/prospect/liste').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_FICHE_KYC'),
                  title: 'Edition de la fiche KYC',
                  page: '/crm/etats/client/fichekyc',
                  role: 'ROLE_FICHE_KYC',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: CrmRouting.find((value, index, obj) =>
                    ('/crm/etats/client/fichekyc').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_CLIENT_PAS_INVESTI'),
                  title: 'Clients n\'ayant pas investi sur une période donnée',
                  page: '/crm/etats/client/nayantpasinvesti',
                  role: 'ROLE_CLIENT_PAS_INVESTI',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: CrmRouting.find((value, index, obj) =>
                    ('/crm/etats/client/nayantpasinvesti').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_CLIENT_PORTEFEUILLE'),
                  title: 'Liste des clients en portefeuille',
                  page: '/crm/etats/client/liste',
                  role: 'ROLE_CLIENT_PORTEFEUILLE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: CrmRouting.find((value, index, obj) =>
                    ('/crm/etats/client/liste').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_POINT_SOUSCRIPTION'),
                  title: 'Point des souscriptions apportées sur une période donnée',
                  page: '/crm/etats/produitsouscrit/liste',
                  role: 'ROLE_POINT_SOUSCRIPTION',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: CrmRouting.find((value, index, obj) =>
                    ('/crm/etats/produitsouscrit/liste').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_POINT_OBJECTIF_AFFECTE'),
                  title: 'Point périodique des objectifs',
                  page: '/crm/etats/objectif/liste',
                  role: 'ROLE_POINT_OBJECTIF_AFFECTE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: CrmRouting.find((value, index, obj) =>
                    ('/crm/etats/objectif/liste').includes(value.path!)),
                  children: []
                },
                /*{
                  allow: null,
                  title: 'Print test',
                  page: '/crm/etats/test/print',
                  role: '',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  children: []
                },
                {
                  allow: null,
                  title: 'Print test 2',
                  page: '/crm/etats/test/print22',
                  role: '',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  children: []
                },*/
                {
                  allow: this.authService.isGrantedRole('ROLE_OPERATION_CLIENT_OCCASIONNEL'),
                  title: 'Recensement des opérations effectuées par un même client, qu\'il soit occasionnel ou habituel',
                  page: '/lab/etats/recensement/operation-client/liste',
                  role: 'ROLE_OPERATION_CLIENT_OCCASIONNEL',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: LabRouting.find((value, index, obj) =>
                    ('/lab/etats/recensement/operation-client/liste').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_TRANSACTION_SUSPECTE_INHABITUELLE'),
                  title: 'Identification des transactions à caractère suspect ou inhabituel ',
                  page: '/lab/etats/identification/operation-suspecte/inhabituelle/liste',
                  role: 'ROLE_TRANSACTION_SUSPECTE_INHABITUELLE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: LabRouting.find((value, index, obj) =>
                    ('/lab/etats/identification/operation-suspecte/inhabituelle/liste').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_SUIVI_CLIENT_SANCTION'),
                  title: 'Suivi d’un client inscrit sur une ' +
                    'liste de sanctions financières ciblé du conseil de sécurité des états unies',
                  page: '/lab/etats/sanction/suivi-client/liste',
                  role: 'ROLE_SUIVI_CLIENT_SANCTION',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: LabRouting.find((value, index, obj) =>
                    ('/lab/etats/sanction/suivi-client/liste').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_REGISTRE_CONFIDENTIEL'),
                  title: 'Régistre confidentiel',
                  page: '/lab/etats/registre/confidentiel',
                  role: 'ROLE_REGISTRE_CONFIDENTIEL',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: LabRouting.find((value, index, obj) =>
                    ('/lab/etats/registre/confidentiel').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_DEPOT_SUPERIEUR_A_CINQ_MILLIONS'),
                  title: 'Opérations effectuées par des personnes physiques et supérieure à 5 millions',
                  page: '/lab/etats/depot-superieur-a-cinq-millions/liste',
                  role: 'ROLE_DEPOT_SUPERIEUR_A_CINQ_MILLIONS',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: LabRouting.find((value, index, obj) =>
                    ('/lab/etats/depot-superieur-a-cinq-millions/liste').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_DEPOT_RECENSE_ESPECE'),
                  title: 'Détermination du solde global de l\'ensemble des comptes détenus par un même client',
                  page: '/lab/etats/depot-espece-sur-annee/liste',
                  role: 'ROLE_DEPOT_RECENSE_ESPECE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: LabRouting.find((value, index, obj) =>
                    ('/lab/etats/depot-espece-sur-annee/liste').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_DEPOT_RECENSE_ANNEE'),
                  title: 'Point des transactions personnes physiques supérieures ou égales à 10 000 000 sur l\'année',
                  page: '/lab/etats/depot-sur-annee-superieur-ou-egal-a-dix-millions/liste',
                  role: 'ROLE_DEPOT_RECENSE_ESPECE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: LabRouting.find((value, index, obj) =>
                    ('/lab/etats/depot-sur-annee-superieur-ou-egal-a-dix-millions/liste').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_OPERATION_NOUVELLE_RELATION'),
                  title: 'Point des transactions personnes physiques supérieures ou égales à 10 000 000 constituants des nouvelles relations d\'affaires sur l\'année',
                  page: '/lab/etats/operation-constituant-de-nouvelle-relation-superieur-ou-egal-a-dix-millions/liste',
                  role: 'ROLE_OPERATION_NOUVELLE_RELATION',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: LabRouting.find((value, index, obj) =>
                    ('/lab/etats/operation-constituant-de-nouvelle-relation-superieur-ou-egal-a-dix-millions/liste').includes(value.path!)),
                  children: []
                },
                // {
                //   allow: this.authService.isGrantedRole('ROLE_RDV_PLAN'),
                //   title: 'Liste des secteurs',
                //   page: '/app/reportings/print-secteur/liste',
                //   role: 'ROLE_RDV_PLAN',
                //   icon: '',
                //   translate: '',
                //   dataLink: '',
                //   parent: 'Etats & Statistiques',
                //   children: []
                // },
                {
                  allow: this.authService.isGrantedRole('ROLE_OPERATION_CONDITION_INHABITUELLE'),
                  title: 'Point des transactions personnes physiques supérieures \n' +
                    '            ou égales à 10 000 000 effectuées dans les conditions inhabituelles sur l\'année',
                  page: '/lab/etats/operation-effectuee-condition-inhabituelle-superieur-ou-egal-a-dix-millions/liste',
                  role: 'ROLE_OPERATION_CONDITION_INHABITUELLE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: LabRouting.find((value, index, obj) =>
                    ('/lab/etats/operation-effectuee-condition-inhabituelle-superieur-ou-egal-a-dix-millions/liste').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_OPERATION_CONDITION_NORMALE'),
                  title: 'Point des transactions personnes physiques supérieures ou égales à' +
                    ' 50 000 000 effectuées dans les conditions normales sur l\'année',
                  page: '/lab/etats/operation-effectuee-condition-normale-superieur-ou-egal-a-cinquante-millions/liste',
                  role: 'ROLE_OPERATION_CONDITION_NORMALE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: LabRouting.find((value, index, obj) =>
                    ('/lab/etats/operation-effectuee-condition-normale-superieur-ou-egal-a-cinquante-millions/liste').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_ETAT_VOLATILITE'),
                  title: 'Volatilité FCP',
                  page: '/risque/etats/volatilite/fcp',
                  role: 'ROLE_ETAT_VOLATILITE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: RisqueRouting.find((value, index, obj) =>
                    ('/risque/etats/volatilite/fcp').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_ETAT_ALPHA'),
                  title: 'Alpha',
                  page: '/risque/etats/alpha/liste',
                  role: 'ROLE_ETAT_ALPHA',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: RisqueRouting.find((value, index, obj) =>
                    ('/risque/etats/alpha/liste').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_ETAT_RATIO_SHARP'),
                  title: 'Ratio de sharp',
                  page: '/risque/etats/ratiosharp/liste',
                  role: 'ROLE_ETAT_RATIO_SHARP',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: RisqueRouting.find((value, index, obj) =>
                    ('/risque/etats/ratiosharp/liste').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_ETAT_CORRELATION'),
                  title: 'Corrélation',
                  page: '/risque/etats/correlation/liste',
                  role: 'ROLE_ETAT_CORRELATION',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: RisqueRouting.find((value, index, obj) =>
                    ('/risque/etats/correlation/liste').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_ETAT_COVARIANCE'),
                  title: 'Covariance',
                  page: '/risque/etats/covariance/liste',
                  role: 'ROLE_ETAT_COVARIANCE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: RisqueRouting.find((value, index, obj) =>
                    ('/risque/etats/covariance/liste').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_ETAT_BETA'),
                  title: 'Bêta',
                  page: '/risque/etats/beta/liste',
                  role: 'ROLE_ETAT_BETA',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: RisqueRouting.find((value, index, obj) =>
                    ('/risque/etats/beta/liste').includes(value.path!)),
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_ETAT_RATIOTREYNOR'),
                  title: 'Ratio de Treynor',
                  page: '/risque/etats/ratiotreynor/liste',
                  role: 'ROLE_ETAT_RATIOTREYNOR',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: RisqueRouting.find((value, index, obj) =>
                    ('/risque/etats/ratiotreynor/liste').includes(value.path!)),
                  children: []
                }
                /*{
                  allow: this.authService.isGrantedRole('ROLE_ETAT_OPCVM'),
                  title: 'Liste des OPCVM disponibles',
                  page: '/oif/etats/opcvm/liste',
                  role: 'ROLE_ETAT_OPCVM',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  route: RisqueRouting.find((value, index, obj) =>
                    ('/risque/etats/alpha/liste').includes(value.path!)),
                  children: []
                },*/
              ]
            },
          ]
        }
      ]
    };
    //Ici les menus de l'opcvm
    this.opcvmMenus = {
      items: [
        {
          allow: this.authService.isGrantedRole('ROLE_OPCVM_DASHBOARD'),
          title: 'Tableau de bord OPCVM',
          icon: 'element-11',
          page: '/opcvm/dashboard',
          translate: '',
          role: 'ROLE_OPCVM_DASHBOARD',
          dataLink: '',
          parent: null,
          children: []
        },
        {
          allow: null,
          type: 'section',
          title: 'STANDARD',
          icon: '',
          translate: '',
          role: '',
          dataLink: '',
          parent: null,
          children: [
            {
              allow: null,
              title: 'Définition',
              icon: 'element-plus',
              translate: '',
              role: '',
              dataLink: '',
              page: '',
              parent: 'STANDARD',
              children: [
                {
                  allow: this.authService.isGrantedRole('ROLE_ACTIONNAIRE_OPCVM'),
                  title: 'Actionnaires',
                  icon: '',
                  page: '/opcvm/standard/actionnaireopcvm',
                  role: 'ROLE_ACTIONNAIRE_OPCVM',
                  translate: '',
                  dataLink: '',
                  parent: 'Définition',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_TARIFICATION_ACTIONNAIRE'),
                  title: 'Condition de tarification appliquée aux actionnaires',
                  icon: '',
                  page: '/opcvm/standard/tarificationactionnaire',
                  role: 'ROLE_TARIFICATION_ACTIONNAIRE',
                  translate: '',
                  dataLink: '',
                  parent: 'Définition',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_TARIFICATION_OPC'),
                  title: 'Condition de tarification appliquée à l\'OPC',
                  icon: '',
                  page: '#',
                  role: 'ROLE_TARIFICATION_OPC',
                  translate: '',
                  dataLink: '',
                  parent: 'Définition',
                  children: [
                    {
                      allow: this.authService.isGrantedRole('ROLE_TARIFICATION_OPC'),
                      title: 'Conditions de tarification OPC(SGI)',
                      icon: '',
                      page: '/opcvm/standard/tarification/sgi',
                      role: 'ROLE_TARIFICATION_OPC',
                      translate: '',
                      dataLink: '',
                      parent: 'Condition de tarification appliquée à l\'OPC',
                      children: []
                    } ,
                    {
                      allow: this.authService.isGrantedRole('ROLE_TARIFICATION_OPC'),
                      title: 'Conditions de tarification OPC(Dépositaire)',
                      icon: '',
                      page: '/opcvm/standard/tarification/depositaire',
                      role: 'ROLE_TARIFICATION_OPC',
                      translate: '',
                      dataLink: '',
                      parent: 'Condition de tarification appliquée à l\'OPC',
                      children: []
                    } ,
                    {
                      allow: this.authService.isGrantedRole('ROLE_TARIFICATION_OPC'),
                      title: 'Conditions de tarification OPC(Place)',
                      icon: '',
                      page: '/opcvm/standard/tarification/place',
                      role: 'ROLE_TARIFICATION_OPC',
                      translate: '',
                      dataLink: '',
                      parent: 'Condition de tarification appliquée à l\'OPC',
                      children: []
                    }
                  ]
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_PROFIL_OPC'),
                  title: 'Profil commission de l\'OPC',
                  icon: '',
                  page: '/opcvm/standard/profilopc',
                  role: 'ROLE_PROFIL_OPC',
                  translate: '',
                  dataLink: '',
                  parent: 'Définition',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_CHARGE_A_ETALER'),
                  title: 'Charges à étaler',
                  icon: '',
                  page: '/opcvm/standard/chargeaetaler',
                  role: 'ROLE_CHARGE_A_ETALER',
                  translate: '',
                  dataLink: '',
                  parent: 'Définition',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_COMPTE_BANQUE_OPCVM'),
                  title: 'Comptes bancaires de l\'OPC',
                  icon: '',
                  page: '#',
                  role: 'ROLE_COMPTE_BANQUE_OPCVM',
                  translate: '',
                  dataLink: '',
                  parent: 'Paramètre',
                  children: []
                }
              ]
            }
          ]
        },
        {
          allow: null,
          type: 'section',
          title: 'APPLICATION',
          icon: '',
          page: '',
          translate: '',
          role: '',
          dataLink: '',
          parent: null,
          children: [
            {
              allow: null,
              title: 'Constitution du Capital',
              icon: 'message-text-2',
              dataLink: '',
              page: '',
              translate: '',
              role: '',
              parent: 'APPLICATION',
              children: [
                {
                  allow: this.authService.isGrantedRole('ROLE_CONSTITUTION_CAPITAL'),
                  title: 'Constitution de capital',
                  page: '#',
                  role: 'ROLE_CONSTITUTION_CAPITAL',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Constitution du Capital',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VERIF_NIV1_CC'),
                  title: 'Vérification Niveau 1 (CC)',
                  page: '#',
                  role: 'ROLE_VERIF_NIV1_CC',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Constitution du Capital',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VERIF_NIV2_CC'),
                  title: 'Vérification Niveau 2 (CC)',
                  page: '#',
                  role: 'ROLE_VERIF_NIV2_CC',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Constitution du Capital',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VALO_POSTE_COMPTABLE'),
                  title: 'Valorisation des postes comptables',
                  page: '#',
                  role: 'ROLE_VALO_POSTE_COMPTABLE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Constitution du Capital',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VERIF_NIV1_PC'),
                  title: 'Vérification Niveau 1 (PC)',
                  page: '#',
                  role: 'ROLE_VERIF_NIV1_PC',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Constitution du Capital',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VERIF_NIV2_PC'),
                  title: 'Vérification Niveau 2 (PC)',
                  page: '#',
                  role: 'ROLE_VERIF_NIV2_PC',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Constitution du Capital',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_CLOTURE_SEANCE0'),
                  title: 'Clôture de la séance 0',
                  page: '#',
                  role: 'ROLE_CLOTURE_SEANCE0',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Constitution du Capital',
                  children: []
                }
              ]
            },
            {
              allow: null,
              title: 'Souscription',
              icon: 'element-7',
              dataLink: '',
              page: '',
              translate: '',
              role: '',
              parent: 'APPLICATION',
              children: [
                {
                  allow: this.authService.isGrantedRole('ROLE_IMPORT_DEPOT_SOUS'),
                  title: 'Importation des dépôts pour souscription',
                  page: '/opcvm/souscription/importationdepot',
                  role: 'ROLE_IMPORT_DEPOT_SOUS',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Souscription',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_DEPOT_SOUS'),
                  title: 'Dépot pour Souscription',
                  page: '/opcvm/souscription/depotsouscription',
                  role: 'ROLE_DEPOT_SOUS',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Souscription',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VERIF_NIV1_DEPOT_SOUS'),
                  title: 'Vérification des dépôts Niveau 1',
                  page: '/opcvm/souscription/depotsouscription/verification/niveau1/liste/depot',
                  role: 'ROLE_VERIF_NIV1_DEPOT_SOUS',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Souscription',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VERIF_NIV2_DEPOT_SOUS'),
                  title: 'Vérification des dépôts Niveau 2',
                  page: '/opcvm/souscription/depotsouscription/verification/niveau2/liste/depot',
                  role: 'ROLE_VERIF_NIV2_DEPOT_SOUS',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Souscription',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_GENERATION_SOUS'),
                  title: 'Génération des souscriptions',
                  page: '/opcvm/souscription/depotsouscription/generate/part/actionnaire',
                  role: 'ROLE_GENERATION_SOUS',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Souscription',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_RESTITUTION_RELIQUAT'),
                  title: 'Restitution de reliquat',
                  page: '/opcvm/souscription/depotsouscription/restitution/reliquat/souscription/actionnaire',
                  role: 'ROLE_RESTITUTION_RELIQUAT',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Souscription',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_AVIS_SOUS'),
                  title: 'Avis de souscription',
                  page: '/opcvm/souscription/depotsouscription/avis/souscription/actionnaire',
                  role: 'ROLE_AVIS_SOUS',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Souscription',
                  children: []
                }
              ]
            },
            {
              allow: null,
              title: 'Rachat',
              icon: 'element-7',
              dataLink: '',
              page: '',
              translate: '',
              role: '',
              parent: 'APPLICATION',
              children: [
                {
                  allow: this.authService.isGrantedRole('ROLE_INTENTION_RACHAT'),
                  title: 'Intention de rachat',
                  page: '/opcvm/rachat/intentionrachat',
                  role: 'ROLE_INTENTION_RACHAT',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Rachat',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_RACH_VERIF_N1'),
                  title: 'Vérification Intention Niveau 1',
                  page: '/opcvm/rachat/verificationintentionniveau1',
                  role: 'ROLE_RACH_VERIF_N1',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Rachat',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_RACH_VERIF_N2'),
                  title: 'Vérification Intention Niveau 2',
                  page: '/opcvm/rachat/verificationintentionniveau2',
                  role: 'ROLE_RACH_VERIF_N2',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Rachat',
                  children: []
                }
                ,
                {
                  allow: this.authService.isGrantedRole('ROLE_GENERATION_RACHAT'),
                  title: 'Génération des rachats',
                  page: '/opcvm/rachat/generationrachat',
                  role: 'ROLE_GENERATION_RACHAT',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Rachat',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_PAIEMENT_RACHAT'),
                  title: 'Paiement des rachats',
                  page: '/opcvm/rachat/paiementrachat',
                  role: 'ROLE_PAIEMENT_RACHAT',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Rachat',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_AVIS_RACHAT'),
                  title: 'Avis de rachat',
                  page: '/opcvm/rachat/avisrachat',
                  role: 'ROLE_AVIS_RACHAT',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Rachat',
                  children: []
                }
              ]
            },
            {
              allow: null,
              title: 'Souscription par transfert de titre',
              icon: 'element-7',
              dataLink: '',
              page: '',
              translate: '',
              role: '',
              parent: 'APPLICATION',
              children: [
                {
                  allow: this.authService.isGrantedRole('ROLE_IMPORT_DEPOT_SOUS'),
                  title: 'Souscription par transfert de titre',
                  page: '#',
                  role: 'ROLE_IMPORT_DEPOT_SOUS',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Souscription par transfert de titre',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_DEPOT_SOUS'),
                  title: 'Vérification Niveau 1',
                  page: '#',
                  role: 'ROLE_DEPOT_SOUS',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Souscription par transfert de titre',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_DEPOT_SOUS'),
                  title: 'Vérification Niveau 2',
                  page: '#',
                  role: 'ROLE_DEPOT_SOUS',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Souscription par transfert de titre',
                  children: []
                },
              ]
            },
            {
              allow: null,
              title: 'Comptabilité',
              icon: 'element-7',
              dataLink: '',
              page: '',
              translate: '',
              role: '',
              parent: 'APPLICATION',
              children: [
                {
                  allow: true,
                  title: 'Vérification des écritures comptables',
                  page: '',
                  role: '',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Comptabilité',
                  children: [
                    {
                      allow: this.authService.isGrantedRole('ROLE_VERIF_ECRITURE_N1'),
                      title: 'Niveau 1',
                      page: '/opcvm/comptabilite/verification/niveau1',
                      role: 'ROLE_VERIF_ECRITURE_N1',
                      icon: '',
                      translate: '',
                      dataLink: '',
                      parent: 'Vérification des écritures comptables',
                      children: []
                    },
                    {
                      allow: this.authService.isGrantedRole('ROLE_VERIF_ECRITURE_N2'),
                      title: 'Niveau 2',
                      page: '/opcvm/comptabilite/verification/niveau2',
                      role: 'ROLE_VERIF_ECRITURE_N2',
                      icon: '',
                      translate: '',
                      dataLink: '',
                      parent: 'Vérification des écritures comptables',
                      children: []
                    }
                  ]
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_CONSULT_ECR'),
                  title: 'Consultation des écritures comptables',
                  page: '/opcvm/comptabilite/consultation/ecritures',
                  role: 'ROLE_CONSULT_ECR',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Comptabilité',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_CONS_CHARGE'),
                  title: 'Constatation des charges',
                  page: '/opcvm/comptabilite/constatation/charges/liste',
                  role: 'ROLE_CONS_CHARGE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Comptabilité',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_PAIE_CHARGE'),
                  title: 'Paiement des charges',
                  page: '/opcvm/comptabilite/paiement/charges/liste',
                  role: 'ROLE_PAIE_CHARGE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Comptabilité',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_REGUL_ECART_SOLDE'),
                  title: 'Régularisation d\'écart sur solde',
                  page: '/opcvm/comptabilite/regulecartsolde/liste',
                  role: 'ROLE_REGUL_ECART_SOLDE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Comptabilité',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_PAIEMENT_COMMISSION'),
                  title: 'Paiement des commissions et taxes',
                  page: '/opcvm/comptabilite/paiement/commission/liste',
                  role: 'ROLE_PAIEMENT_COMMISSION',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Comptabilité',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_TRANS_PARTS'),
                  title: 'Transfert de parts',
                  // page: '/opcvm/comptabilite/transfert/parts',
                  page: '/opcvm/comptabilite/transfert/parts/liste',
                  role: 'ROLE_TRANS_PARTS',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Comptabilité',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_RETRO_COM_INVEST'),
                  title: 'Rétrocession de commission sur investissement',
                  // page: '/opcvm/comptabilite/transfert/parts',
                  page: '/opcvm/comptabilite/retrocessioncommissioninvestissement/liste',
                  role: 'ROLE_RETRO_COM_INVEST',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Comptabilité',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_ECRITURE_MANUEL'),
                  title: 'Saisie des écritures manuelles',
                  // page: '/opcvm/comptabilite/transfert/parts',
                  page: '/opcvm/comptabilite/ecritures/manuelle',
                  role: 'ROLE_ECRITURE_MANUEL',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Comptabilité',
                  children: []
                }
              ]
            }
            ,
            {
              allow: null,
              title: 'Opération sur capital',
              icon: 'element-7',
              dataLink: '',
              page: '',
              translate: '',
              role: '',
              parent: 'APPLICATION',
              children: [
                {
                  allow: this.authService.isGrantedRole('ROLE_AUGMENTATION_CAPITAL'),
                  title: 'Augmentation de capital',
                  page: '/opcvm/comptabilite/operationdetachementdroit/liste',
                  role: 'ROLE_AUGMENTATION_CAPITAL',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Opération sur capital',
                  children: []
                }
                ]
            },
            {
              allow: null,
              title: 'Extournes des VDE',
              icon: 'element-7',
              dataLink: '',
              page: '',
              translate: '',
              role: '',
              parent: 'APPLICATION',
              children: [
                {
                  allow: this.authService.isGrantedRole('ROLE_EXTOURNE_VDE'),
                  title: 'Génération des extournes des VDE',
                  page: '/opcvm/vde/generationextourne/liste',
                  role: 'ROLE_EXTOURNE_VDE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Extournes des VDE',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VERIF1_VDE'),
                  title: 'Vérification des extournes des VDE Niveau 1',
                  page: '/opcvm/vde/generationextourne/liste/verification/niveau1',
                  role: 'ROLE_VERIF1_VDE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Extournes des VDE',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VERIF2_VDE'),
                  title: 'Vérification des extournes des VDE Niveau 2',
                  page: '/opcvm/vde/generationextourne/liste/verification/niveau2',
                  role: 'ROLE_VERIF2_VDE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Extournes des VDE',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VERIF1_EXTOURNE_VDE'),
                  title: 'Vérification des écritures d\'extourne des VDE Niveau 1',
                  page: '/opcvm/vde/generationextourne/liste/verificationextourne/niveau1',
                  role: 'ROLE_VERIF1_EXTOURNE_VDE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Extournes des VDE',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VERIF2_EXTOURNE_VDE'),
                  title: 'Vérification des écritures d\'extourne des VDE Niveau 2',
                  page: '/opcvm/vde/generationextourne/liste/verificationextourne/niveau2',
                  role: 'ROLE_VERIF2_EXTOURNE_VDE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Extournes des VDE',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_SOLDE_COMPTE_EXTOURNE'),
                  title: 'Solde des comptes VDE et revenus',
                  page: '/opcvm/vde/generationextourne/liste/soldecompteextourne',
                  role: 'ROLE_SOLDE_COMPTE_EXTOURNE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Extournes des VDE',
                  children: []
                }
                ]
            },
            {
              allow: null,
              title: 'Ordre de bourse',
              icon: 'element-7',
              dataLink: '',
              page: '',
              translate: '',
              role: '',
              parent: 'APPLICATION',
              children: [
                {
                  allow: this.authService.isGrantedRole('ROLE_ORDRE_BOURSE'),
                  title: 'Ordre',
                  page: '/opcvm/ordre/liste',
                  role: 'ROLE_ORDRE_BOURSE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Ordre de bourse',
                  children: []
                },
                {
                  allow:this.authService.isGrantedRole('ROLE_VALIDATION_ORDRE'),
                  title: 'Validation des ordres de bourse',
                  page: '/opcvm/ordre/liste/validation',
                  role: 'ROLE_VALIDATION_ORDRE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Ordre de bourse',
                  children: []
                },
                {
                  allow:this.authService.isGrantedRole('ROLE_IMPRESSION_ORDRE'),
                  title: 'Impression des ordres de bourse',
                  page: '/opcvm/ordre/liste/impression',
                  role: 'ROLE_IMPRESSION_ORDRE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Ordre de bourse',
                  children: []
                },
                {
                  allow:this.authService.isGrantedRole('ROLE_AVIS_ORDRE'),
                  title: 'Avis d\'exécution d\'ordre',
                  page: '/opcvm/ordre/liste/avisoperationbourse',
                  role: 'ROLE_AVIS_ORDRE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Ordre de bourse',
                  children: []
                },
                {
                  allow:true,
                  title: 'Règlement/Livraison',
                  page: '',
                  role: '',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Ordre de bourse',
                  children: [
                    {
                      allow:this.authService.isGrantedRole('ROLE_REGLEMENT_LIVRAISON'),
                      title: 'Règlement / Livraison en attente',
                      page: '/opcvm/ordre/liste/reglementlivraison',
                      role: 'ROLE_REGLEMENT_LIVRAISON',
                      icon: '',
                      translate: '',
                      dataLink: '',
                      parent: 'Règlement/Livraison',
                      children: []
                    },
                    {
                      allow:this.authService.isGrantedRole('ROLE_GENERATION_REGLEMENT_LIVRAISON'),
                      title: 'Génération Règlement/Livraison',
                      page: '/opcvm/ordre/liste/reglementlivraison/generation',
                      role: 'ROLE_GENERATION_REGLEMENT_LIVRAISON',
                      icon: '',
                      translate: '',
                      dataLink: '',
                      parent: 'Règlement/Livraison',
                      children: []
                    }
                  ]
                }
              ]
            },
            {
              allow: null,
              title: 'Evenement sur valeur',
              icon: 'element-7',
              dataLink: '',
              page: '',
              translate: '',
              role: '',
              parent: 'APPLICATION',
              children: [
                {
                  allow: this.authService.isGrantedRole('ROLE_EVT_DETACHEMENT'),
                  title: 'Détachement',
                  page: '/opcvm/evenementsurvaleur/operationdetachement/liste',
                  role: 'ROLE_EVT_DETACHEMENT',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Evenement sur valeur',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_EVT_AVIS'),
                  title: 'Avis evenement sur valeur',
                  page: '/opcvm/avisevenementsurvaleur/liste',
                  role: 'ROLE_EVT_AVIS',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Evenement sur valeur',
                  children: []
                }
              ]
            },
            {
              allow: null,
              title: 'Cloture de seance',
              icon: 'element-7',
              dataLink: '',
              page: '',
              translate: '',
              role: '',
              parent: 'APPLICATION',
              children: [
                {
                  allow: this.authService.isGrantedRole('ROLE_GENERATION_DIFF_ESTIMATION'),
                  title: 'Génération différences d\'estimation',
                  page: '/opcvm/cloture/generationdifferenceestimation',
                  role: 'ROLE_GENERATION_DIFF_ESTIMATION',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Cloture de seance',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VERIFICATION_NIVEAU1_DE'),
                  title: 'Vérification Niveau 1 (DE)',
                  page: '/opcvm/cloture/verificationniveu1de',
                  role: 'ROLE_VERIFICATION_NIVEAU1_DE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Cloture de seance',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VERIFICATION_NIVEAU2_DE'),
                  title: 'Vérification Niveau 2 (DE)',
                  page: '/opcvm/cloture/verificationniveu2de',
                  role: 'ROLE_VERIFICATION_NIVEAU2_DE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Cloture de seance',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VERIF_ECRITURE_NIVEAU1_DE'),
                  title: 'Vérification niveau 1 jeux d\'écritures (DE)',
                  page: '/opcvm/cloture/verificationecritureniveu1de',
                  role: 'ROLE_VERIF_ECRITURE_NIVEAU1_DE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Cloture de seance',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VERIF_ECRITURE_NIVEAU2_DE'),
                  title: 'Vérification niveau 1 jeux d\'écritures (DE)',
                  page: '/opcvm/cloture/verificationecritureniveu2de',
                  role: 'ROLE_VERIF_ECRITURE_NIVEAU2_DE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Cloture de seance',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_AMORTISSEMENT_CHARGE'),
                  title: 'Amortissement des charges',
                  page: '/opcvm/cloture/amortissementcharge',
                  role: 'ROLE_AMORTISSEMENT_CHARGE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Cloture de seance',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VERIF_CHARGE1'),
                  title: 'Vérification Niveau 1 (CHARGES)',
                  page: '/opcvm/cloture/verificationchargeniveau1',
                  role: 'ROLE_VERIF_CHARGE1',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Cloture de seance',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VERIF_CHARGE2'),
                  title: 'Vérification Niveau 2 (CHARGES)',
                  page: '/opcvm/cloture/verificationchargeniveau2',
                  role: 'ROLE_VERIF_CHARGE2',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Cloture de seance',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VERIF_ECRITURE_CHARGE1'),
                  title: 'Vérification niveau 1 jeux d\'écritures (CHARGES)',
                  page: '/opcvm/cloture/verificationecriturechargeniveau1',
                  role: 'ROLE_VERIF_ECRITURE_CHARGE1',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Cloture de seance',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VERIF_ECRITURE_CHARGE2'),
                  title: 'Vérification niveau 2 jeux d\'écritures (CHARGES)',
                  page: '/opcvm/cloture/verificationecriturechargeniveau2',
                  role: 'ROLE_VERIF_ECRITURE_CHARGE2',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Cloture de seance',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VALORISATION_CODE_POSTE'),
                  title: 'Valorisation des postes comptables',
                  page: '/opcvm/cloture/valorisationcodeposte',
                  role: 'ROLE_VALORISATION_CODE_POSTE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Cloture de seance',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VERIF_PC_N1'),
                  title: 'Vérification Niveau 1 (PC)',
                  page: '/opcvm/cloture/verificationvalorisationcodeposteniveau1',
                  role: 'ROLE_VERIF_PC_N1',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Cloture de seance',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_VERIF_PC_N2'),
                  title: 'Vérification Niveau 2 (PC)',
                  page: '/opcvm/cloture/verificationvalorisationcodeposteniveau2',
                  role: 'ROLE_VERIF_PC_N2',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Cloture de seance',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_CLOTURE_SEANCE'),
                  title: 'Clôture séance',
                  page: '/opcvm/cloture/seancevl',
                  role: 'ROLE_CLOTURE_SEANCE',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Cloture de seance',
                  children: []
                }
              ]
            },
          ]
        },
        {
          allow: null,
          type: 'section',
          title: 'REPORTINGS',
          icon: '',
          page: '',
          translate: '',
          role: '',
          dataLink: '',
          parent: null,
          children: [
            {
              allow: null,
              title: 'Etats & Statistiques',
              icon: 'printer',
              dataLink: '',
              page: '',
              translate: '',
              role: '',
              parent: 'REPORTINGS',
              children: [
                {
                  allow: this.authService.isGrantedRole('ROLE_REG_ACT'),
                  title: 'Régistre actionnaire',
                  page: '/opcvm/etats/registre/actionnaire',
                  role: 'ROLE_REG_ACT',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  children: []
                },
                {
                  allow: this.authService.isGrantedRole('ROLE_LISTE_CR'),
                  title: 'Consultation portefeuille',
                  page: '#',
                  role: 'ROLE_CONSULT_PORTEFEUILLE_OPCVM',
                  icon: '',
                  translate: '',
                  dataLink: '',
                  parent: 'Etats & Statistiques',
                  children: []
                },
              ]
            },
          ]
        }
      ]
    }
    this.recupererTousLesMenus();
  }

  findAllDescendants(parentTitle: string, nodes: any[]): any[] {
    let allDescendants: any[] = [];

    function recursiveFind(title: string, nodes: any[]) {
      for (const node of nodes) {
        if (node != null && node.title === title) {
          addDescendants(node);
        } else if (node != null && node.children) {
          recursiveFind(title, node.children);
        }
      }
    }

    function addDescendants(node: any) {
      if (node.children) {
        for (const child of node.children) {
          if(child != null && child.allow) allDescendants.push(child);
          if (child != null && child.children) {
            addDescendants(child);
          }
        }
      }
    }

    recursiveFind(parentTitle, nodes);
    return allDescendants;
  }

  recupererLesMenus(menu: any, parent: any = null, isOpcvm = false) {
    if(menu.children && menu.children.length > 0) {
      if(isOpcvm)
        menu.allow = this.findAllDescendants(menu.title, this.opcvmMenus.items).length > 0;
      else
        menu.allow = this.findAllDescendants(menu.title, this.menus.items).length > 0;
      menu.children.forEach(m => {
        this.recupererLesMenus(m, menu, isOpcvm);
      });
    }
  }

  recupererTousLesMenus() {
    if(this.menus.hasOwnProperty('items')) {
      this.menus.items.forEach((item: any, index: number, array) => {
        this.recupererLesMenus(item);
      });
    }

    if(this.opcvmMenus.hasOwnProperty('items')) {
      this.opcvmMenus.items.forEach((item: any, index: number, array) => {
        this.recupererLesMenus(item, null, true);
      });
    }
  }

  toutesLesRoutes(router: Router, injector: Injector) {
    let routerUrls: any[] = [];
    const topLevelRoutes = router.config.slice(
      0,
      router.config.findIndex((route) => route.path === '**') ?? router.config.length - 1
    );
    for (const i of topLevelRoutes) {
      routerUrls = this.getPaths(router, injector, i, '', routerUrls);
    }
    return routerUrls;
  }

  getPaths(router: Router, injector: Injector, route: Route, parent: string = '', output: any[] = []) {
    if (route.redirectTo) {
      return output;
    }
    if (route.children) {
      route.children.forEach(i => {
        output = this.getPaths(router, injector, i, parent ? `${parent}/${route.path}` : route.path, output);
      });
    }
    else if (route.loadChildren) {
      // console.log("------------------------------------------------------------------");
      (<any>router)?.navigationTransitions.configLoader?.loadChildren(injector, route)?.subscribe((i: any) => {
        // console.log(i)
        i.routes.forEach((j: any) => {
          output = this.getPaths(router, injector, j, parent + route.path, output);
        });
      });
    }
    else if (route.path != null) {
      output = this.setPath(route, parent, output);
    }
    this.allRoutes$.next(Object.assign([], output));
    return output;
  }

  setPath(route: Route, parent: any, output: any[] = []) {
    let fullPath: string = "";
    if (route.path != null) {
      if (route.path !== '') {
        fullPath = parent ? `/${parent}${route.path}` : `/${route.path}`;
      } else {
        fullPath = parent ? `/${parent}` : '';
      }
    }
    this.urls.push(fullPath);
    output.push({
      path: fullPath,
      component: route.component,
    });

    return output;
  }

  printpath(parent: string, config: any[]) {
    for (let i = 0; i < config.length; i++) {
      const route = config[i];
      // console.log(parent + '/' + route.path);
      console.log("Route ", route?._loadedConfig);
      const loadedRoutes = route?._loadedRoutes;
      if (typeof loadedRoutes != "undefined" && loadedRoutes[0].children) {
        console.log("Children ", loadedRoutes[0].children);
        const currentPath = route.path ? `${parent}/${route.path}` : parent;
        console.log("Current Path ", currentPath);
        this.printpath(currentPath, loadedRoutes[0].children);
      }
    }
  }

  updateSelect2Elements(formValues: any) {
    for (const key in formValues) {
      if (formValues.hasOwnProperty(key)) {
        let value = formValues[key];
        const selectElement = $(`select[formControlName="${key}"]`);
        const prop = selectElement.attr("data-value");
        if (selectElement.length > 0) {
          if(typeof value === "object" && value != null)
          {
            const keyTyped = prop as keyof typeof value;
            /*console.log("Type === ", typeof value);
            console.log("Select === ", keyTyped);*/
            value = value[keyTyped];
          }
          console.log("Value === ", value);
          selectElement.val(value).trigger("change");
        }
      }
    }
  }

  async getRoutes(
    router: Router,
    injector: Injector,
    route: Route,
    parent: string = ''
  ): Promise<void> {
    if (route.redirectTo) {
      return;
    }
    if (route.children) {
      console.log("**************************************************")
      // console.log("Parent : ", `${parent}/${route.path}`);
      for (const childRoute of route.children) {
        // console.log("Child : ", route.path);
        await this.getRoutes(
          router,
          injector,
          childRoute,
          parent ? `${parent}/${route.path}` : route.path
        );
      }
    } else if (route.loadChildren) {
      const lazyConfig = await (<any>router).navigationTransitions.configLoader.loadChildren(injector, route)?.toPromise();
      for (const childRoute of lazyConfig.routes) {
        await this.getRoutes(router, injector, childRoute, parent + route.path);
      }
    } else if (route.path !== null) {
      if (route.path !== '') {
        // console.log("Path1 === ", parent ? `/${parent}${route.path}` : `/${route.path}`);
        this.routerUrls.push({
          path: parent ? `/${parent}${route.path}` : `/${route.path}`,
          component: route.component,
        });
      } else {
        // console.log("Path2 === ", parent ? `/${parent}` : '');
        this.routerUrls.push({ path: parent ? `/${parent}` : '', component: route.component });
      }
    }
  }

  /**
   * Returns routes of the app via the Angular Router.
   *
   * Important: The fallback route in the app module (path: "**")
   * has to be the last element in your top level app-routing-module.
   *
   * @param router Angular Router
   * @param injector Angular Injector
   * @returns Routes of the app
   */
  async getAllRoutes(
    router: Router,
    injector: Injector
  ): Promise<{ path: string; component: any }[]> {
    this.routerUrls = [];
    const topLevelRoutes = router.config.slice(
      0,
      router.config.findIndex((route) => route.path === '**') ?? router.config.length - 1
    );
    for (const i of topLevelRoutes) {
      await this.getRoutes(router, injector, i);
    }
    return this.routerUrls;
  }

  ngOnDestroy(): void {
  }
}
