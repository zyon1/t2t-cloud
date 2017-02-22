import { Component, Output, EventEmitter, Input } from '@angular/core'
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core'

declare var google: any;

@Component({
	selector: 'map',
	template: ''
})
export class MapComponent{
	@Output() mapLoaded = new EventEmitter();

	constructor(private _mapsWrapper:GoogleMapsAPIWrapper){
   //console.log("map component constructed");
      this._mapsWrapper.getNativeMap().then((map) => {
       // console.log(map);
          let opt={
            mapTypeId: google.maps.MapTypeId.SATELLITE
          };
        map.setOptions(opt);

      });
	}



}