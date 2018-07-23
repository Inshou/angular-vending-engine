import { Money } from './money';
import { Product } from './product';

export class Vendor {
    id: number;
    name: string;
    money: Money;
    store: Product[];
    deposite: number;
  }