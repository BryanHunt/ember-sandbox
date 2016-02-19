import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({

  producer: task(function * () {
    window.console.log("start producing");

    for(let i = 0; i < 100; i++) {
      window.console.log("producing next");
      yield timeout(1000);
//      this.get('data').pushObject(i);
    }

    window.console.log("stop producing");
  }),

  consumer: task(function * () {
    window.console.log("start consuming")

    while(true) {
      window.console.log("consuming next");
      this.get('out').pushObjects(this.get('data'));
      this.set('data', Ember.A());
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
//      this.get('consumer').perform();
      window.console.log("started");
    }
  }
});
