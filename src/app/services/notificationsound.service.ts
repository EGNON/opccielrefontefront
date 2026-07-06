// notification-sound.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationSoundService {
  private audio = new Audio('assets/audios/mixkit-happy-bells-notification-937.wav');
  private isUnlocked = false;

  constructor() {
    this.audio.volume = 0.6;
    this.audio.preload = 'auto';

    // Débloque le son dès la première interaction utilisateur
    this.unlockAudioOnFirstInteraction();
  }

  private unlockAudioOnFirstInteraction(): void {
    const unlock = () => {
      if (this.isUnlocked) return;

      // On joue un son silencieux (ou très court) pour "débloquer" le contexte audio
      const silentAudio = new Audio('assets/audios/mixkit-happy-bells-notification-937.wav');
      silentAudio.volume = 0.01;   // presque silencieux
      silentAudio.play().then(() => {
        silentAudio.pause();
        this.isUnlocked = true;
        console.log('✅ Audio débloqué après interaction utilisateur');
      }).catch(() => {});

      // On enlève les listeners une fois débloqué
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('keydown', unlock);
    };

    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('touchstart', unlock, { once: true });
    document.addEventListener('keydown', unlock, { once: true });
  }

  playNotificationSound(): void {
    if (!this.isUnlocked) {
      console.warn('Son bloqué : l’utilisateur n’a pas encore interagi avec la page');
      return;
    }

    try {
      const sound = this.audio.cloneNode(true) as HTMLAudioElement;
      sound.currentTime = 0;
      sound.volume = 0.6;
      sound.play();
    } catch (err) {
      console.warn('Erreur lors de la lecture du son :', err);
    }
  }
}