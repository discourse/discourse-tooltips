module ::DiscourseTooltips
  PLUGIN_NAME = "discourse-tooltips"

  class Engine < ::Rails::Engine
    engine_name DiscourseTooltips::PLUGIN_NAME
    isolate_namespace DiscourseTooltips
  end
end
