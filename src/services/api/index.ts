import { AumsApi } from './aums';
import { CounterApi } from './counter';

export class ApiService implements IService {
  private inited = false;

  counter: CounterApi;
  aums: AumsApi;

  constructor() {
    this.counter = new CounterApi();
    this.aums = new AumsApi('http://219.233.221.231:38080');
  }

  init = async (): PVoid => {
    if (!this.inited) {
      // your code ...

      this.inited = true;
    }
  };
}
