/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: BasicExample.js 3320 2015-07-15 20:53:05Z dcollins $
 */

requirejs(['../src/WorldWind',
        './LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        // NASA layers
        var wmtsCapabilitiesNASA1,
            wmtsCapabilitiesNASA2,
            wmtsCapabilitiesNASA3;

        // IGN layers
        var wmtsCapabilitiesIGN1,
            wmtsCapabilitiesIGN2,
            wmtsCapabilitiesIGN3;

        $.get('http://map1.vis.earthdata.nasa.gov/wmts-webmerc/wmts.cgi?SERVICE=WMTS&request=GetCapabilities', function (response) {
            // $.get('http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?SERVICE=WMTS&request=GetCapabilities', function (response) { //THIS FILE DOESN'T WORK UNTIL ZOOM LEVEL 3

            var wmtsCapabilities = new WorldWind.WmtsCapabilities(response);
            wmtsCapabilities.contents.layer[0].title[0].value = "Snow Water Equivalent";
            wmtsCapabilities.contents.layer[1].title[0].value = "Columnar Cloud Liquid Water Day";
            wmtsCapabilities.contents.layer[2].title[0].value = "Columnar Cloud Liquid Water Night";
            wmtsCapabilitiesNASA1 = wmtsCapabilities.contents.layer[0];
            wmtsCapabilitiesNASA2 = wmtsCapabilities.contents.layer[1];
            wmtsCapabilitiesNASA3 = wmtsCapabilities.contents.layer[2];
        })
            .done(function () {

                $.get('http://wxs.ign.fr/icugki0buh1mxm586u1zzztg/geoportail/wmts?SERVICE=WMTS&REQUEST=GetCapabilities', function(response) {
                    var wmtsCapabilities = new WorldWind.WmtsCapabilities(response);
                    wmtsCapabilitiesIGN1 = wmtsCapabilities.contents.layer[0];
                    wmtsCapabilitiesIGN2 = wmtsCapabilities.contents.layer[1];
                    wmtsCapabilitiesIGN3 = wmtsCapabilities.contents.layer[2];
                })
                    .done(function () {

                        var layers = [

                            // Internal layer
                            {layer: new WorldWind.BMNGLandsatLayer(), enabled: true},

                            // WMTS layers
                            {layer: new WorldWind.WmtsLayer(wmtsCapabilitiesNASA1, "", "", "2016-06-08"), enabled: false},
                            {layer: new WorldWind.WmtsLayer(wmtsCapabilitiesNASA2, "", "", "2016-06-08"), enabled: false},
                            {layer: new WorldWind.WmtsLayer(wmtsCapabilitiesNASA3, "", "", "2016-06-08"), enabled: false},
                            {layer: new WorldWind.WmtsLayer(wmtsCapabilitiesIGN3), enabled: false},
                            {layer: new WorldWind.WmtsLayer(wmtsCapabilitiesIGN1), enabled: false},
                            {layer: new WorldWind.WmtsLayer(wmtsCapabilitiesIGN2), enabled: false},

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
    });