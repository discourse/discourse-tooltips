import { ajax } from 'discourse/lib/ajax';

let _cached = {
};

let _promise;

function cleanDom() {
  $('.d-tooltip').remove();
}

function cancel() {
  if (_promise) {
    _promise.abort();
    _promise = null;
  }
  cleanDom();
}


let mouseY = -1;
$(document).on('mousemove', event => mouseY = event.clientY);

let viewY = $(window).height();
$(window).on('resize', () => viewY = $(window).height());


let tipr_cont;

export default {
  didInsertElement() {
    this._super();
    cancel();

    this.$('[data-topic-id]').on('mouseenter.discourse-tooltips', function(e) {
      let $this = $(this);
      let topicId = parseInt($(e.currentTarget).attr('data-topic-id'));
      if (topicId) {
        cancel();

        _promise = ajax("/tooltip-previews", { data: { topic_ids: [topicId] } });
        _promise.then(r => {

          if (r && r.excerpts) {
            _.merge(_cached, r.excerpts);
          }

          $this.after(`<div class='d-tooltip'><div class='d-tooltip-pointer'></div><div class='d-tooltip-content'>${_cached[topicId].excerpt}</div></div></div>`);

          $('.d-tooltip').fadeIn(200);
        }).catch(() => {
          // swallow errors - was probably aborted!
        });
      }
    });
    this.$('[data-topic-id]').on('mouseleave.discourse-tooltips', () => cleanDom());
  },

  willDestroyElement() {
    this._super();
    cancel();
    this.$('[data-topic-id]').off('mouseenter.discourse-tooltips');
    this.$('[data-topic-id]').off('mouseleave.discourse-tooltips');
  }
};
