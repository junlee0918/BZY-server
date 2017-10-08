var express = require('express')
var app = express()
var Area = require('./models/area.js')
var _=require('underscore-node')
var regexp = require('node-regexp')

exports.getAreasByCategory = function(req, res)
{
    Area.find({categories: new RegExp(req.params.keystr, "i")}, function(err, areas) {
        console.log(areas.length);
        if (err) {
            res.json({'status':'error'});
            return;
        }
        if(areas) {
            res.json({'status':'success', 'areas':areas});
            return;
        } 
        else{
            res.json({'status':'no_exist'})
            return;
        }
    })
}

exports.getAreasNearby = function(req, res)
{
    console.log(req.params);

    var lat = Number(req.params.lat);
    var lng = Number(req.params.lng);
    var distance = Number(req.params.distance);

    Area.aggregate(
      [
        { "$geoNear": {
            "near": {
              "type": "Point",
              "coordinates": [ lng, lat ]
            },
            "query": { "location.type": "Point" },
            "spherical": true,
            "distanceField": "distance",
            "maxDistance": distance
        }}
      ],
      function(err,result) {
        if (err) throw err;
        console.log(result.length);
        res.json({'status':'success', 'areas':result});
        return;
      }
    );
}

exports.getAreasByCategoryPagination = function(req, res)
{
    console.log(req.params);

    var category = req.params.category;
    var lat = Number(req.params.lat);
    var lng = Number(req.params.lng);
    var page = Number(req.params.page);
    var limit = Number(req.params.limit);
    var skip = limit * page;
    Area.aggregate(
      [
        { "$geoNear": {
            "near": {
              "type": "Point",
              "coordinates": [ lng, lat ]
            },
            "query": { "location.type": "Point", "categories": new RegExp(category, "i") },
            "spherical": true,
            "distanceField": "distance"
        }},
        { "$skip": skip },
        { "$limit": limit }

      ],
      function(err,result) {
        if (err) throw err;

        console.log(result.length);
        res.json({'status':'success', 'areas':result});
        return;
      }
    );
}

exports.getAreasByBusyOption = function(req, res)
{
    console.log(req.params);

    var category = req.params.category;
    var option = req.params.option == "BUSY" ? "$gte" : "$lt";
    var strDay = "popular_times." + req.params.day;
    var strTime = req.params.time;
    var lat = Number(req.params.lat);
    var lng = Number(req.params.lng);
    var page = Number(req.params.page);
    var limit = Number(req.params.limit);
    var skip = limit * page;

    console.log("category - " + category);
    console.log("option - " + option);
    console.log("strDay - " + strDay);
    console.log("strTime - " + strTime);

    Area.aggregate(
      [
        { "$geoNear": {
            "near": {
              "type": "Point",
              "coordinates": [ lng, lat ]
            },
            "query": { 
                "categories": new RegExp(category, "i"),
                "location.type": "Point", 
                
                [strDay]: {"$exists": true}, 
                [strDay]: {
                    "$elemMatch": {
                        "time": strTime, 
                        "hight": { [option]: 30.0 }
                    }
                } 
            },
            "spherical": true,
            "distanceField": "distance",
        }},
        { "$skip": skip },
        { "$limit": limit }
      ],
      function(err,result) {
        if (err) throw err;

        console.log(result.length);
        res.json({'status':'success', 'areas':result});
        return;
      }
    );
}

exports.test = function(req, res)
{
    console.log(req.params);

    Area.aggregate(
      [
        { "$geoNear": {
            "near": {
              "type": "Point",
              "coordinates": [ 50, 50 ]
            },
            "query": { "location.type": "Point", "categories": new RegExp("bar", "i") },
            "spherical": true,
            "distanceField": "dis"
        }},
        { "$skip": 0 },
        { "$limit": 155 }

      ],
      function(err,shapes) {
        if (err) throw err;
        console.log( shapes.length );

        res.json(shapes);

      }
    );
}