'use strict';
/**
 * Initialization of the map with its controls and layers
 * program sticher
 * An equirectangular panorama (or a full 360° cylindrical panorama)
 * http://wiki.panotools.org/Windows_software#Stitching_Software
 * @author Paolo Favero
 */
MAP_PHOTOSPHERE.mapView = {
  map: null,
  center: [13.399, 52.524],
  poiStyle: null,
  selPoiStyle: null,
  selPoi: null,
  init: function () {
    this.map = new ol.Map({
      layers: [
        new ol.layer.Tile({source: new ol.source.OSM({url: "http://tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png", crossOrigin: null})})
      ],
      target: 'map',
      view: new ol.View({
        center: ol.proj.fromLonLat(this.center),
        zoom: 15,
        maxZoom: 17
      })});
    this.createPoiStyle();
    this.addPois();
    this.addEvents();
  },
  addEvents: function () {
    var _this = this;
    $.subscribe('map:rotate', $.proxy(this.rotateMap, this));
    this.map.on('pointermove', function (evt) {
      _this.map.getTargetElement().style.cursor =
          _this.map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
    });
    this.map.on('click', function (evt) {
      _this.clickHandler(evt);
    });
  },
  addPois: function () {
    var _this = this;
    var berlin1 = new ol.Feature({
      properties: {name: 'altenationalgalerie', northOffset: 200},
      geometry: new ol.geom.Point(ol.proj.fromLonLat([13.399268, 52.520502]))
    });
    var berlin2 = new ol.Feature({
      properties: {name: 'auguststr', northOffset: 150},
      geometry: new ol.geom.Point(ol.proj.fromLonLat([13.398082, 52.527220]))
    });
    var berlin3 = new ol.Feature({
      properties: {name: 'bodenmuseum', northOffset: 180},
      geometry: new ol.geom.Point(ol.proj.fromLonLat([13.393838, 52.522099]))
    });
    var berlin4 = new ol.Feature({
      properties: {name: 'monbijoupark', northOffset: 0},
      geometry: new ol.geom.Point(ol.proj.fromLonLat([13.394876, 52.522671]))
    });
    var berlin5 = new ol.Feature({
      properties: {name: 'sophienck', northOffset: -40},
      geometry: new ol.geom.Point(ol.proj.fromLonLat([13.398387, 52.526535]))
    });
    var berlin6 = new ol.Feature({
      properties: {name: 'sophienkirche', northOffset: -70},
      geometry: new ol.geom.Point(ol.proj.fromLonLat([13.399911, 52.525782]))
    });

    var vectorSource = new ol.source.Vector({
      features: [berlin1, berlin2, berlin3, berlin4, berlin5, berlin6]
    });

    var vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: new ol.style.Style({
        image: _this.poiStyle
      })
    });
    this.map.addLayer(vectorLayer);
  },
  rotateMap: function (evt, degrees) {
    this.selPoiStyle.setRotation(-degrees * Math.PI / 180);
    this.selPoi.setStyle(new ol.style.Style({
      image: this.selPoiStyle
    }));
  },
  createPoiStyle: function () {
    this.selPoiStyle = new ol.style.Icon({
      anchor: [0.5, 0.9],
      size: [50, 50],
      //offset: [52, 0],
      opacity: 1,
      //rotation: 1,
      //scale: 0.25,
      src: 'img/view-angle.png'
    });
    this.poiStyle = new ol.style.Icon({
      anchor: [0.5, 1],
      size: [35, 53],
      opacity: 1,
      src: 'img/icon.png'
    });
  },
  clickHandler: function (evt) {
    var feature = this.map.forEachFeatureAtPixel(evt.pixel,
        function (feature) {
          return feature;
        });
    if (feature && feature !== this.selPoi) {
      if (this.selPoi) {
        this.selPoi.setStyle(new ol.style.Style({
          image: this.poiStyle
        }));
      }
      this.selPoi = feature;
      
      var zoom = ol.animation.zoom({
        duration: 1000,
        resolution: this.map.getView().getResolution()
      });
      this.map.beforeRender(zoom);
      this.map.getView().setResolution(1.194328566955879);
      
      var pan = ol.animation.pan({
        duration: 1000,
        source: this.map.getView().getCenter()
      });
      this.map.beforeRender(pan);
      this.map.getView().fit(this.selPoi.getGeometry(), this.map.getSize());
      
      var _properties = this.selPoi.getProperties().properties;
      $.publish('panorama:load', [_properties.northOffset, _properties.name]);
      this.selPoiStyle.setRotation(0);
      this.selPoi.setStyle(new ol.style.Style({
        image: this.selPoiStyle
      }));
    }
  }
};

