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
                    {layer: new WorldWind.BMNGLandsatLayer(), enabled: true},
                    {layer: new WorldWind.TmsLayer(tmsLayer1, "Alaska akgeol"), enabled: false, selected : true},
                    {layer: new WorldWind.TmsLayer(tmsLayer2, "Alaska sim3340"), enabled: false, selected : true},
                    {layer: new WorldWind.TmsLayer(tmsLayer3, "Alaska alteration"), enabled: false, selected : true},
                    {layer: new WorldWind.TmsLayer(tmsLayer4, "Alaska mrds"), enabled: false, selected : true},
                    {layer: new WorldWind.TmsLayer(tmsLayer5, "Alaska magnetic"), enabled: false, selected : true},
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