import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  private toastController = inject(ToastController);

  async showToast(
    message: string,
    position: 'top' | 'bottom' | 'middle' = 'top',
    duration: number = 5000
  ) {
    const toast = await this.toastController.create({
      message,
      duration,
      position,
    });

    await toast.present();
  }
}
