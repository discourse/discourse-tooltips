# frozen_string_literal: true

RSpec.describe "Discourse Tooltips", type: :system do
  before { SiteSetting.tooltips_enabled = true }

  fab!(:topic1) do
    Fabricate(:topic).tap do |t|
      PostCreator.new(t.user, topic_id: t.id, raw: "post for topic one").create.rebake!
    end
  end

  fab!(:topic2) do
    Fabricate(:topic).tap do |t|
      PostCreator.new(t.user, topic_id: t.id, raw: "post for topic two").create.rebake!
    end
  end

  it "renders tooltips correctly" do
    visit "/latest"

    expect(page).to have_css(".topic-list-item", count: 2)
    expect(page).not_to have_css(".d-tooltip-content")

    find("tr[data-topic-id='#{topic1.id}'] .raw-topic-link").hover
    expect(page).to have_css(".d-tooltip-content", text: "post for topic one")

    find("tr[data-topic-id='#{topic2.id}'] .raw-topic-link").hover
    expect(page).to have_css(".d-tooltip-content", text: "post for topic two")
  end
end
