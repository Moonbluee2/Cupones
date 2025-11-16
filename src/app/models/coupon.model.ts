export interface ICouponData {
  idProduct: number;
  img: string;
  name: string;
  category: string;
  discount: number;
  activate?: boolean;
}

export class Coupon {
  private _idProduct!: number;
  public get idProduct(): number {
    return this._idProduct;
  }
  public set idProduct(value: number) {
    this._idProduct = value;
  }

  private _img!: string;
  public get img(): string {
    return this._img;
  }
  public set img(value: string) {
    this._img = value;
  }

  private _name!: string;
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  private _category!: string;
  public get category(): string {
    return this._category;
  }
  public set category(value: string) {
    this._category = value;
  }

  private _discount!: number;
  public get discount(): number {
    return this._discount;
  }
  public set discount(value: number) {
    this._discount = value;
  }

  private _activate: boolean = false;
  public get activate(): boolean {
    return this._activate;
  }
  public set activate(value: boolean) {
    this._activate = value;
  }

  constructor(data: ICouponData) {
    Object.assign(this, data);
  }

  // ✅ Nombre correcto
  isEqual(coupon: Coupon) {
    return this._idProduct === coupon._idProduct;
  }

  // ✅ Dejas el viejo por si en algún lado lo usas
  isEual(coupon: Coupon) {
    return this.isEqual(coupon);
  }

  isValid() {
    return !!(this._idProduct && this._name && this._discount && this._category);
  }

  toCouponData(): ICouponData {
    return {
      idProduct: this._idProduct,
      img: this._img,
      name: this._name,
      category: this._category,
      discount: this._discount,
      activate: this._activate,
    };
  }
}
