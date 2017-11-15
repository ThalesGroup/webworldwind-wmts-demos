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

        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialLayer(null), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
            {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
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

	/********************/
        // Variable to store the capabilities documents
        var wmsCapabilities;

        // Fetch capabilities document
        $.get('http://eumetview.eumetsat.int:80/geoserv/ows\').join(\'http://ip-84-39-38-157.rev.cloudwatt.com/eumetsat/ows?service=wms&version=1.3.0&request=GetCapabilities', function (response) {
            wmsCapabilities = new WorldWind.WmsCapabilities(jQuery.parseXML(response));
        }, 'text')
            .done(function () {

                /*                              Create a layer from capabilities document                             */
                {

                    for (var i = 0; i < wmsCapabilities.capability.layers[0].layers.length; i++) {
                        switch (wmsCapabilities.capability.layers[0].layers[i].title) {
                            case "msg_microphysics" :
                                var config1 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[i]);
                                var layer1 = new WorldWind.WmsLayer(config1);
                                layer1.displayName = "Meteosat Micro physics";
                                layer1.info = "WMS layer from Eumetsat";
                                layer1.doRender = function (dc) {
                                    if (!dc.terrain)
                                        return;

                                    if (this.currentTilesInvalid
                                        || !this.lasTtMVP || !dc.navigatorState.modelviewProjection.equals(this.lasTtMVP)
                                        || dc.globeStateKey != this.lastGlobeStateKey) {
                                        this.currentTilesInvalid = false;
                                        this.assembleTiles(dc);
                                    }

                                    this.lasTtMVP = dc.navigatorState.modelviewProjection;
                                    this.lastGlobeStateKey = dc.globeStateKey;

                                    if (this.currentTiles.length > 0) {
                                        dc.surfaceTileRenderer.renderTiles(dc, this.currentTiles, this.opacity);
                                        dc.frameStatistics.incrementImageTileCount(this.currentTiles.length);
                                        this.inCurrentFrame = true;
                                    }

                                    dc.screenCreditController.addImageCredit(WorldWind.configuration.baseUrl + "../../../../images/EUMETSAT_logo_350x250px_cropped.png");
                                };
                                break;

                            case "msg_natural" :
                                var config2 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[i]);
                                var layer2 = new WorldWind.WmsLayer(config2);
                                layer2.displayName = "Meteosat Natural";
                                layer2.info = "WMS layer from Eumetsat";
                                layer2.doRender = function (dc) {
                                    if (!dc.terrain)
                                        return;

                                    if (this.currentTilesInvalid
                                        || !this.lasTtMVP || !dc.navigatorState.modelviewProjection.equals(this.lasTtMVP)
                                        || dc.globeStateKey != this.lastGlobeStateKey) {
                                        this.currentTilesInvalid = false;
                                        this.assembleTiles(dc);
                                    }

                                    this.lasTtMVP = dc.navigatorState.modelviewProjection;
                                    this.lastGlobeStateKey = dc.globeStateKey;

                                    if (this.currentTiles.length > 0) {
                                        dc.surfaceTileRenderer.renderTiles(dc, this.currentTiles, this.opacity);
                                        dc.frameStatistics.incrementImageTileCount(this.currentTiles.length);
                                        this.inCurrentFrame = true;
                                    }

                                    dc.screenCreditController.addImageCredit(WorldWind.configuration.baseUrl + "../../../../images/EUMETSAT_logo_350x250px_cropped.png");
                                };
                                break;

                            case "msg_snow" :
                                var config3 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[i]);
                                var layer3 = new WorldWind.WmsLayer(config3);
                                layer3.displayName = "Meteosat Snow";
                                layer3.info = "WMS layer from Eumetsat";
                                layer3.doRender = function (dc) {
                                    if (!dc.terrain)
                                        return;

                                    if (this.currentTilesInvalid
                                        || !this.lasTtMVP || !dc.navigatorState.modelviewProjection.equals(this.lasTtMVP)
                                        || dc.globeStateKey != this.lastGlobeStateKey) {
                                        this.currentTilesInvalid = false;
                                        this.assembleTiles(dc);
                                    }

                                    this.lasTtMVP = dc.navigatorState.modelviewProjection;
                                    this.lastGlobeStateKey = dc.globeStateKey;

                                    if (this.currentTiles.length > 0) {
                                        dc.surfaceTileRenderer.renderTiles(dc, this.currentTiles, this.opacity);
                                        dc.frameStatistics.incrementImageTileCount(this.currentTiles.length);
                                        this.inCurrentFrame = true;
                                    }

                                    dc.screenCreditController.addImageCredit(WorldWind.configuration.baseUrl + "../../../../images/EUMETSAT_logo_350x250px_cropped.png");
                                };
                                break;

                            case "msg_dust" :
                                var config4 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[i]);
                                var layer4 = new WorldWind.WmsLayer(config4);
                                layer4.displayName = "Meteosat Dust";
                                layer4.info = "WMS layer from Eumetsat";
                                layer4.doRender = function (dc) {
                                    if (!dc.terrain)
                                        return;

                                    if (this.currentTilesInvalid
                                        || !this.lasTtMVP || !dc.navigatorState.modelviewProjection.equals(this.lasTtMVP)
                                        || dc.globeStateKey != this.lastGlobeStateKey) {
                                        this.currentTilesInvalid = false;
                                        this.assembleTiles(dc);
                                    }

                                    this.lasTtMVP = dc.navigatorState.modelviewProjection;
                                    this.lastGlobeStateKey = dc.globeStateKey;

                                    if (this.currentTiles.length > 0) {
                                        dc.surfaceTileRenderer.renderTiles(dc, this.currentTiles, this.opacity);
                                        dc.frameStatistics.incrementImageTileCount(this.currentTiles.length);
                                        this.inCurrentFrame = true;
                                    }

                                    dc.screenCreditController.addImageCredit(WorldWind.configuration.baseUrl + "../../../../images/EUMETSAT_logo_350x250px_cropped.png");
                                };
                                break;

                            case "msg_convection" :
                                var config5 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[i]);
                                var layer5 = new WorldWind.WmsLayer(config5);
                                layer5.displayName = "Meteosat Convection";
                                layer5.info = "WMS layer from Eumetsat";
                                layer5.doRender = function (dc) {
                                    if (!dc.terrain)
                                        return;

                                    if (this.currentTilesInvalid
                                        || !this.lasTtMVP || !dc.navigatorState.modelviewProjection.equals(this.lasTtMVP)
                                        || dc.globeStateKey != this.lastGlobeStateKey) {
                                        this.currentTilesInvalid = false;
                                        this.assembleTiles(dc);
                                    }

                                    this.lasTtMVP = dc.navigatorState.modelviewProjection;
                                    this.lastGlobeStateKey = dc.globeStateKey;

                                    if (this.currentTiles.length > 0) {
                                        dc.surfaceTileRenderer.renderTiles(dc, this.currentTiles, this.opacity);
                                        dc.frameStatistics.incrementImageTileCount(this.currentTiles.length);
                                        this.inCurrentFrame = true;
                                    }

                                    dc.screenCreditController.addImageCredit(WorldWind.configuration.baseUrl + "../../../../images/EUMETSAT_logo_350x250px_cropped.png");
                                };
                                break;

                            case "mtp_wv064" :
                                var config6 = WorldWind.WmsLayer.formLayerConfiguration(wmsCapabilities.capability.layers[0].layers[i]);
                                var layer6 = new WorldWind.WmsLayer(config6);
                                layer6.displayName = "Metop WV064";
                                layer6.info = "WMS layer from Eumetsat";
                                layer6.doRender = function (dc) {
                                    if (!dc.terrain)
                                        return;

                                    if (this.currentTilesInvalid
                                        || !this.lasTtMVP || !dc.navigatorState.modelviewProjection.equals(this.lasTtMVP)
                                        || dc.globeStateKey != this.lastGlobeStateKey) {
                                        this.currentTilesInvalid = false;
                                        this.assembleTiles(dc);
                                    }

                                    this.lasTtMVP = dc.navigatorState.modelviewProjection;
                                    this.lastGlobeStateKey = dc.globeStateKey;

                                    if (this.currentTiles.length > 0) {
                                        dc.surfaceTileRenderer.renderTiles(dc, this.currentTiles, this.opacity);
                                        dc.frameStatistics.incrementImageTileCount(this.currentTiles.length);
                                        this.inCurrentFrame = true;
                                    }

                                    dc.screenCreditController.addImageCredit(WorldWind.configuration.baseUrl + "../../../../images/EUMETSAT_logo_350x250px_cropped.png");
                                };
                                break;

                        }
                    }

                    //layerManager.addBaseLayer(layer1, {enabled: true, detailHint: config.imageryDetailHint});
                    //layerManager.addBaseLayer(layer2, {enabled: false, detailHint: config.imageryDetailHint});
                    //layerManager.addBaseLayer(layer3, {enabled: false, detailHint: config.imageryDetailHint});
                    //layerManager.addBaseLayer(layer4, {enabled: false, detailHint: config.imageryDetailHint});
                    //layerManager.addBaseLayer(layer5, {enabled: false, detailHint: config.imageryDetailHint});
                    //layerManager.addBaseLayer(layer6, {enabled: false, detailHint: config.imageryDetailHint});

                    wwd.addLayer(layer1);
                    wwd.addLayer(layer2);
                    wwd.addLayer(layer3);
                    wwd.addLayer(layer4);
                    wwd.addLayer(layer5);
                    wwd.addLayer(layer6);


                }


            });
        /********************/

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });
