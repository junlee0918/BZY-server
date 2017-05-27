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

exports.getAreasByCategoryPagination = function(req, res)
{
    console.log(req.params);

    var category = req.params.category;
    var page = req.params.page;
    var limit = Number(req.params.limit);
    var skip = limit * page;
    var lat = Number(req.params.lat);
    var lng = Number(req.params.lng);

    console.log(limit);
    // Area.paginate({categories: new RegExp(strCategory, "i"), location: {coordinates : { $near : [50,50]} }      }, { page: page, limit: limit }, function(err, result) {
    //   if (err) {
    //     console.error(err);
    //   } else {
    //     console.log(result.length);
    //     res.json({'status':'success', 'areas':result});
    //         return;
    //   }
    // })


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
        //console.log( shapes );

        // shapes = shapes.map(function(x) {
        //   delete x.dis;
        //   return new Shape( x );
        // });
        console.log(result.length);
        res.json({'status':'success', 'areas':result});
        return;

      }
    );
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

exports.test = function(req, res)
{
    console.log(req.params);

    // var geoJson             = {};
    // geoJson.type            = "Point";
    // geoJson.coordinates     = [50, 50];

    // // setup options for query
    // var options             = {};
    // options.spherical       = true;
    // options.maxDistance     = 1000000000;
    // options.limit           = 10;
    // options.skip            = 1;
    // // you can put any query here to further refine the result.
    // options.query = { "location.type": "Point", "categories": new RegExp("bar", "i") };

    // // query db with mongoose geoNear wrapper
    // Area.geoNear(geoJson, options, function (err, results, stats) {
    //     if (err)
    //         res.send(err);
    //     res.json(results);
    // });

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

        // shapes = shapes.map(function(x) {
        //   delete x.dis;
        //   return new Shape( x );
        // });

        res.json(shapes);

      }
    );


    // Area.find({
    //   location: {
    //     $near: [50, 50] ,
    //     $maxDistance: 1/111.12
    //   }
    // }).limit(10).exec(function(err, locations) {
    //   if (err) {
    //     return res.json(500, err);
    //   }

    //   res.json(200, locations);
    // });

}