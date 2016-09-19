/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: TMS_Mrdata.js 2016-07-01 rsirac $
 */

requirejs(['../src/WorldWind',
        './LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");



        {
            var wmsConfGeoServer1;
            var wmsConfGeoServer2;
            var wmsConfGeoServer3;
            var wmsConfGeoServer4;
            var wmsConfGeoServer5;
            var wmsConfGeoServer6;
            var wmsConfGeoServer7;
            var wmsConfGeoServer8;
            var wmsConfGeoServer9;
            var wmsConfGeoServer10;
            var wmsConfGeoServer11;
            var wmsConfGeoServer12;
            var wmsConfGeoServer13;
            var wmsConfGeoServer14;
            var wmsConfGeoServer15;

            var wmsConfMapCache1;
            var wmsConfMapCache2;
            var wmsConfMapCache3;
            var wmsConfMapCache4;

        /*
        Image format : image/png8 --> error
            link address to change --> osc-app:8080 not correct
        */
        //$.get('../xml/wms/wmsGeoServerGWC.xml', function(response) { // layers[0].layers[0] "ne_110m_admin_0_countries"

        $.get('http://192.168.106.68/mapcache/?request=getcapabilities', function (response) { // layers[0].layers[14] "ne_110m_admin_0_countries"
            console.log(response);
            var wmsCapabilities = new WorldWind.WmsCapabilities(response);
            console.log(wmsCapabilities);

            wmsConfGeoServer1 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[1]);
            // wmsConfGeoServer2 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[3]);
            // wmsConfGeoServer3 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[4]);
            // wmsConfGeoServer4 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[3]);
            // wmsConfGeoServer5 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[4]);
            // wmsConfGeoServer6 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[5]);
            // wmsConfGeoServer7 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[6]);
            // wmsConfGeoServer8 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[7]);
            // wmsConfGeoServer9 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[8]);
            // wmsConfGeoServer10 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[9]);
            // wmsConfGeoServer11 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[10]);
            // wmsConfGeoServer12 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[11]);
            // wmsConfGeoServer13 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[12]);
            // wmsConfGeoServer14 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[13]);
            // wmsConfGeoServer15 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[14]);

            console.log(wmsConfGeoServer1);
            // console.log(wmsConfGeoServer2);
        })
            .done(function () {
                // $.get('../xml/wms/wmsMapCache.xml', function (response) { // layers[0].layers[1] "mosaic4326"
                //     console.log(response);
                //     var wmsCapabilities = new WorldWind.WmsCapabilities(response);
                //     console.log(wmsCapabilities);
                //     wmsConfMapCache1 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[0]);
                //     wmsConfMapCache2 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[1]);
                //     wmsConfMapCache3 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[2]);
                //     wmsConfMapCache4 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[3]);
                // })
                //     .done(function () {

                var layer1 = new WorldWind.WmsLayer(wmsConfGeoServer1);

                // layer1.creditImage = "../images/thales.png";
                        var layers = [
                            {layer: layer1, enabled: true},
                            // {layer: new WorldWind.WmsLayer(wmsConfGeoServer2), enabled: false},
                            // {layer: new WorldWind.WmsLayer(wmsConfGeoServer3), enabled: false},
                            // {layer: new WorldWind.WmsLayer(wmsConfGeoServer4), enabled: false},
                            // {layer: new WorldWind.WmsLayer(wmsConfGeoServer5), enabled: false},
                            // {layer: new WorldWind.WmsLayer(wmsConfGeoServer6), enabled: false},
                            // {layer: new WorldWind.WmsLayer(wmsConfGeoServer7), enabled: false},
                            // {layer: new WorldWind.WmsLayer(wmsConfGeoServer8), enabled: false},
                            // {layer: new WorldWind.WmsLayer(wmsConfGeoServer9), enabled: false},
                            // {layer: new WorldWind.WmsLayer(wmsConfGeoServer10), enabled: false},
                            // {layer: new WorldWind.WmsLayer(wmsConfGeoServer11), enabled: false},
                            // {layer: new WorldWind.WmsLayer(wmsConfGeoServer12), enabled: false},
                            // {layer: new WorldWind.WmsLayer(wmsConfGeoServer13), enabled: false},
                            // {layer: new WorldWind.WmsLayer(wmsConfGeoServer14), enabled: false},
                            // {layer: new WorldWind.WmsLayer(wmsConfGeoServer15), enabled: false},

                            // {layer: new WorldWind.WmsLayer(wmsConfMapCache1), enabled: false},
                            // {layer: new WorldWind.WmsLayer(wmsConfMapCache2), enabled: false},
                            // {layer: new WorldWind.WmsLayer(wmsConfMapCache3), enabled: false},
                            // {layer: new WorldWind.WmsLayer(wmsConfMapCache4), enabled: false},

                            // {layer: new WorldWind.BMNGLayer(), enabled: false},
                            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
                            {layer: new WorldWind.BingAerialLayer(null), enabled: false},
                            // {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: false},
                            // {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
                            // {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
                            {layer: new WorldWind.CompassLayer(), enabled: true},
                            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
                            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true},
                        ];

                        for (var l = 0; l < layers.length; l++) {
                            layers[l].layer.enabled = layers[l].enabled;
                            wwd.addLayer(layers[l].layer);
                        }

                        // Create a layer manager for controlling layer visibility.
                        var layerManager = new LayerManager(wwd);

                wwd.addLayer(new WorldWind.ThalesCredit());
                    });
            // })
        }
    });
