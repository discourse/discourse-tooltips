# encoding: utf-8
# frozen_string_literal: true

require 'rails_helper'

describe "RateLimiting previews" do
  before do
    SiteSetting.tooltips_rate_limit_queue_seconds = 0.1
  end

  let(:topic) { Fabricate(:topic) }

  it "will rate limit previews once queuing" do
    freeze_time

    get "/tooltip-previews",
      params: {
        topic_ids: [ topic.id ]
      },
      headers: {
        "HTTP_X_REQUEST_START" => "t=#{Time.now.to_f - 0.2}"
      }

    expect(response.status).to eq(429)
    expect(response.headers['Retry-After'].to_i).to be > 29
  end

  it "will not rate limit when all is good" do
    freeze_time

    get "/tooltip-previews",
      params: {
        topic_ids: [ topic.id ]
      },
      headers: {
        "HTTP_X_REQUEST_START" => "t=#{Time.now.to_f - 0.05}"
      }

    expect(response.status).to eq(200)
  end
end
