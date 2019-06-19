import {Component, OnInit} from '@angular/core';
import {AppService} from './service/app.service';
import {FoodItem} from './model/FoodItem';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  list = [];

  favoriteList: FoodItem[] = [];

  categoryList: FoodItem[] = [];

  foodListByCategory: FoodItem[] = [];

  searchFood: string = '';

  cart = {};

  cartCount: number = 0;

  categorySelected: boolean = false;

  foodRecipeView: boolean = false;

  foodItemSelected: FoodItem;

  constructor(private appService: AppService) {
  }

  /**
   * Initially when the component loads, the service class calls the api to get the list of
   * food items. If there is any local storage data which is maintained here for keeping the
   * cart record, it gets the data.
   */
  ngOnInit() {
    this.appService.getFoodItemList().subscribe((data) => {
      this.foodListByCategory = [];
      this.list = data['recipes'];
      console.log(this.list);
      this.findFavorites(data['recipes']);
      this.categoryList = data['categories'];
      this.foodListByCategory = [...this.list];
    });
    if (localStorage.getItem('cart')) {
      this.cart = JSON.parse(localStorage.getItem('cart'));
      this.setCartCount();
    }
  }

  /**
   * Filters out the items which are marked as favorite
   * @param list
   */
  findFavorites(list: FoodItem[]) {
    this.favoriteList = list.filter((el) => el['isFavourite']);
  }

  /**
   * This function is triggered when any of the categories like Desserts/ Snacks etc
   * is chosen by user. Notice that the list of items will change accordingly.
   * @param category
   */
  getListOfSelectedCategory(category) {
    this.categorySelected = true;
    this.foodListByCategory = this.list.filter((el) => {
      if (el.category === category.name) {
        return el;
      }
    });
  }

  /**
   * When the search field is entered by user, after 3 seconds from that time the list
   * is updated. This delay is added considering that in a real time application, api call
   * should not be made with every letter keyed in.
   */
  searchItem() {
    setTimeout(() => {
      this.foodListByCategory = this.list.filter((el) => {
        if (el.name.includes(this.searchFood)) {
          return el;
        }
      });
    }, 3000);
  }

  /**
   * Adds the item to cart. Whenever an item is added, the cart value is incremented.
   * I am using localstorage here. In real apps, this data can be obtained from backend service
   * call.
   * @param item
   */
  addToBag(item: FoodItem) {
    let ls = [];
    let count: number;
    if (localStorage.getItem('cart')) {
      ls = JSON.parse(localStorage.getItem('cart'));
      let itemPresent: boolean = false;
      for (let i in ls) {
        if (item.name === i) {
          this.cart[i]++;
          count = this.cart[i];
          itemPresent = true;
          break;
        }
      }
      if (!itemPresent) {
        let obj = {};
        obj[item.name] = 1;
        count = 1;
        this.cart = Object.assign(this.cart, obj);
      }
    } else {
      let obj = {};
      obj[item.name] = 1;
      count = 1;
      this.cart = Object.assign(this.cart, obj);
    }
    item.cartCount = count;

    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.setCartCount();
  }

  /**
   * Setting the value of the total cart count. This function is used by other functions to
   * update.
   */
  setCartCount() {
    let ls = [];
    let totalCount: number = 0;
    if (localStorage.getItem('cart')) {
      ls = JSON.parse(localStorage.getItem('cart'));
      for (let i in ls) {
        totalCount += ls[i];
      }
    }
    this.cartCount = totalCount;
  }

  /**
   * This function takes the user to the particular food item. There we have the user number input type field
   * where user can increase/decrease the item count. With every change, the cart count value is updated.
   * @param item
   */
  visitFoodItem(item: FoodItem) {
    let ls = [];
    if (localStorage.getItem('cart')) {
      ls = JSON.parse(localStorage.getItem('cart'));
      let itemPresent: boolean = false;
      for (let i in ls) {
        if (item.name === i) {
          itemPresent = true;
          item.cartCount = ls[i];
          break;
        }
      }
      if (!itemPresent) {
        item.cartCount = 0;
      }
    }

    this.foodRecipeView = true;
    this.foodItemSelected = item;
  }

  /**
   * This is added to allow the user to go back to main screen from single-recipe screen.
   */
  goBackToList() {
    this.foodRecipeView = false;
  }

  /**
   * This function is triggered when user tries to increase/decrease a particular item count.
   * @param item
   * @param count
   */
  incDecItem(item: FoodItem, count: number) {
    let ls = [];
    if (localStorage.getItem('cart')) {
      ls = JSON.parse(localStorage.getItem('cart'));
      let itemPresent: boolean = false;
      for (let i in ls) {
        if (item.name === i) {
          this.cart[i] = count;
          if (count === 0) {
            localStorage.removeItem(i);
          }
          itemPresent = true;
          break;
        }
      }
      if (!itemPresent) {
        let obj = {};
        obj[item.name] = 1;
        this.cart = Object.assign(this.cart, obj);
      }
    } else {
      let obj = {};
      obj[item.name] = 1;
      this.cart = Object.assign(this.cart, obj);
    }

    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.setCartCount();
  }

  /**
   * Removing the item from local storage if the item count is zero.
   * @param item
   */
  removeFromLocalStorage(item) {
    localStorage.removeItem(item);
  }
}
