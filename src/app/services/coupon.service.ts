import { Injectable } from '@angular/core';
import { Coupon, ICouponData } from '../models/coupon.model';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private readonly STORAGE_KEY = 'coupons';

  constructor() {}

  private processCoupons(couponsData: ICouponData[]): Coupon[] {
    const coupons: Coupon[] = [];

    for (const couponData of couponsData) {
      const coupon = new Coupon(couponData);
      coupons.push(coupon);
    }

    return coupons;
  }

  async getCoupons(): Promise<Coupon[]> {
    // 1. Intentar cargar de localStorage
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const data: ICouponData[] = JSON.parse(stored);
        return this.processCoupons(data);
      } catch {
        // si algo falla, seguimos al JSON de assets
      }
    }

    // 2. Si no hay en localStorage, cargar de assets
    const res = await fetch('./assets/data/coupons.json');
    const couponsData: ICouponData[] = await res.json();
    const coupons = this.processCoupons(couponsData);

    // Guardar inicial en localStorage
    this.saveCoupons(coupons);

    return coupons;
  }

  saveCoupons(coupons: Coupon[]): void {
    const data: ICouponData[] = coupons.map((c) => c.toCouponData());
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }
}
