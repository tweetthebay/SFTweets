import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
import Modal from 'react-modal';


class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      bounds: null,
      lat: null,
      lng: null

    };
    this.getLocation = this.getLocation.bind(this);
    this.addTweet = this.addTweet.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.geocodeAddress = this.geocodeAddress.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.markers = [];
  }


  openModal() {
    this.setState({
      modalOpen: true
    });
  }

  closeModal() {
    this.setState({modalOpen: false});
  }
  componentDidMount() {
    let lat = 37.773972;
    let lng =  -122.431297;

    const map = (this.refs.map);
    this.map = new google.maps.Map(map, {
      center: {lat, lng},
      zoom: 11
    });
    this.getLocation(this.map);
    this.geocoder = new google.maps.Geocoder;
    this.infowindow = new google.maps.InfoWindow;
    this.infowindow.setOptions({maxWidth: '300'});
    this.bounds = new google.maps.LatLngBounds;
    debugger;
    if (this.props.tweets.length > 0) {
      this.props.tweets.forEach(tweet => {
        this.addTweet(tweet);
      });
    }
    let that = this;
    google.maps.event.addDomListener(window, "resize", function() {
      let center = that.map.getCenter();
      google.maps.event.trigger(that.map, "resize");
      that.map.setCenter(center);
    });
  }

  componentWillReceiveProps(newProps) {

    this.getLocation(this.map);

    if (newProps !== this.props) {
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
    }

    if (newProps.tweets) {
      newProps.tweets.forEach(tweet => {
        this.addTweet(tweet);
      });
    }
  }

  getLocation (map) {

    let that = this;
    map.addListener('idle', (event) => {


      const bounds = map.getBounds();
      const radius = Math.abs(bounds.f.b - bounds.f.f) * 34.5;
      const centerLat = map.getCenter().lat();
      const centerLng = map.getCenter().lng();


      that.props.setMapPosition({radius: radius, lat: centerLat, lng: centerLng});
    });
  }

  addTweet (tweet) {
    this.modal;
    let that = this;
    let marker;
    if (tweet.coordinates) {
      let pos = new google.maps.LatLng(
        tweet.coordinates.coordinates[1],
        tweet.coordinates.coordinates[0]
      );
      marker = new google.maps.Marker({
        position: pos,
        map: this.map
      });
      if (this.props.currentTweet && tweet.id === this.props.currentTweet) {
        this.map.setCenter(marker.position);
        this.infowindow.setContent(
          `<div class='info-window'>
            <img class='info-window-image' src='${tweet.user_image}' />
            <div>
              <div class='info-window-item weight'>${tweet.user_name}</div>
              <div class='info-window-item'>${tweet.text}</div>
            </div>

          </div>`
        );
        this.infowindow.open(that.map, marker);
      }
      this.markers.push(marker)
      this.handleClick(marker, tweet);
    } else if (typeof tweet.place === 'undefined' ) {
      return;
    } else {
      this.geocodeAddress(that.geocoder, that.map, tweet.place.full_name, tweet);
    }
  }

  geocodeAddress(geocoder, resultsMap, address, tweet) {
    let that = this;
    geocoder.geocode({'address': address}, (results, status) => {
      if (status === 'OK') {
        let random = 0.01 * Math.random()
        let factor = random <= 0.005 ? 1 : -1;
        let position = new google.maps.LatLng(
          results[0].geometry.location.lat()+random*factor,
          results[0].geometry.location.lng()+random*factor);
        let marker = new google.maps.Marker({
          map: resultsMap,
          position: position
        });
        this.markers.push(marker);
        that.handleClick(marker, tweet);
      } else {
        return;
      }
    });
  }

  handleClick (marker, tweet) {
    let that = this;
    marker.addListener('click', () => {
      // that.tweet = tweet;
      // that.openModal();
      that.map.setCenter(this.position);
      that.infowindow.setContent(
        `<div class='info-window'>
          <img class='info-window-image' src='${tweet.user_image}' />
          <div>
            <div class='info-window-item weight'>${tweet.user_name}</div>
            <div class='info-window-item'>${tweet.text}</div>
          </div>

        </div>`
      );
      that.infowindow.open(that.map, marker);
    });
  }

  render() {
    return(
      <div className='map-container'>
        <div className="map" id='map' ref='map'>Map</div>

      </div>
    );
  }
}
export default Map;
