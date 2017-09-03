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

const SELECTOR = ".raw-topic-link";

export default {
  didInsertElement() {
    this._super();
    if (this.capabilities.touch) { return; }

    cancel();

    this.$(SELECTOR).on('mouseenter.discourse-tooltips', function(e) {
      let $this = $(this);
      let topicId = parseInt($(e.currentTarget).closest('[data-topic-id]').attr('data-topic-id'));
      if (topicId) {
        cancel();

        _promise = ajax("/tooltip-previews", { data: { topic_ids: [topicId] } });
        _promise.then(r => {

          if (r && r.excerpts) {
            _.merge(_cached, r.excerpts);
          }

          $this.after(`<div class='d-tooltip'><div class='d-tooltip-pointer'></div><div class='d-tooltip-content'>${_cached[topicId].excerpt}</div></div></div>`);

          let $dTooltip = $('.d-tooltip');

          let tooltipWidth = $dTooltip.outerWidth();
          let tooltipHeight = $dTooltip.outerHeight();
          let elementWidth = $this.width();
          let elementHeight = $this.height();

          let elementX = $this.position().left;
          let y = parseInt(tooltipHeight / 2) + elementHeight;
          let x = elementX + (elementWidth / 2) - (tooltipWidth / 2);
          $dTooltip.css('left', `${x}px`);
          $dTooltip.css('margin-top', `${y}px`);
          $dTooltip.fadeIn(200);


        }).catch(() => {
          // swallow errors - was probably aborted!
        });
      }
    });
    this.$(SELECTOR).on('mouseleave.discourse-tooltips', () => cleanDom());
  },

  willDestroyElement() {
    this._super();
    if (this.capabilities.touch) { return; }

    cancel();
    this.$(SELECTOR).off('mouseenter.discourse-tooltips');
    this.$(SELECTOR).off('mouseleave.discourse-tooltips');
  }
};
