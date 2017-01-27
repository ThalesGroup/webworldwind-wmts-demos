/* 
 * Copyright (c) 2016 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */

/*global require, requirejs, WorldWind */

/**
 * Require.js bootstrapping javascript
 */
requirejs.config({
// Path mappings for the logical module names
    paths: {
        'knockout': 'libs/knockout/knockout-3.4.0.debug',
        'jquery': 'libs/jquery/jquery-2.1.3',
        'jqueryui': 'libs/jquery-ui/jquery-ui-1.11.4',
        'jquery-growl': 'libs/jquery-plugins/jquery.growl',
        'bootstrap': 'libs/bootstrap/v3.3.6/bootstrap',
        'moment': 'libs/moment/moment-2.14.1',
        'worldwind': 'libs/webworldwind/worldwindlib',
        'model': 'model' // root application path
    },
    // Shim configuration for Bootstrap's JQuery dependency
    shim: {
        "bootstrap": {
            deps: ["jquery"],
            exports: "$.fn.popover"
        }
    }
});

/**
 * A top-level require call executed by the Application.
 */
require(['knockout', 'jquery', 'bootstrap', 'worldwind',
        'model/Config',
        'model/Constants',
        'model/Explorer',
        'model/globe/Globe',
        'views/GlobeViewModel',
        'views/HeaderViewModel',
        'views/HomeViewModel',
        'views/LayersViewModel',
        'views/MarkerEditor',
        'views/MarkersViewModel',
        'views/OutputViewModel',
        'views/ProjectionsViewModel',
        'views/SearchViewModel',
        'model/globe/layers/ThalesCredit',
        'model/globe/layers/UsgsContoursLayer',
        'model/globe/layers/UsgsImageryTopoBaseMapLayer',
        'model/globe/layers/UsgsTopoBaseMapLayer'],
    function (ko, $, bootstrap, ww,
              config,
              constants,
              explorer,
              Globe,
              GlobeViewModel,
              HeaderViewModel,
              HomeViewModel,
              LayersViewModel,
              MarkerEditor,
              MarkersViewModel,
              OuputViewModel,
              ProjectionsViewModel,
              SearchViewModel,
              ThalesCredit,
              UsgsContoursLayer,
              UsgsImageryTopoBaseMapLayer,
              UsgsTopoBaseMapLayer) { // this callback gets executed when all required modules are loaded
        "use strict";
        // ----------------
        // Setup the globe
        // ----------------
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);
        WorldWind.configuration.baseUrl = ww.WWUtil.currentUrlSansFilePart() + "/" + constants.WORLD_WIND_PATH;

        // Define the configuration for the primary globe
        var globeOptions = {
                showBackground: true,
                showReticule: true,
                showViewControls: true,
                includePanControls: config.showPanControl,
                includeRotateControls: true,
                includeTiltControls: true,
                includeZoomControls: true,
                includeExaggerationControls: config.showExaggerationControl,
                includeFieldOfViewControls: config.showFieldOfViewControl
            },
            globe;

        // Create the explorer's primary globe that's associated with the specified HTML5 canvas
        var wwd = new WorldWind.WorldWindow("canvasOne");
        globe = new Globe(wwd, globeOptions);


        // Defined the Globe's layers and layer options
        // var blueMarble = new WorldWind.BMNGLayer();
        // blueMarble.info = "Native Web World Wind layer";
        // globe.layerManager.addBaseLayer(blueMarble, {enabled: true, hideInMenu: true, detailHint: config.imageryDetailHint});
        // globe.layerManager.addBaseLayer(new WorldWind.BMNGLandsatLayer(), {enabled: false, detailHint: config.imageryDetailHint});
        // globe.layerManager.addBaseLayer(new WorldWind.BingAerialWithLabelsLayer(null), {enabled: false, detailHint: config.imageryDetailHint});
        // var usgsTopo = new UsgsImageryTopoBaseMapLayer();
        // usgsTopo.info = "No legend available";
        // globe.layerManager.addBaseLayer(usgsTopo, {enabled: false, detailHint: config.imageryDetailHint});

        // var usgsBaseMap = new UsgsTopoBaseMapLayer();
        // usgsBaseMap.info = "No legend available";
        // globe.layerManager.addBaseLayer(usgsBaseMap, {enabled: false, detailHint: config.imageryDetailHint});
        // globe.layerManager.addBaseLayer(new WorldWind.BingRoadsLayer(null), {enabled: false, opacity: 0.7, detailHint: config.imageryDetailHint});
        //globe.layerManager.addBaseLayer(new WorldWind.OpenStreetMapImageLayer(null), {enabled: false, opacity: 0.7, detailHint: config.imageryDetailHint});


        //////////////////////////////////////////////////////////////////////////////


        // Variable to store the capabilities documents
        var wmtsCapabilities;

        // Fetch capabilities document
        $.get('http://map1.vis.earthdata.nasa.gov/wmts-webmerc/wmts.cgi?SERVICE=WMTS&request=GetCapabilities', function (response) {
            // Parse capabilities
            wmtsCapabilities = new WorldWind.WmtsCapabilities(response);
        })
            .done(function () {

                /*                              Create a layer from capabilities document                             */
                {

                    for (var i = 0; i < wmtsCapabilities.contents.layer.length; i++) {
                        switch (wmtsCapabilities.contents.layer[i].identifier) {
                            case "AMSR2_Wind_Speed_Day" :
                                var config1 = WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilities.contents.layer[i]);
                                var layer1 = new WorldWind.WmtsLayer(config1, "2016-06-08");
                                layer1.displayName = "(WMTS) Wind Speed";
                                layer1.info = "WMTS layer from GIBS representing the wind speed by day";
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

                                    dc.screenCreditController.addImageCredit(WorldWind.configuration.baseUrl + "../../../../images/logoNasa.png");
                                };
                                break;

                            // case "AMSR2_Columnar_Water_Vapor_Day" :
                            //     var config2 = WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilities.contents.layer[i]);
                            //     var layer2 = new WorldWind.WmtsLayer(config2, "2016-06-08");
                            //     layer2.displayName = "(WMTS) Columnar Water Vapor";
                            //     layer2.info = "WMTS layer from GIBS representing the columnar water vapor by day";
                            //     break;

                            case "BlueMarble_ShadedRelief_Bathymetry" :
                                var config3 = WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilities.contents.layer[i]);
                                var layer3 = new WorldWind.WmtsLayer(config3, "2016-06-08");
                                layer3.displayName = "(WMTS) Blue Marble with Relief and Bathymetry";
                                layer3.info = "WMTS layer from GIBS : Blue Marble";
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

                                    dc.screenCreditController.addImageCredit(WorldWind.configuration.baseUrl + "../../../../images/logoNasa.png");
                                };
                                // drawContext.screenCreditController.addImageCredit("../../images/esa.png");
                                break;

                            // case "Coastlines" :
                            //     var config4 = WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilities.contents.layer[i]);
                            //     var layer4 = new WorldWind.WmtsLayer(config4, "2016-06-08");
                            //     layer4.displayName = "(WMTS) Coastlines";
                            //     layer4.info = "WMTS layer from GIBS : Coastlines";
                            //     break;

                            case "GHRSST_L4_MUR_Sea_Surface_Temperature" :
                                var config5 = WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilities.contents.layer[i]);
                                var layer5 = new WorldWind.WmtsLayer(config5, "2016-06-08");
                                layer5.displayName = "(WMTS) Sea Surface Temprature";
                                layer5.info = "WMTS layer from GIBS representing the temperature on sea surface";
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

                                    dc.screenCreditController.addImageCredit(WorldWind.configuration.baseUrl + "../../../../images/logoNasa.png");
                                };
                                break;

                            case "MODIS_Terra_SurfaceReflectance_Bands143" :
                                var config6 = WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilities.contents.layer[i]);
                                var layer6 = new WorldWind.WmtsLayer(config6, "2016-06-08");
                                layer6.displayName = "(WMTS) Land Surface Reflectance";
                                layer6.info = "WMTS layer from GIBS representing the reflectance on land surface";
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

                                    dc.screenCreditController.addImageCredit(WorldWind.configuration.baseUrl + "../../../../images/logoNasa.png");
                                };
                                break;

                            case "MODIS_Aqua_Chlorophyll_A" :
                                var config7 = WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilities.contents.layer[i]);
                                var layer7 = new WorldWind.WmtsLayer(config7, "2016-06-08");
                                layer7.displayName = "(WMTS) Chlorophyll";
                                layer7.info = "WMTS layer from GIBS representing the chlorophyll amount on water";
                                layer7.doRender = function (dc) {
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

                                    dc.screenCreditController.addImageCredit(WorldWind.configuration.baseUrl + "../../../../images/logoNasa.png");
                                };
                                break;
                        }
                    }

                    // globe.layerManager.addBaseLayer(layer4, {enabled: false, detailHint: config.imageryDetailHint});



                    // globe.layerManager.addBaseLayer(layer3, {enabled: false, detailHint: config.imageryDetailHint});


                    // globe.layerManager.addBaseLayer(layer1, {enabled: false, detailHint: config.imageryDetailHint});
                    // globe.layerManager.addBaseLayer(layer2, {enabled: false, detailHint: config.imageryDetailHint});

                    // globe.layerManager.addBaseLayer(layer5, {enabled: false, detailHint: config.imageryDetailHint});
                    globe.layerManager.addBaseLayer(layer6, {enabled: false, detailHint: config.imageryDetailHint});
                    // globe.layerManager.addBaseLayer(layer7, {enabled: false, detailHint: config.imageryDetailHint});

                }


                var maxResolution3857 = 156543.03392803908;
                var resolutions3857 = [];
                for (var ii = 0; ii < 18; ii++) {
                    resolutions3857.push(maxResolution3857 / Math.pow(2, ii));
                }

                // Create tile matrix set
                var matrixset = WorldWind.WmtsLayer.createTileMatrixSet(
                    {
                        matrixSet: "PopularWebMercator512",
                        prefix: false,
                        projection: "EPSG:3857",
                        topLeftCorner: [-20037508.342789, 20037508.342789],
                        extent: [-20037508.342789, -20037508.342789, 20037508.342789, 20037508.342789],
                        resolutions: resolutions3857,
                        tileSize: 512
                    }
                );

                var esa1 = new WorldWind.WmtsLayer(
                    {
                        identifier: "BAI",
                        service: "http://services.sentinel-hub.com/v1/wmts/56748ba2-4a88-4854-beea-86f9afc63e35?",
                        format: "image/png",
                        tileMatrixSet: matrixset,
                        style: "default",
                        title: "(WMTS) Burn Area Index"
                    }
                );
                esa1.info = "WMTS layer from ESA Sentinel Hub representing burn area index. Very localized layer, so please zoom in to see real data ";
                esa1.doRender = function (dc) {
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

                    dc.screenCreditController.addImageCredit(WorldWind.configuration.baseUrl + "../../../../images/logoEsa.png");
                };

                var esa2 = new WorldWind.WmtsLayer(
                    {
                        identifier: "TRUE_COLOR",
                        service: "http://services.sentinel-hub.com/v1/wmts/56748ba2-4a88-4854-beea-86f9afc63e35?",
                        format: "image/png",
                        tileMatrixSet: matrixset,
                        style: "default",
                        title: "(WMTS) True Color World"
                    }
                );
                esa2.info = "WMTS layer from ESA Sentinel Hub representing the whole globe";
                esa2.doRender = function (dc) {
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

                    dc.screenCreditController.addImageCredit(WorldWind.configuration.baseUrl + "../../../../images/logoEsa.png");
                };
                // globe.layerManager.addBaseLayer(esa1, {enabled: false, detailHint: config.imageryDetailHint});
                globe.layerManager.addBaseLayer(esa2, {enabled: false, detailHint: config.imageryDetailHint});


                var maxResolution = 0.703125;
                var resolutions = [];
                for (var ii = 0; ii < 18; ii++) {
                    resolutions.push(maxResolution / Math.pow(2, ii));
                }

                // var tmsMrdsLayer = new WorldWind.TmsLayer({
                //     extent: [-180, -90, 180, 90],
                //     resolutions: resolutions,
                //     origin: [-180, -90],
                //     format: "image/png",
                //     coordinateSystem: "EPSG:4326",
                //     size: 256,
                //     matrixSet: "WGS84",
                //     layerName: "mrds",
                //     service: "http://mrdata.usgs.gov/mapcache/tms/1.0.0/"
                // }, "(TMS) Mineral Resources Data System");
                // tmsMrdsLayer.info = "TMS Layer from United States Geological Survey representing metallic and nonmetallic mineral resources throughout the world";
                // tmsMrdsLayer.doRender = function (dc) {
                //     WorldWind.TiledImageLayer.prototype.doRender.call(this, dc);
                //     dc.screenCreditController.addImageCredit(WorldWind.configuration.baseUrl + "../../../../images/logoUsgs.png");
                // };
                //
                // var tmsAkgeolLayer = new WorldWind.TmsLayer({
                //     extent: [-180, -90, 180, 90],
                //     resolutions: resolutions,
                //     origin: [-180, -90],
                //     format: "image/png",
                //     coordinateSystem: "EPSG:4326",
                //     size: 256,
                //     matrixSet: "WGS84",
                //     layerName: "akgeol",
                //     service: "http://mrdata.usgs.gov/mapcache/tms/1.0.0/"
                // }, "(TMS) Alaska Geology");
                // tmsAkgeolLayer.info = "TMS Layer from United States Geological Survey representing Alaska Geology";
                // tmsAkgeolLayer.doRender = function (dc) {
                //     WorldWind.TiledImageLayer.prototype.doRender.call(this, dc);
                //     dc.screenCreditController.addImageCredit(WorldWind.configuration.baseUrl + "../../../../images/logoUsgs.png");
                // };
                //
                // globe.layerManager.addBaseLayer(tmsMrdsLayer, {enabled: false, detailHint: config.imageryDetailHint});
                // globe.layerManager.addBaseLayer(tmsAkgeolLayer, {enabled: false, detailHint: config.imageryDetailHint});


            });


        /********************/
        // Variable to store the capabilities documents
        var wmsCapabilities;

        // Fetch capabilities document
        $.get('http://ip-84-39-38-157.rev.cloudwatt.com/eumetsat/ows?service=wms&version=1.3.0&request=GetCapabilities', function (response) {
            // Parse capabilities
            response = response.split('http://eumetview.eumetsat.int:80/geoserv/ows').join('http://ip-84-39-38-157.rev.cloudwatt.com/eumetsat/ows');
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

                    globe.layerManager.addBaseLayer(layer1, {enabled: true, detailHint: config.imageryDetailHint});
                    globe.layerManager.addBaseLayer(layer2, {enabled: false, detailHint: config.imageryDetailHint});
                    globe.layerManager.addBaseLayer(layer3, {enabled: false, detailHint: config.imageryDetailHint});
                    globe.layerManager.addBaseLayer(layer4, {enabled: false, detailHint: config.imageryDetailHint});
                    globe.layerManager.addBaseLayer(layer5, {enabled: false, detailHint: config.imageryDetailHint});
                    globe.layerManager.addBaseLayer(layer6, {enabled: false, detailHint: config.imageryDetailHint});


                }


            });
        /********************/


        //////////////////////////////////////////////////////////////////////////////


        var blueMarble = new WorldWind.BMNGLayer();
        blueMarble.info = "Native Web World Wind layer";
        globe.layerManager.addBaseLayer(blueMarble, {
            enabled: true,
            hideInMenu: true,
            detailHint: config.imageryDetailHint
        });

        wwd.addLayer(new ThalesCredit(), {enabled: true, detailHint: config.imageryDetailHint});
        // globe.layerManager.addOverlayLayer(new UsgsContoursLayer(), {enabled: false});

        globe.layerManager.addDataLayer(new WorldWind.RenderableLayer(constants.LAYER_NAME_MARKERS), {
            enabled: true,
            pickEnabled: true
        });

        // Initialize the Explorer object
        explorer.initialize(globe);

        // --------------------------------------------------------
        // Bind view models to the corresponding HTML elements
        // --------------------------------------------------------
        ko.applyBindings(new HeaderViewModel(), document.getElementById('header'));
        ko.applyBindings(new GlobeViewModel(globe, explorer.markerManager), document.getElementById('globe'));
        ko.applyBindings(new ProjectionsViewModel(globe), document.getElementById('projections'));
        ko.applyBindings(new SearchViewModel(globe), document.getElementById('search'));
        ko.applyBindings(new HomeViewModel(globe), document.getElementById('home'));
        ko.applyBindings(new LayersViewModel(globe), document.getElementById('layers'));
        ko.applyBindings(new MarkersViewModel(globe, explorer.markerManager), document.getElementById('markers'));
        ko.applyBindings(new OuputViewModel(globe), document.getElementById('output'));
        ko.applyBindings(new MarkerEditor(), document.getElementById('marker-editor'));

        // -----------------------------------------------------------
        // Add handlers to auto-expand/collapse the menus
        // -----------------------------------------------------------
        // Auto-expand menu section-bodies when not small
        $(window).resize(function () {
            if ($(window).width() >= 768) {
                $('.section-body').collapse('show');
            }
        });
        // Auto-collapse navbar when its tab items are clicked
        $('.navbar-collapse a[role="tab"]').click(function () {
            $('.navbar-collapse').collapse('hide');
        });
        // Auto-scroll-into-view expanded dropdown menus
        $('.dropdown').on('shown.bs.dropdown', function (event) {
            event.target.scrollIntoView(false); // align to bottom
        });

        // ------------------------------------------------------------
        // Add handlers to save/restore the session
        // -----------------------------------------------------------
        // Add event handler to save the current view (eye position) and markers when the window closes
        window.onbeforeunload = function () {
            explorer.saveSession();
            // Return null to close quietly on Chrome and FireFox.
            return null;
        };

        // Now that MVC is set up, restore the model from the previous session.
        explorer.restoreSession();
    }
);
