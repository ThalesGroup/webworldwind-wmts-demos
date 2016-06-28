/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports TmsLayer
 */
define([
        '../error/ArgumentError',
        '../geom/Location',
        '../util/Logger',
        '../geom/Sector',
        '../cache/MemoryCache',
        '../render/Texture',
        '../layer/TiledImageLayer',
        '../util/WmsUrlBuilder',
        '../util/WWMath',
        '../util/WWUtil'
    ],
    function (ArgumentError,
              Location,
              Logger,
              Sector,
              MemoryCache,
              Texture,
              TiledImageLayer,
              WmsUrlBuilder,
              WWMath,
              WWUtil
    ) {
        "use strict";


        var TmsLayer = function (layerCaps, displayName) {

            if (!layerCaps) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayer", "constructor",
                        "No layer configuration specified."));
            }

            TiledImageLayer.call(
                this,
                new Sector(layerCaps.extent[0], layerCaps.extent[2], layerCaps.extent[1], layerCaps.extent[3]),
                new Location(36, 36), // TODO: How to determine best delta
                18,
                layerCaps.imageFormat,
                layerCaps.cachePath,
                layerCaps.tileSize,
                layerCaps.tileSize
            );

            this.displayName = displayName || layerCaps.layerName ||"TMS Layer";
            
            // Determine image format
            var format = WWUtil.suffixForMimeType(layerCaps.imageFormat);

            if (!format) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayer", "constructor",
                        "No image format supported."));
            }



            this.projection = layerCaps.projection;


            this.urlBuilder = {
                urlForTile: function (tile, imageFormat) {
                    // Todo
                    if (TmsLayer.isEpsg4326Crs(layerCaps.projection)) {
                        return layerCaps.url + layerCaps.layerName + "@" + layerCaps.matrixSet + "/" +
                            (tile.level.levelNumber) + "/" + tile.column + "/" + (tile.row) + "." + format;
                    }
                    else {
                        return layerCaps.url + layerCaps.layerName + "@" + layerCaps.matrixSet + "/" +
                            (tile.level.levelNumber + 1) + "/" + tile.column + "/" + (tile.row) + "." + format;
                    }
                }
            };

            this.detailControl = 0.5;


            this.imageSize = layerCaps.tileSize;
            this.origin = layerCaps.origin;
            this.sector = new Sector(layerCaps.extent[1], layerCaps.extent[3], layerCaps.extent[0], layerCaps.extent[2]);

            // Compute the matrix width / height
            this.nbTilesWidth = [];
            this.nbTilesHeight = [];
            for (var i = 0; i < layerCaps.resolutions.length ; i++) {
                var unitWidth = layerCaps.tileSize * layerCaps.resolutions[i];
                var unitHeight = layerCaps.tileSize * layerCaps.resolutions[i];
                this.nbTilesWidth.push(Math.ceil((layerCaps.extent[2]-layerCaps.extent[0]-0.01*unitWidth)/unitWidth));
                this.nbTilesHeight.push(Math.ceil((layerCaps.extent[3]-layerCaps.extent[1]-0.01*unitHeight)/unitHeight));
            }
        };

        TmsLayer.prototype = Object.create(TiledImageLayer.prototype);

        TmsLayer.prototype.doRender = function (dc) {
            TiledImageLayer.prototype.doRender.call(this, dc);
        };


        // Overridden from TiledImageLayer.
        TmsLayer.prototype.createTopLevelTiles = function (dc, projection) {

            this.topLevelTiles = [];

            // Todo
            if (TmsLayer.isEpsg4326Crs(this.projection)) {
                for (var j = 0; j < this.nbTilesHeight[0]; j++) {
                    for (var i = 0; i < this.nbTilesWidth[0]; i++) {
                        this.topLevelTiles.push(this.createTile(this.sector, this.levels.firstLevel(), j, i));
                    }
                }
            }
            else {
                for (var j = 0; j <= this.nbTilesHeight[0]; j++) {
                    for (var i = 0; i <= this.nbTilesWidth[0]; i++) {
                        this.topLevelTiles.push(this.createTile(this.sector, this.levels.firstLevel(), j, i));
                    }
                }
            }



            // this.topLevelTiles.push(this.createTile(new Sector(-85.05121885855424, 0.35156233340332066, -180, 0.3515645394494346), this.levels.firstLevel(), 1, 0));
            // this.topLevelTiles.push(this.createTile(new Sector(-85.05121885855424, 0.35156233340332066, -0.3515645394494346, 180), this.levels.firstLevel(), 1, 1));
            // this.topLevelTiles.push(this.createTile(new Sector(-0.35156233340332066, 85.05121885855424, -180, 0.3515645394494346), this.levels.firstLevel(), 0, 0));
            // this.topLevelTiles.push(this.createTile(new Sector(-0.35156233340332066, 85.05121885855424, -0.3515645394494346, 180), this.levels.firstLevel(), 0, 1));

            // this.topLevelTiles.push(this.createTile(new Sector(66.4433147615984, 85.05121885855424, -180, -89.82473982933192), this.levels.levels[1] , 3, 0));
            // this.topLevelTiles.push(this.createTile(new Sector(0, 66.58342515254901, -180, -89.82473982933192), this.levels.levels[1] , 2, 0));
            // this.topLevelTiles.push(this.createTile(new Sector(-66.5134685179377, 0.17578199396699903, -180, -89.82473982933192), this.levels.levels[1] , 1, 0));
            // this.topLevelTiles.push(this.createTile(new Sector(-85.05121885855424, -66.44331476159842, -180, -89.82473982933192), this.levels.levels[1] , 0, 0));
            // this.topLevelTiles.push(this.createTile(new Sector(66.4433147615984, 85.05121885855424, -90.17630436878135, 0), this.levels.levels[1] , 3, 1));
            // this.topLevelTiles.push(this.createTile(new Sector(0, 66.58342515254901, -90.17630436878135, 0), this.levels.levels[1] , 2, 1));
            // this.topLevelTiles.push(this.createTile(new Sector(-66.5134685179377, 0.17578199396699903, -90.17630436878135, 0), this.levels.levels[1] , 1, 1));
            // this.topLevelTiles.push(this.createTile(new Sector(-85.05121885855424, -66.44331476159842, -90.17630436878135, 0), this.levels.levels[1] , 0, 1));
            // this.topLevelTiles.push(this.createTile(new Sector(66.4433147615984, 85.05121885855424, -0.1757822697247173, 90.00052209905664), this.levels.levels[1] , 3, 2));
            // this.topLevelTiles.push(this.createTile(new Sector(0, 66.58342515254901, -0.1757822697247173, 90.00052209905664), this.levels.levels[1] , 2, 2));
            // this.topLevelTiles.push(this.createTile(new Sector(-66.5134685179377, 0.17578199396699903, -0.1757822697247173, 90.00052209905664), this.levels.levels[1] , 1, 2));
            // this.topLevelTiles.push(this.createTile(new Sector(-85.05121885855424, -66.44331476159842, -0.1757822697247173, 90.00052209905664), this.levels.levels[1] , 0, 2));
            // this.topLevelTiles.push(this.createTile(new Sector(66.4433147615984, 85.05121885855424, 89.82473982933192, 180), this.levels.levels[1] , 3, 3));
            // this.topLevelTiles.push(this.createTile(new Sector(0, 66.58342515254901, 89.82473982933192, 180), this.levels.levels[1] , 2, 3));
            // this.topLevelTiles.push(this.createTile(new Sector(-66.5134685179377, 0.17578199396699903, 89.82473982933192, 180), this.levels.levels[1] , 1, 3));
            // this.topLevelTiles.push(this.createTile(new Sector(-85.05121885855424, -66.44331476159842, 89.82473982933192, 180), this.levels.levels[1] , 0, 3));


            /*
             TmsLayer.js:258 (2, 2, 0) : (-0.35156233340332066, 42.34982826257546, -180, -89.82421773027528)
             TmsLayer.js:258 (2, 2, 1) : (-0.35156233340332066, 42.34982826257546, -89.82421773027528, 0.3515645394494346)
             TmsLayer.js:258 (2, 3, 0) : (42.34982826257546, 85.05121885855424, -180, -89.82421773027528)
             TmsLayer.js:258 (2, 3, 1) : (42.34982826257546, 85.05121885855424, -89.82421773027528, 0.3515645394494346)
             TmsLayer.js:258 (2, 2, 2) : (-0.35156233340332066, 42.34982826257546, -0.3515645394494346, 89.82421773027528)
             TmsLayer.js:258 (2, 2, 3) : (-0.35156233340332066, 42.34982826257546, 89.82421773027528, 180)
             TmsLayer.js:258 (2, 3, 2) : (42.34982826257546, 85.05121885855424, -0.3515645394494346, 89.82421773027528)
             TmsLayer.js:258 (2, 3, 3) : (42.34982826257546, 85.05121885855424, 89.82421773027528, 180)
             TmsLayer.js:258 (2, 0, 0) : (-85.05121885855424, -42.34982826257546, -180, -89.82421773027528)
             TmsLayer.js:258 (2, 0, 1) : (-85.05121885855424, -42.34982826257546, -89.82421773027528, 0.3515645394494346)
             TmsLayer.js:258 (2, 1, 0) : (-42.34982826257546, 0.35156233340332066, -180, -89.82421773027528)
             TmsLayer.js:258 (2, 1, 1) : (-42.34982826257546, 0.35156233340332066, -89.82421773027528, 0.3515645394494346)
             TmsLayer.js:258 (2, 0, 3) : (-85.05121885855424, -42.34982826257546, 89.82421773027528, 180)
             TmsLayer.js:258 (2, 1, 3) : (-42.34982826257546, 0.35156233340332066, 89.82421773027528, 180)
             TmsLayer.js:258 (2, 0, 2) : (-85.05121885855424, -42.34982826257546, -0.3515645394494346, 89.82421773027528)
             TmsLayer.js:258 (2, 1, 2) : (-42.34982826257546, 0.35156233340332066, -0.3515645394494346, 89.82421773027528)
             */
        };

        TmsLayer.isEpsg4326Crs = function (crs) {
            return ((crs.indexOf("EPSG") >= 0) && (crs.indexOf("4326") >= 0));
        };

        TmsLayer.isEpsg3857Crs = function (crs) {
            return (crs.indexOf("EPSG") >= 0)
                && ((crs.indexOf("3857") >= 0) || (crs.indexOf("900913") >= 0)); // 900913 is google's 3857 alias
        };

        TmsLayer.isOGCCrs84 = function (crs) {
            return (crs.indexOf("OGC") >= 0) && (crs.indexOf("CRS84") >= 0);
        };

        TmsLayer.prototype.createTexture = function (dc, tile, image) {
            if (TmsLayer.isEpsg4326Crs(this.projection)) {
                return new Texture(dc.currentGlContext, image);
            } else if (TmsLayer.isEpsg3857Crs(this.projection)) {
                return this.createTexture3857(dc, tile, image);
            }
            else if (TmsLayer.isOGCCrs84(this.projection)) {
                return new Texture(dc.currentGlContext, image);
            }
        };

        TmsLayer.prototype.createTile = function (sector, level, row, column) {
            if (TmsLayer.isEpsg4326Crs(this.projection)) {
                return this.createTile4326(sector, level, row, column);
            } else if (TmsLayer.isEpsg3857Crs(this.projection)) {
                return this.createTile3857(sector, level, row, column);
            }
            else if (TmsLayer.isOGCCrs84(this.projection)) {
                return TiledImageLayer.prototype.createTile.call(this, sector, level, row, column);
            }
        };

        TmsLayer.prototype.createTile4326 = function (sector, level, row, column) {
            var tileDeltaLat = this.sector.deltaLatitude() / this.nbTilesHeight[level.levelNumber], // TODO: calculate from metadata
                tileDeltaLon = this.sector.deltaLongitude() / this.nbTilesWidth[level.levelNumber],

                //Todo
                maxLat = this.sector.maxLatitude - (this.nbTilesHeight[level.levelNumber]-row-1) * tileDeltaLat, // Origin bottom left
                // maxLat = this.sector.maxLatitude - row * tileDeltaLat, // Origin top left
                minLat = maxLat - tileDeltaLat,
                minLon = this.origin[0] + tileDeltaLon * column,
                maxLon = minLon + tileDeltaLon;

            var sector = new Sector(minLat, maxLat, minLon, maxLon);
            console.log("CreateTile4326 ("+(level.levelNumber)+", "+row+", "+column+") : ("+minLat+", "+maxLat+", "+minLon+", "+maxLon+")");

            return TiledImageLayer.prototype.createTile.call(this, sector, level, row, column);
        };


        TmsLayer.prototype.createTile3857 = function (sector, level, row, column) {
            var mapSize = this.mapSizeForLevel(level.levelNumber),
                swX = WWMath.clamp(column * this.imageSize, 0, mapSize),
                //Todo
                // neY = WWMath.clamp(row * this.imageSize, 0, mapSize), //Origin top left
                neY = WWMath.clamp(mapSize - (row+1) * this.imageSize, 0, mapSize), //Origin bottom left
                neX = WWMath.clamp(swX + (this.imageSize), 0, mapSize),
                swY = WWMath.clamp(neY + (this.imageSize), 0, mapSize),
                x, y, swLat, swLon, neLat, neLon;

            x = (swX / mapSize) - 0.5;
            y = 0.5 - (swY / mapSize);
            swLat = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
            swLon = 360 * x;

            x = (neX / mapSize) - 0.5;
            y = 0.5 - (neY / mapSize);
            neLat = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
            neLon = 360 * x;

            sector = new Sector(swLat, neLat, swLon, neLon);

            // console.log("CreateTile3857 ("+(level.levelNumber+1)+", "+row+", "+column+") : ("+swLat+", "+neLat+", "+swLon+", "+neLon+")");
            return TiledImageLayer.prototype.createTile.call(this, sector, level, row, column);
        };

        // Todo
        TmsLayer.prototype.mapSizeForLevel = function (levelNumber) {
            return 256 << (levelNumber + 1);
        };



        TmsLayer.prototype.createTexture3857 = function (dc, tile, image) {
            // console.log("("+(tile.level.levelNumber+1)+", "+tile.row+", "+tile.column+") : ("+tile.sector.minLatitude+", "+tile.sector.maxLatitude+", "+tile.sector.minLongitude+", "+tile.sector.maxLongitude+")");
            if (!this.destCanvas) {
                // Create a canvas we can use when unprojecting retrieved images.
                this.destCanvas = document.createElement("canvas");
                this.destContext = this.destCanvas.getContext("2d");
            }

            var srcCanvas = dc.canvas2D,
                srcContext = dc.ctx2D,
                srcImageData,
                destCanvas = this.destCanvas,
                destContext = this.destContext,
                destImageData = destContext.createImageData(image.width, image.height),
                sector = tile.sector,
                tMin = WWMath.gudermannianInverse(sector.minLatitude),
                tMax = WWMath.gudermannianInverse(sector.maxLatitude),
                lat, g, srcRow, kSrc, kDest, sy, dy;


            srcCanvas.width = image.width;
            srcCanvas.height = image.height;
            destCanvas.width = image.width;
            destCanvas.height = image.height;

            // Draw the original image to a canvas so image data can be had for it.
            srcContext.drawImage(image, 0, 0, image.width, image.height);
            srcImageData = srcContext.getImageData(0, 0, image.width, image.height);

            // Unproject the retrieved image.
            for (var n = 0; n < 1; n++) {
                for (var y = 0; y < image.height; y++) {
                    sy = 1 - y / (image.height - 1);
                    lat = sy * sector.deltaLatitude() + sector.minLatitude;
                    g = WWMath.gudermannianInverse(lat);
                    dy = 1 - (g - tMin) / (tMax - tMin);
                    dy = WWMath.clamp(dy, 0, 1);
                    srcRow = Math.floor(dy * (image.height - 1));
                    for (var x = 0; x < image.width; x++) {
                        kSrc = 4 * (x + srcRow * image.width);
                        kDest = 4 * (x + y * image.width);

                        destImageData.data[kDest] = srcImageData.data[kSrc];
                        destImageData.data[kDest + 1] = srcImageData.data[kSrc + 1];
                        destImageData.data[kDest + 2] = srcImageData.data[kSrc + 2];
                        destImageData.data[kDest + 3] = srcImageData.data[kSrc + 3];
                    }
                }
            }

            destContext.putImageData(destImageData, 0, 0);

            return new Texture(dc.currentGlContext, destCanvas);
        };

        

        return TmsLayer;
    }
);