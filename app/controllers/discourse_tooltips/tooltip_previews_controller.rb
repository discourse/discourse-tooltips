# frozen_string_literal: true

module DiscourseTooltips
  class TooltipPreviewsController < ApplicationController
    requires_plugin DiscourseTooltips::PLUGIN_NAME

    before_action :rate_limit!
    skip_before_action :check_xhr

    def index
      topic_ids = params.require(:topic_ids).map(&:to_i)

      excerpts = {}

      Post.where(post_number: 1, topic_id: topic_ids).limit(20).each do |p|
        if guardian.can_see?(p)
          excerpts[p.topic_id] = {
            excerpt: PrettyText.excerpt(p.cooked, 200, keep_emoji_images: true)
          }
        end
      end

      render json: { excerpts: excerpts }
    end

    private

    def rate_limit!
      if queue_time = request.env["REQUEST_QUEUE_SECONDS"]
        if queue_time > (SiteSetting.tooltips_rate_limit_queue_seconds).to_f
          raise RateLimiter::LimitExceeded, 30 + (rand * 120).to_i
        end
      end
    end
  end
end
