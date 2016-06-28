/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WmtsLayerCaps
 */
define(['../error/ArgumentError',
        '../util/Logger'],
    function (ArgumentError,
              Logger) {
        "use strict";



        var TmsLayerCaps = function (layerCaps) {

            if (!layerCaps) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayerCaps", "constructor",
                        "No layer configuration specified."));
            }

            // Define the extent / bounding box
            if (!layerCaps.extent) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayerCaps", "constructor",
                        "No extent provided in the configuration."));
            }
            this.extent = layerCaps.extent;

            // Resolutions array
            if (!layerCaps.resolutions) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayerCaps", "constructor",
                        "No resolutions provided in the configuration."));
            }
            this.resolutions = layerCaps.resolutions;

            // Origin
            if (!layerCaps.origin) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayerCaps", "constructor",
                        "No origin provided in the configuration."));
            }
            this.origin = layerCaps.origin;

            // Image format
            if (!layerCaps.imageFormat) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayerCaps", "constructor",
                        "No image format provided in the configuration."));
            }
            this.imageFormat = layerCaps.imageFormat;

            // Projection
            if (!layerCaps.projection) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayerCaps", "constructor",
                        "No projection provided in the configuration."));
            }
            this.projection = layerCaps.projection;

            // Tile size
            if (!layerCaps.tileSize) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayerCaps", "constructor",
                        "No tile size provided in the configuration."));
            }
            this.tileSize = layerCaps.tileSize;

            // Matrix set
            if (!layerCaps.matrixSet) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayerCaps", "constructor",
                        "No matrixSet provided in the configuration."));
            }
            this.matrixSet = layerCaps.matrixSet;

            // Layer name
            if (!layerCaps.layerName) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayerCaps", "constructor",
                        "No layer name provided in the configuration."));
            }
            this.layerName = layerCaps.layerName;

            // Url
            if (!layerCaps.url) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayerCaps", "constructor",
                        "No url provided."));
            }
            this.url = layerCaps.url;

            // Cache path
            this.cachePath =  layerCaps.url+layerCaps.layerName+"@"+layerCaps.matrixSet;
        };


        return TmsLayerCaps;

    });