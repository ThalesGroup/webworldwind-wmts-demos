/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WmtsLayerCaps
 */
define(['../error/ArgumentError',
        '../util/Logger',
        './WmtsLayer'],
    function (ArgumentError,
              Logger,
              WmtsLayer) {
        "use strict";

        var WmtsLayerCaps = function (layerName, title, format, url, style, matrixSet, prefix, projection, options) {

            // Layer name
            this.identifier = layerName;
            this.title = title ? [{value : title}] : [{value : layerName}];
            if (!this.title) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No layer name provided."));
            }

            // Format
            this.format = [format];
            if (!this.format) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No image format provided."));
            }

            // URL
            if (!url) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No url provided."));
            }
            this.capabilities = {
                operationsMetadata : {
                    operation : [{
                        name : "GetTile",
                        dcp : [{
                            http : {
                                get : [{
                                    href : url
                                }]
                            }
                        }]
                    }]
                }
            };

            // Style
            var styleName = (!style) ? "default" : style;
            this.style = [{identifier:styleName, isDefault:"true"}];

            // TileMatrixSet
            if (!matrixSet) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No matrixSet provided."));
            }
            if (!projection) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No projection provided."));
            }
            if (!options.extent || options.extent.length != 4) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No extent provided."));
            }

            var boundingBox = {
                lowerCorner : [options.extent[0], options.extent[1]],
                upperCorner : [options.extent[2], options.extent[3]]
            };


            if (!options.resolutions) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No resolutions provided."));
            }
            if (!options.tileSize) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No tile size provided."));
            }
            if (!options.topLeftCorner || options.topLeftCorner.length != 2) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No ex" +
                        "tent provided."));
            }


            if (!(WmtsLayer.isEpsg4326Crs(projection) || WmtsLayer.isOGCCrs84(projection) || WmtsLayer.isEpsg3857Crs(projection))) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "Projection provided not supported."));
            }

            var tileMatrixSet = [],
                scale;

            for (var i = 0; i < options.resolutions.length; i++) {
                if (WmtsLayer.isEpsg4326Crs(projection) || WmtsLayer.isOGCCrs84(projection)) {
                    scale = options.resolutions[i] * 6378137.0 * 2.0 * Math.PI / 360 / 0.00028;
                } else if (WmtsLayer.isEpsg3857Crs(projection)) {
                    scale = options.resolutions[i] / 0.00028;
                }

                // Compute the matrix width / height
                var unitWidth = options.tileSize * options.resolutions[i];
                var unitHeight = options.tileSize * options.resolutions[i];
                var matrixWidth = Math.ceil((options.extent[2]-options.extent[0]-0.01*unitWidth)/unitWidth);
                var matrixHeight = Math.ceil((options.extent[3]-options.extent[1]-0.01*unitHeight)/unitHeight);

                // Define the tile matrix
                var tileMatrix = {
                    identifier : prefix ? matrixSet+":"+i : i,
                    levelNumber : i,
                    matrixHeight : matrixHeight,
                    matrixWidth : matrixWidth,
                    tileHeight : options.tileSize,
                    tileWidth : options.tileSize,
                    topLeftCorner : options.topLeftCorner,
                    scaleDenominator : scale
                };


                tileMatrixSet.push(tileMatrix);
            }

            // Define the tileMatrixSetRef
            var tileMatrixSetRef = {
                identifier:matrixSet,
                supportedCRS:projection,
                boundingBox : boundingBox,
                tileMatrix : tileMatrixSet
            };

            // Define the tileMatrixSetLink
            this.tileMatrixSetLink = [{
                tileMatrixSet : matrixSet,
                tileMatrixSetRef:tileMatrixSetRef
            }];
        };

        return WmtsLayerCaps;

    });