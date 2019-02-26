import { Component, OnInit, AfterViewInit,ViewChild } from '@angular/core';
import {} from 'googlemaps';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {Observable} from 'rxjs';
@Component({
  selector: 'app-findatm',
  templateUrl: './findatm.component.html',
  styleUrls: ['./findatm.component.css']
})
export class FindatmComponent implements OnInit , AfterViewInit {
  txtSearchServ;
  searchLocationForm: FormGroup;
  @ViewChild('gmap') gmapElement: any;
  @ViewChild('location') autoCompField: any;
  map: google.maps.Map;
  mapProp;
  autoCompLat;
  autoCompLong;
  textSearchLoader = false;
  nearByLoader = false;
  errorMsg: String = '';
  txtSearchList: Array<google.maps.places.PlaceResult>;
  constructor(private formBuilder: FormBuilder) {
    this.searchLocationForm = this.formBuilder.group(
      {
        location: ['', Validators.required]
      }
    );
  }
  ngOnInit() {
    this.mapProp = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, this.mapProp);

    this.txtSearchServ = new google.maps.places.PlacesService(this.map);
  }
  ngAfterViewInit() {
    this.getAutocomplete();
}
getPosition(): Observable<any> {
  return new Observable(observer => {
    window.navigator.geolocation.getCurrentPosition(
      resp => {
      observer.next(resp);
      observer.complete();
    },
    (error) => observer.error(error)
    );
});
}

  getAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.autoCompField.nativeElement);
  google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.autoCompLat = place.geometry.location.lat();
this.autoCompLong = place.geometry.location.lng();
  });
  }
  getPlacesByText() {
    this.txtSearchList = [];
    this.textSearchLoader = true;
    this.errorMsg = '';
    this.map.setCenter(new google.maps.LatLng(this.autoCompLat, this.autoCompLong));
    const request = {
      location: this.map.getCenter(),
      type: 'atm'
    };
    this.txtSearchServ.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
          this.txtSearchList.push(results[i]);
        }
      } else if (status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT){
        this.errorMsg = 'You have hit the Query Limit';
      }
      this.textSearchLoader = false;
    });
  }

  getPlacesByNearby() {
    this.txtSearchList = [];
    this.nearByLoader = true;
    this.errorMsg = '';
    this.getPosition().subscribe(response => {
      this.map.setCenter(new google.maps.LatLng(response.coords.latitude, response.coords.longitude));
      const request = {
        location: this.map.getCenter(),
        type: 'atm'
      };
      this.txtSearchServ.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < results.length; i++) {
            this.txtSearchList.push(results[i]);
          }
        } else if (status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT){
          this.errorMsg = 'You have hit the Query Limit';
        }
      });
      this.nearByLoader = false;
    });
  }
}
