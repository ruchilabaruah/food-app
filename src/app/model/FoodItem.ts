import * as _ from "lodash";

export class FoodItem {
  category: string;
  details: string;
  image: string;
  isFavourite: boolean;
  name: string;
  price: number;
  rating: number;
  reviews: number;

  // For UI purpose
  cartCount: number;

  constructor(data?:{}) {
    if (data) {
      _.assignIn(this, data);
    }
  }
}