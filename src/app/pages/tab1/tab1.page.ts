import { Component, inject, Pipe, PipeTransform } from '@angular/core';
import { CommonModule, JsonPipe, NgTemplateOutlet } from '@angular/common';
import { CouponService } from '../../services/coupon.service';

import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonLabel, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView,
  IonGrid, IonRow, IonCol,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonImg,
  IonItem, IonIcon
} from '@ionic/angular/standalone';

import { Coupon, ICouponData } from '../../models/coupon.model';

import { cameraOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

import { 
  CapacitorBarcodeScanner, 
  CapacitorBarcodeScannerTypeHint, 
  CapacitorBarcodeScannerScanResult 
} from '@capacitor/barcode-scanner';

import { ToastService } from '../../services/toast.service';

//
// 🔹 Pipe embebido en este mismo archivo
//
@Pipe({
  name: 'filterCouponCategory',
  standalone: true,
})
export class FilterCouponCategoryPipe implements PipeTransform {
  transform(coupons: Coupon[], category: string): Coupon[] {
    if (!coupons || !category) {
      return coupons;
    }
    return coupons.filter((c) => c.category === category);
  }
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonLabel, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView,
    IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonImg,
    IonItem, IonIcon,
    FilterCouponCategoryPipe,
    JsonPipe,
    NgTemplateOutlet
  ],
})
export class Tab1Page {

  private couponService: CouponService = inject(CouponService);
  private toastService: ToastService = inject(ToastService);

  coupons: Coupon[] = [];

  constructor() {
    addIcons({ cameraOutline });
  }

  async ionViewWillEnter() {
    this.coupons = await this.couponService.getCoupons();
    console.log(this.coupons);
  }

  changeActivate(coupon: Coupon){
    coupon.activate = !coupon.activate;
    this.couponService.saveCoupons(this.coupons);
  }

  startCamera(){
    CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.QR_CODE
    })
    .then( ( resultBarcode: CapacitorBarcodeScannerScanResult ) =>{
      console.log(resultBarcode);
      if(resultBarcode.ScanResult){
        try {
          const couponData: ICouponData = JSON.parse(resultBarcode.ScanResult);
          const coupon = new Coupon(couponData);
          if(coupon.isValid()){
            const couponExist = this.coupons.some((c:Coupon)=> c.isEqual(coupon));
            if(!couponExist){
              this.coupons = [...this.coupons, coupon];
              this.couponService.saveCoupons(this.coupons);
              this.toastService.showToast("Cupon agregado");
            }
            else{
              this.toastService.showToast("El cupon ya existe");
            }
          }
          else{
            this.toastService.showToast("El cupon es Invalido");
          }
        } 
        catch (error){
          console.error(error);
          this.toastService.showToast("QR error");
        }
      }
    });
  }
}
