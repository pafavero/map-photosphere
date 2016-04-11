'use strict';
MAP_PHOTOSPHERE.panorama = {
  panorama: null,
  $panoramaPnl: null,
  init: function () {
    $.subscribe('panorama:load', $.proxy(this.openPnlAndLoadPicture, this));
  },
  initPanorama: function (northOffset, name) {
    this.panorama = pannellum.viewer('panorama', {
      type: "equirectangular",
      panorama: 'img/panorama/' + name + '.jpg',
      autoLoad: true,
      showFullscreenCtrl: false,
      compass: true,
      northOffset: -northOffset,//Sets the panorama’s starting yaw position in degrees. Defaults to 0.
      yaw: northOffset//Sets the panorama’s starting yaw position in degrees. Defaults to 0.
    });
  },
  openPnlAndLoadPicture: function (evt, degreeFromNord, name) {
    var _this = this;
    if (!this.$panoramaPnl) {
      this.$panoramaPnl = $('#panorama');
      this.$panoramaPnl.animate({height: 400}, 800, function () {
        _this.initPanorama (degreeFromNord, name);
      });
    }else{
      this.initPanorama (degreeFromNord, name);
    }
  }
};
