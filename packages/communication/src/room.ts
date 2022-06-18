import Bugout from 'bugout';

interface Params {}

class Server {
  params: Params;
  bugout: any;
  constructor(params: Params) {
    this.params = params;
    this.init();
  }

  init() {
    this.bugout = new Bugout();
    this.bugout.register('ping', (address, args, callback) => {
      // modify the passed arguments and reply
      args.hello = 'Hello from ' + this.bugout.address();
      console.log(address, 'redddsadas');
      callback(args);
    });
  }
}

export default Server;
