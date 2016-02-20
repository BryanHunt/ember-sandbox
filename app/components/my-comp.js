import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

export default Ember.Component.extend({

  producer: task(function * () {
    window.console.log("start producing");

    for(let i = 0; i < 100; i++) {
      yield timeout(100);
      this.get('data').pushObject(i);
    }

    window.console.log("stop producing");
  }),

  consumer: task(function * () {
    window.console.log("start consuming")

    while(true) {
      let data = this.get('data');
      if(data.length > 0) {
        this.get('out').pushObjects(data);
        this.set('data', Ember.A());
      }
      yield timeout(300);
    }

    window.console.log("stop consuming")
  }),

  init() {
    this._super.apply(this, arguments);
    this.set('data', Ember.A());
    this.set('out', Ember.A());
  },

  actions: {
    start() {
      this.get('producer').perform();
      this.get('consumer').perform();
      window.console.log("started");
    }
  }
});
