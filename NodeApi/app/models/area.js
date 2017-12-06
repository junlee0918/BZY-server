var mongoose     = require('mongoose');
mongoose.Promise = require('bluebird');
var mongoosePaginate = require('mongoose-paginate');
var Schema       = mongoose.Schema;

var areasSchema = new Schema({
  website:String,
  rating:String,
  address_post_code_suffix:String,
  description:String,
  price_level:String,
  address_sub_premise:String,
  address_neighborhood:String,
  address_po_box_number:String,
  popular_times:Object,
  yelp_urls:String,
  address_number:String,
  address:String,
  address_region_4:String,
  facebook_urls:String,
  address_region_2:String,
  emails:String,
  categories:String,
  address_region_1:String,
  address_post_code:String,
  address_city:String,
  address_region_5:String,
  name:String,
  phone:String,
  address_country:String,
  sub_categories:String,
  vicinity:String,
  longitude:String,
  address_region_3:String,
  reviews:String,
  twitter_urls:String,
  address_route:String,
  opening_hours:String,
  latitude:String,
  location:{
    type:{type:String},
    coordinates:[Number]
  }
}, {collection: 'NewAreaList' });
areasSchema.index({ "location": "2dsphere" });
areasSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Areas', areasSchema);