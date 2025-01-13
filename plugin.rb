# frozen_string_literal: true

# name: discourse-tooltips
# about: Allows for the previewing of the contents of topics on hover.
# meta_topic_id: 69304
# version: 0.1
# authors: Robin Ward
# url: https://github.com/discourse/discourse-tooltips

enabled_site_setting :tooltips_enabled
register_asset "stylesheets/d-tooltip.scss"

after_initialize do
  module TopicSerializerExtension
    def include_excerpt?
      return true if SiteSetting.tooltips_enabled
      super
    end
  end

  reloadable_patch { ::ListableTopicSerializer.prepend(TopicSerializerExtension) }
end
