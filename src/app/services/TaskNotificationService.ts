import { Injectable, OnDestroy } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { firstValueFrom } from 'rxjs';
import {
    BehaviorSubject,
    EMPTY,
    Subscription,
    timer
} from 'rxjs';

import {
    catchError,
    exhaustMap
} from 'rxjs/operators';

import { Router } from '@angular/router';

import {
    TacheATraiter,
    NotificationTask
} from '../core/models/TacheATraiter';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { LocalService } from './local.service';

@Injectable({
    providedIn: 'root'
})
export class TaskNotificationService implements OnDestroy {
private readonly VAPID_PUBLIC_KEY = environment.webPushPublicKey;
    private readonly apiUrl =
        environment.apiUrl+"/taches/a-traiter";

    private pollingSubscription?: Subscription;

    private readonly notificationsSubject =
        new BehaviorSubject<NotificationTask[]>([]);
    estAilleurs:boolean
    notifications$ =
        this.notificationsSubject.asObservable();

    private readonly visibleSubject =
        new BehaviorSubject<boolean>(false);

    visible$ = this.visibleSubject.asObservable();

    private readonly totalSubject =
        new BehaviorSubject<number>(0);

    total$ = this.totalSubject.asObservable();

    private previousState: string | null = null;

    private closeTimeout?: ReturnType<typeof setTimeout>;

    constructor(
        private http: HttpClient,
        private localStore: LocalService,
        private router: Router,
        private swPush: SwPush
    ) {this.estAilleurs=false}

    /**
     * Démarre la vérification automatique.
     */
    startPolling(): void {

        if (this.pollingSubscription) {
            return;
        }

        this.pollingSubscription = timer(0, 30000)
            .pipe(
                exhaustMap(() =>
                    this.rechercherTaches().pipe(
                        catchError(error => {

                            console.error(
                                'Erreur de vérification des tâches',
                                error
                            );

                            return EMPTY;
                        })
                    )
                )
            )
            .subscribe(resultat => {

                this.traiterResultat(resultat);

            });
    }

    /**
     * Analyse le résultat du backend.
     */
    private traiterResultat(resultat: TacheATraiter): void {

    const total =
        (resultat.nombreOrdresEchus || 0) +
        (resultat.nombreTitresEchus || 0) +
        (resultat.nombreDetachementsCoupons || 0);

    this.totalSubject.next(total);

    const nouvellesNotifications: NotificationTask[] = [];

    if (resultat.nombreOrdresEchus > 0) {
        nouvellesNotifications.push({
            id: 'ORDRE',
            titre: 'Ordres de bourse échus',
            description: 'Vous avez des ordres de bourse arrivés à échéance.',
            nombre: resultat.nombreOrdresEchus,
            type: 'ORDRE',
            icon: 'bi bi-exclamation-circle'
        });
    }

    if (resultat.nombreTitresEchus > 0) {
        nouvellesNotifications.push({
            id: 'TITRE',
            titre: 'Échéances de titres',
            description: 'Des titres sont en attente de remboursement.',
            nombre: resultat.nombreTitresEchus,
            type: 'TITRE',
            icon: 'bi bi-star'
        });
    }

    if (resultat.nombreDetachementsCoupons > 0) {
        nouvellesNotifications.push({
            id: 'COUPON',
            titre: 'Détachement de coupons',
            description: 'Des détachements de coupons sont en attente.',
            nombre: resultat.nombreDetachementsCoupons,
            type: 'COUPON',
            icon: 'bi bi-cash-coin'
        });
    }

    this.notificationsSubject.next(nouvellesNotifications);

    if (total > 0) {
        // Afficher à chaque réponse du backend
        this.afficherPopup();
        this.afficherNotificationWindows(resultat);
    } else {
        this.fermerPopup();
    }

    
}
    // private traiterResultat(resultat: TacheATraiter): void {

    //     const total =
    //         resultat.nombreOrdresEchus +
    //         resultat.nombreTitresEchus +
    //         resultat.nombreDetachementsCoupons;

    //     this.totalSubject.next(total);

    //     const nouvellesNotifications: NotificationTask[] = [];

    //     if (resultat.nombreOrdresEchus > 0) {

    //         nouvellesNotifications.push({
    //             id: 'ORDRE',
    //             titre: 'Ordres de bourse échus',
    //             description: 'Vous avez des ordres de bourse arrivés à échéance.',
    //             nombre: resultat.nombreOrdresEchus,
    //             type: 'ORDRE',
    //             icon: 'bi bi-exclamation-circle'
    //         });

    //     }

    //     if (resultat.nombreTitresEchus > 0) {

    //         nouvellesNotifications.push({
    //             id: 'TITRE',
    //             titre: 'Échéances de titres',
    //             description: 'Des titres sont en attente de remboursement.',
    //             nombre: resultat.nombreTitresEchus,
    //             type: 'TITRE',
    //             icon: 'bi bi-star'
    //         });

    //     }

    //     if (resultat.nombreDetachementsCoupons > 0) {

    //         nouvellesNotifications.push({
    //             id: 'COUPON',
    //             titre: 'Détachement de coupons',
    //             description: 'Des détachements de coupons sont en attente.',
    //             nombre: resultat.nombreDetachementsCoupons,
    //             type: 'COUPON',
    //             icon: 'bi bi-cash-coin'
    //         });

    //     }

    //     this.notificationsSubject.next(nouvellesNotifications);

    //     const currentState = JSON.stringify({
    //         nombreOrdresEchus: resultat.nombreOrdresEchus,
    //         nombreTitresEchus: resultat.nombreTitresEchus,
    //         nombreDetachementsCoupons: resultat.nombreDetachementsCoupons
    //     });

    //     // Première vérification : afficher si des tâches existent.
    //     // Vérifications suivantes : afficher si les quantités changent.
    //     const changement =
    //         this.previousState === null ||
    //         this.previousState !== currentState;

    //     this.previousState = currentState;

    //     if (total > 0 && changement) {
    //         this.afficherPopup();
    //     }

    //     if (total === 0) {
    //         this.fermerPopup();
    //     }
    // }

    /**
     * Affiche le popup.
     */
    afficherPopup(): void {

        if (this.totalSubject.value <= 0) {
            return;
        }

        this.visibleSubject.next(true);

        if (this.closeTimeout) {
            clearTimeout(this.closeTimeout);
        }

        // Fermeture automatique après 15 secondes.
        this.closeTimeout = setTimeout(() => {
            this.fermerPopup();
        }, 15000);
    }

    /**
     * Ferme le popup.
     */
    fermerPopup(): void {

        this.visibleSubject.next(false);

        if (this.closeTimeout) {
            clearTimeout(this.closeTimeout);
            this.closeTimeout = undefined;
        }
    }

    /**
     * Navigation vers la page correspondante.
     */
    consulterNotification(type: string): void {

        this.fermerPopup();

        switch (type) {

            case 'ORDRE':

                this.router.navigate([
                    '/opcvm/ordre/liste/relachementordre'
                ]);

                break;

            case 'TITRE':
                this.estAilleurs=true
                this.router.navigate([
                    '/opcvm/etats/previonnelremboursement'
                ]);

                break;

            case 'COUPON':

                this.router.navigate([
                    '/opcvm/affectation_resultat/phasedetachementcoupon'
                ]);

                break;
        }
    }

    /**
     * Arrête les vérifications.
     */
    stopPolling(): void {

        this.pollingSubscription?.unsubscribe();

        this.pollingSubscription = undefined;

        this.fermerPopup();
    }

    ngOnDestroy(): void {

        this.stopPolling();

        this.notificationsSubject.complete();
        this.visibleSubject.complete();
        this.totalSubject.complete();
    }
    /**
 * Activer les notifications lors de l'entrée dans un OPCVM.
 */
activerNotifications(): void {
    if (this.pollingSubscription) {
        return;
      }
    this.previousState = null;

    this.startPolling();

}

/**
 * Désactiver les notifications à la sortie de l'OPCVM.
 */
desactiverNotifications(): void {

    this.stopPolling();

    this.previousState = null;

    this.totalSubject.next(0);

    this.notificationsSubject.next([]);

}
 rechercherTaches(): Observable<any> {

  const opcvm = this.localStore.getData("currentOpcvm");
  const seance = this.localStore.getData("currentSeance");
  const date = seance.dateFermeture;

  const parametres = {
    idOpcvm: opcvm.idOpcvm,
    dateFermeture: date.substring(0, 10),
    estAilleurs: this.estAilleurs
  };    
  // const parametres = {
  //   idOpcvm: opcvm.idOpcvm,
  //   dateFermeture: seance.dateFermeture.toISOString().slice(0, 10),
  //   estAilleurs: this.estAilleurs
  // };

   return this.http.post<any>(
    `${environment.apiUrl}/taches/a-traiter`, parametres 
  );
  // return this.http.get<any>(
  //   `${environment.apiUrl}/taches/a-traiter`,
  //   { params: parametres }
  // );
}

/**
 * Demander l'autorisation d'afficher les notifications Windows.
 * Cette méthode doit être appelée après une action de l'utilisateur.
 */
demanderAutorisationNotifications(): void {

    if (!('Notification' in window)) {
        console.warn('Les notifications natives ne sont pas supportées.');
        return;
    }

    if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            console.log('Autorisation des notifications :', permission);
        });
    }
}
/**
 * Afficher une notification native Windows.
 */
private afficherNotificationWindows(resultat: TacheATraiter): void {

    if (!('Notification' in window)) {
        return;
    }

    if (Notification.permission !== 'granted') {
        return;
    }

    // N'afficher la notification Windows que si le navigateur
    // est en arrière-plan ou minimisé.
    if (document.visibilityState === 'visible') {
        return;
    }

    const total =
        resultat.nombreOrdresEchus +
        resultat.nombreTitresEchus +
        resultat.nombreDetachementsCoupons;

    if (total <= 0) {
        return;
    }

    const notification = new Notification(
        'OPCCIEL 2.0 - Tâches à traiter',
        {
            body: `Vous avez ${total} tâche(s) en attente.\n` +
                  `Ordres échus : ${resultat.nombreOrdresEchus}\n` +
                  `Titres échus : ${resultat.nombreTitresEchus}\n` +
                  `Coupons : ${resultat.nombreDetachementsCoupons}`,
            icon: 'assets/media/logos/favicon.ico',
            tag: 'opcciel-taches',
            //renotify: true
        }
    );

    notification.onclick = () => {
        window.focus();
        notification.close();

        // L'utilisateur revient dans OPCCIEL.
        // Il pourra consulter les détails dans le popup Angular.
    };
}

// async activerAbonnementPush(): Promise<void> {

//     if (!this.swPush.isEnabled) {
//         console.warn('Le Service Worker n’est pas activé.');
//         return;
//     }

//     try {

//         const permission = await Notification.requestPermission();

//         if (permission !== 'granted') {
//             console.warn('Autorisation des notifications refusée.');
//             return;
//         }

//         const opcvm = this.localStore.getData('currentOpcvm');

//         if (!opcvm?.idOpcvm) {
//             console.warn('Aucun OPCVM sélectionné.');
//             return;
//         }

//         const abonnement = await this.swPush.requestSubscription({
//     serverPublicKey: this.VAPID_PUBLIC_KEY
// });

//         const json = abonnement.toJSON();

//         const parametres = {
//             idOpcvm: opcvm.idOpcvm,
//             endpoint: abonnement.endpoint,
//             p256dh: json.keys?.p256dh,
//             auth: json.keys?.auth
//         };

//         const reponse = await firstValueFrom(
//         this.http.post(
//             `${environment.apiUrl}/push/subscription`,
//             parametres,
//             { responseType: 'text' }
//         )
//         );

//         console.log('Réponse du serveur :', reponse);
//         //console.log('Abonnement Push enregistré avec succès.');
//         console.log('Abonnement Push enregistré avec succès.');

//     } 
// //      catch (error: any) {
// //   console.error('Erreur Push complète :', error);
// //   console.error('Statut HTTP :', error.status);
// //   console.error('Message :', error.message);
// //   console.error('Corps de la réponse :', error.error);
// //   console.error('Type de réponse :', error.headers?.get('content-type'));
// // }
// // //     catch (error: any) {
// // //     console.error('Erreur Push complète :', error);

// // //     if (error instanceof HttpErrorResponse) {
// // //         console.log('Statut HTTP :', error.status);
// // //         console.log('Corps de la réponse :', error.error);
// // //         console.log('Message :', error.message);
// // //     }
// // // }
//     catch (error) {
//         console.error(
//             'Erreur lors de l’activation des notifications Push :',
//             error
//         );
//     }
//  }


async activerAbonnementPush(): Promise<void> {
    const opcvm = this.localStore.getData('currentOpcvm');
    let idOpcvm:Number=opcvm.idOpcvm
    console.log('PUSH - Méthode appelée avec OPCVM :', idOpcvm);
    console.log('PUSH - Service Worker activé :', this.swPush.isEnabled);
    console.log('PUSH - Permission actuelle :', Notification.permission);
  console.log('===== ACTIVATION PUSH =====');
  console.log('OPCVM à enregistrer :', idOpcvm);

  if (!this.swPush.isEnabled) {
    console.error('Service Worker non activé');
    return;
  }

  try {
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        console.error('Permission de notification refusée');
        return;
      }
    }

    if (!idOpcvm) {
      console.error('Identifiant OPCVM invalide');
      return;
    }

    // Récupérer l'abonnement existant du navigateur
    let abonnement = await firstValueFrom(this.swPush.subscription);

    console.log('Abonnement existant :', abonnement);

    // Créer l'abonnement uniquement s'il n'existe pas
    if (!abonnement) {
      console.log('Création d’un nouvel abonnement...');

      abonnement = await this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      });
    }

    const json = abonnement.toJSON();

    if (!json.keys?.p256dh || !json.keys?.auth) {
      throw new Error('Clés Push manquantes dans l’abonnement');
    }

    const parametres = {
      idOpcvm: idOpcvm,
      endpoint: abonnement.endpoint,
      p256dh: json.keys.p256dh,
      auth: json.keys.auth
    };

    console.log('Enregistrement pour OPCVM :', idOpcvm);

    console.log('PUSH - Je vais envoyer la requête HTTP');
    const reponse = await firstValueFrom(
      this.http.post(
        `${environment.apiUrl}/push/subscription`,
        parametres,
        { responseType: 'text' }
      )
    );

    console.log('Réponse backend :', reponse);
    console.log('===== ABONNEMENT PUSH ENREGISTRÉ =====');

  } catch (error) {
    console.error('===== ERREUR ACTIVATION PUSH =====', error);

    if (error instanceof HttpErrorResponse) {
      console.error('Statut HTTP :', error.status);
      console.error('Réponse serveur :', error.error);
    }
  }
}

// async activerAbonnementPush(): Promise<void> {
//   console.log('===== ACTIVATION PUSH =====');

//   if (!this.swPush.isEnabled) {
//     console.error('Service Worker non activé');
//     return;
//   }

//   try {
//     const permission = await Notification.requestPermission();
//     console.log('Permission :', permission);

//     if (permission !== 'granted') {
//       console.error('Permission refusée');
//       return;
//     }

//     const opcvm = this.localStore.getData('currentOpcvm');
//     console.log('OPCVM courant :', opcvm);

//     if (!opcvm?.idOpcvm) {
//       console.error('Aucun OPCVM sélectionné');
//       return;
//     }

//     // Récupérer l'abonnement existant
//     let abonnement = await firstValueFrom(this.swPush.subscription);

//     console.log('Abonnement existant :', abonnement);

//     // Créer un abonnement uniquement s'il n'existe pas
//     if (!abonnement) {
//       console.log('Création d’un nouvel abonnement...');

//       abonnement = await this.swPush.requestSubscription({
//         serverPublicKey: this.VAPID_PUBLIC_KEY
//       });
//     }

//     const json = abonnement.toJSON();

//     const parametres = {
//       idOpcvm: opcvm.idOpcvm,
//       endpoint: abonnement.endpoint,
//       p256dh: json.keys?.p256dh,
//       auth: json.keys?.auth
//     };

//     console.log('Données envoyées au backend :', {
//       idOpcvm: parametres.idOpcvm,
//       endpoint: parametres.endpoint,
//       p256dhPresent: !!parametres.p256dh,
//       authPresent: !!parametres.auth
//     });

//     const reponse = await firstValueFrom(
//       this.http.post(
//         `${environment.apiUrl}/push/subscription`,
//         parametres,
//         { responseType: 'text' }
//       )
//     );

//     console.log('Réponse backend :', reponse);
//     console.log('===== ABONNEMENT PUSH ENREGISTRÉ =====');

//   } catch (error) {
//     console.error('===== ERREUR ACTIVATION PUSH =====');
//     console.error(error);

//     if (error instanceof HttpErrorResponse) {
//       console.error('Statut HTTP :', error.status);
//       console.error('Réponse serveur :', error.error);
//     }
//   }
// }


 testerNotificationPush(idOpcvm: number): void {
  this.http.post(
    `${environment.apiUrl}/push/test/${idOpcvm}`,
    {},
    { responseType: 'text' }
  ).subscribe({
    next: (reponse) => {
      console.log('Test Push :', reponse);
    },
    error: (erreur) => {
      console.error('Erreur test Push :', erreur);
    }
  });
}
}