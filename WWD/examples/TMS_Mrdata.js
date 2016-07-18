/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: TMS_Mrdata.js 2016-07-01 rsirac $
 */

requirejs(['../src/WorldWind',
        './MyLayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        var TmsCapabilities;
        var tmsLayer1;
        var tmsLayer2;
        var tmsLayer3;
        var tmsLayer4;
        var tmsLayer5;

        var deferred = $.Deferred();

        var maxResolution4326 = 0.703125;
        var resolutions4326 = [];
        for (var i = 0; i < 18; i++) {
            resolutions4326.push(maxResolution4326/Math.pow(2,i));
        }
        var CapsForTms = new WorldWind.TmsLayerCaps({
            extent : [-180, -90, 180, 90],
            resolutions : resolutions4326,
            origin: [-180, -90],
            imageFormat : "image/png",
            projection : "EPSG:4326",
            tileSize : 256,
            matrixSet : "WGS84",
            layerName : "GEBCO_08_Grid",
            url : "http://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapcache/tms/1.0.0/"
        });


        var matrixset = WorldWind.WmtsLayer.createTileMatrixSet(
                {
                        matrixSet : "EPSG:4326",
                        prefix : true,
                        projection : "EPSG:4326",
                        topLeftCorner: [90, -180],
                        extent: [-180, -90, 180, 90],
                        resolutions: resolutions4326,
                        tileSize: 256
                }
            );
         var wmtsLayer = new WorldWind.WmtsLayer(
                {
                        identifier : "eoc:world_relief_bw",
                        url : "https://tiles.geoservice.dlr.de/service/wmts?",
                        format : "image/png",
                        tileMatrixSet : matrixset,
                        style : "default",
                        title : "World Relief"
                }
            );


        $.get('http://mrdata.usgs.gov/mapcache/tms/1.0.0/', function(response) {

            console.log(response);
            TmsCapabilities = new WorldWind.TmsCapabilities(response);
        })
            .then (function () {
                $.when.apply($, TmsCapabilities.promises).done(function () {

                        tmsLayer1 = new WorldWind.TmsLayerCaps(TmsCapabilities.tileMaps[0]);
                        tmsLayer2 = new WorldWind.TmsLayerCaps(TmsCapabilities.tileMaps[3]);
                        tmsLayer3 = new WorldWind.TmsLayerCaps(TmsCapabilities.tileMaps[6]);
                        tmsLayer4 = new WorldWind.TmsLayerCaps(TmsCapabilities.tileMaps[12]);
                        tmsLayer5 = new WorldWind.TmsLayerCaps(TmsCapabilities.tileMaps[15]);

                        deferred.resolve();
                    }
                );
            });


        // .then(function () {
        $.when($,deferred).done(function () {

                // Internal layer
                var layers = [
                    {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
                    {layer: wmtsLayer, enabled: true},
                    {layer: new WorldWind.TmsLayer(tmsLayer1, "akgeol"), enabled: false, selected : true},
                    {layer: new WorldWind.TmsLayer(tmsLayer2, "sim3340"), enabled: false, selected : true},
                    {layer: new WorldWind.TmsLayer(tmsLayer3, "alteration"), enabled: false, selected : true},
                    {layer: new WorldWind.TmsLayer(tmsLayer4, "mrds"), enabled: true, selected : true},
                    {layer: new WorldWind.TmsLayer(tmsLayer5, "magnetic"), enabled: false, selected : true},
                    {layer: new WorldWind.CompassLayer(), enabled: true},
                    {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
                    {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
                    ];



                for (var l = 0; l < layers.length; l++) {
                    layers[l].layer.enabled = layers[l].enabled;
                    layers[l].layer.layerSelected = layers[l].selected;
                    wwd.addLayer(layers[l].layer);
                }


                // Create a layer manager for controlling layer visibility.
                var layerManager = new LayerManager(wwd);

            });
    });
