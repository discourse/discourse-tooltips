import { ajax } from 'discourse/lib/ajax';

let _cached = {
};

let _promise;

function cancel() {
  if (_promise) {
    _promise.abort();
    _promise = null;
  }
}

export default {
  didInsertElement() {
    this._super();
    cancel();

    this.$('[data-topic-id]').on('mouseenter.discourse-tooltips', e => {
      let topicId = parseInt($(e.currentTarget).attr('data-topic-id'));
      if (topicId) {
        cancel();

        _promise = ajax("/tooltip-previews", { data: { topic_ids: [topicId] } });
        _promise.then(r => {

          if (r && r.excerpts) {
            _.merge(_cached, r.excerpts);
          }

          console.log(_cached[topicId]);
        }).catch(() => {
          // swallow errors - was probably aborted!
        });
      }
    });
  },

  willDestroyElement() {
    this._super();
    cancel();
    this.$('[data-topic-id]').off('mouseenter.discourse-tooltips');
  }
};
