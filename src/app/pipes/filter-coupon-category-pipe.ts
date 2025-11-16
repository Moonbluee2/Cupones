import { Pipe, PipeTransform } from '@angular/core';
import { Coupon } from 'src/app/models/coupon.model';

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
