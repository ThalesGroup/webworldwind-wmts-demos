
define([
    'model/Explorer',
    'worldwind'],
    function (
        wmt,
        ww) {
        "use strict";


        var ThalesCredit = function () {


            WorldWind.TiledImageLayer.call(this, new WorldWind.Sector(-90,90,-180,180), new WorldWind.Position(36,36), 19, 'image/png',
                'toto', 256, 256);

            // this.creditImage = WorldWind.configuration.baseUrl + "../../../../images/thalesLogo.png";
            this.creditImage = WorldWind.configuration.baseUrl + "../../../../images/THALES_logo_350x250px_cropped.png";

        };

        ThalesCredit.prototype = Object.create(WorldWind.TiledImageLayer.prototype);

        ThalesCredit.prototype.doRender = function (dc) {
            WorldWind.TiledImageLayer.prototype.doRender.call(this, dc);
            // dc.screenCreditController.imageCreditSize = 124;
            // dc.screenCreditController.imageCreditSize = 80;
            dc.screenCreditController.opacity = 0.7;
            dc.screenCreditController.addImageCredit(this.creditImage);
        };

        return ThalesCredit;
    }
);