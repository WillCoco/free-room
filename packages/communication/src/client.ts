import Bugout from 'bugout';

interface Params {
  publicKey: string;
  options?: Record<string, any>;
}

class Client {
  params: Params;
  bugout: any;
  constructor(params: Params) {
    this.params = params;
    this.init();
  }

  init() {
    this.bugout = new Bugout(this.params?.publicKey, this.params?.options);
  }
}

export default Client;
