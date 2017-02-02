count = 0

json.array! @geo_tweets do |tweet|
 json.id count
 json.text tweet[:text]
 json.coordinates tweet[:coordinates]
 json.created_at tweet[:created_at]
 json.user_name tweet[:user][:screen_name]
 json.user_image tweet[:user][:profile_image_url_https]
 json.place tweet[:place]

 count += 1
end