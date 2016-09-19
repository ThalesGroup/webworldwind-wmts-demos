define([
        '../geom/Position',
        '../geom/Sector',
        '../layer/TiledImageLayer'
    ],
    function (Position,
              Sector,
              TiledImageLayer) {
        "use strict";


        var ThalesCredit = function () {

            TiledImageLayer.call(this, new Sector(-90,90,-180,180), new Position(36,36), 19, 'image/png',
                'toto', 256, 256);

            this.creditImage = WorldWind.configuration.baseUrl + "images/logo2.jpg";
            // this.creditImage = WorldWind.configuration.baseUrl + "images/logoo2.png";

        };

        ThalesCredit.prototype = Object.create(TiledImageLayer.prototype);


        ThalesCredit.prototype.doRender = function (dc) {
            TiledImageLayer.prototype.doRender.call(this, dc);
                // dc.screenCreditController.imageCreditSize = 124;
                dc.screenCreditController.imageCreditSize = 80;
                dc.screenCreditController.opacity = 0.7;
                dc.screenCreditController.addImageCredit(this.creditImage);
        };

        return ThalesCredit;
    });