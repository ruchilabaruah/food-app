import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AppService {
  constructor(private httpClient: HttpClient) {
  }

  getFoodItemList() {
    return this.httpClient.get('http://temp.dash.zeta.in/food.php');
  }
}
