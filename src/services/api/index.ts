import { CounterApi } from './counter';
import { HomeApi } from './home';

export class ApiService implements IService {
  private inited = false;

  counter: CounterApi;
  home: HomeApi;

  constructor() {
    this.counter = new CounterApi();
    this.home = new HomeApi();
  }

  init = async (): PVoid => {
    if (!this.inited) {
      // your code ...

      this.inited = true;
    }
  };
}
