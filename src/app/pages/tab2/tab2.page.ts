import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from '@ionic/angular/standalone';
import { QRCodeComponent } from 'angularx-qrcode';
import { Coupon } from '../../models/coupon.model';
import { CouponService } from '../../services/coupon.service';
import { ScreenBrightness, GetBrightnessReturnValue } from '@capacitor-community/screen-brightness';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonGrid, IonRow, IonCol, IonText,
    QRCodeComponent,
  ],
})
export class Tab2Page {
  private couponService: CouponService = inject(CouponService);
  QRCode!: string;

  private currentBrightness!: { brightness: number };

  private platform: Platform = inject(Platform);

  async ionViewWillEnter() {
    if (!this.platform.is('desktop')) {
      this.currentBrightness = await ScreenBrightness.getBrightness();
      this.setMaxBrightness();
      if (this.platform.is('ios')) {
        App.addListener('appStateChange', (state) => {
          if (state.isActive) {
            this.setMaxBrightness();
          } else {
            this.restoreBrightness();
          }
        });
      }
    }

    const coupons: Coupon[] = await this.couponService.getCoupons();

    const couponsActivate: Coupon[] = coupons.filter(
      (coupon: Coupon) => coupon.activate
    );

    this.QRCode =
      couponsActivate.length > 0 ? JSON.stringify(couponsActivate) : '';
  }

  ionViewDidLeave() {
    if (!this.platform.is('desktop')) {
      this.restoreBrightness();
      App.removeAllListeners();
    }
  }

  setMaxBrightness() {
    ScreenBrightness.setBrightness({ brightness: 1 });
  }

  restoreBrightness() {
    ScreenBrightness.setBrightness({
      brightness: this.currentBrightness.brightness,
    });
  }
}
