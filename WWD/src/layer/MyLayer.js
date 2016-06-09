/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports MyLayer
 * @version $Id: OSMLayer.js 3120 2016-05-17 12:32:45Z rsirac $
 */
define([
        '../geom/Angle',
        '../util/Color',
        '../geom/Location',
        '../geom/Sector',
        './OpenStreetMapImageLayer'
    ],
    function (Angle,
              Color,
              Location,
              Sector,
              OpenStreetMapImageLayer) {
        "use strict";

        /**
         * Constructs a layer based on OpenStreetMapImageLayer.
         * @alias MyLayer
         * @constructor
         * @augments OpenStreetMapImageLayer
         * @classdesc Provides a layer that shows our own imagery.
         *
         * @param {String} displayName This layer's display name. "Open Street Map" if this parameter is
         * null or undefined.
         * @param {String} baseUrl The url where tiles are stored
         * @param {Boolean} reverseFlag This flags shows if (0,0) is top-left corner (true) or bottom-left corner (false)
         */
        var MyLayer = function (displayName, baseUrl, reverseFlag) {

            // this.imageSize = 256;
            displayName = displayName || "Open Street Map";

            OpenStreetMapImageLayer.call(this,
                new Sector(-85.05, 85.05, -180, 180), new Location(85.05, 180), 19, "image/png", displayName,
                this.imageSize, this.imageSize);

            this.reverseFlag = reverseFlag;


            this.urlBuilder = {
                urlForTile: function (tile, imageFormat) {
                    var row = tile.row;
                    if (reverseFlag) {
                        row = Math.pow(2,tile.level.levelNumber+1)-tile.row-1;
                    }
                    return baseUrl+row+"/"+tile.column+"/"+(tile.level.levelNumber+1);
                }
            };
        };

        MyLayer.prototype = Object.create(OpenStreetMapImageLayer.prototype);

        // OSMLayer.prototype.doRender = function (dc) {
        //     OpenStreetMapImageLayer.prototype.doRender.call(this, dc);
        //     if (this.inCurrentFrame) {
        //         dc.screenCreditController.addStringCredit("\u00A9OSM", Color.DARK_GRAY);
        //         dc.screenCreditController.addStringCredit("Tiles Courtesy of MapQuest", Color.DARK_GRAY);
        //     }
        // };

        // Overridden from OpenStreetMapImageLayer.
        MyLayer.prototype.createTopLevelTiles = function (dc) {
            this.topLevelTiles = [];

            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 0, 0));
            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 0, 1));
            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 1, 0));
            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 1, 1));
        };

        // Determines the Bing map size for a specified level number.
        MyLayer.prototype.mapSizeForLevel = function (levelNumber) {
            return 256 << (levelNumber + 1);
        };

        return MyLayer;
    }
)
;
