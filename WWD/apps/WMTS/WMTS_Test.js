/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: WMTS_GeoService.js 2016-06-09 rsirac $
 */

requirejs(['../../src/WorldWind',
        '../../examples/LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        ww.configuration.baseUrl += "../";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        // NOAA layers
        var wmtsCapabilitiesGeoService1;

        $.get('http://thales-geo.github.io/webworldwind-demos/WMTS-TESTS/bluemarble/wmts-getcapabilities.xml', function (response) {

            var wmtsCapabilities = new WorldWind.WmtsCapabilities(response);
            wmtsCapabilitiesGeoService1 = wmtsCapabilities.contents.layer[0];

        })
            .done(function () {

                var layers = [
                    // WMTS layers
                    {layer: new WorldWind.WmtsLayer(WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilitiesGeoService1)), enabled: true},

                    // Internal layers
                    {layer: new WorldWind.CompassLayer(), enabled: true},
                    {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
                    {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
                ];

                for (var l = 0; l < layers.length; l++) {
                    layers[l].layer.enabled = layers[l].enabled;
                    wwd.addLayer(layers[l].layer);
                }


                // Create a layer manager for controlling layer visibility.
                var layerManager = new LayerManager(wwd);

            });
    });