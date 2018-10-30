import React, { Component } from "react";
import Sidebar from "./Sidebar";
import places from '../places.json';
import MapComponent from "./MapComponent";

const CLIENT_ID = "LTXLHYWBPC0VWCIO1RRKHD213U14ODDRZLLV20IDK0YROT53";
const CLIENT_SECRET = "QMTZCKC5NCG5TA3WRGTSNUFYW2XNUNSUVKIZWZEHZG3KLC0T";
const FS_VERSION = "20180323";

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      sidebarStyle: {width: '0px'},
      fullContentStyle: {marginLeft: '0px'},
      filteredPlaces: places,
      allPlaces: places,
      selectedPlace: {},
    }

    this.handleQuery = this.handleQuery.bind(this);
    this.handleViewSidebar = this.handleViewSidebar.bind(this);
    this.onInfoWindowClose = this.onInfoWindowClose.bind(this);
    this.onPlaceSelected = this.onPlaceSelected.bind(this);
  }

  componentDidMount() {
    const static_data = "client_id=" + CLIENT_ID +
               "&client_secret=" + CLIENT_SECRET +
               "&v=" + FS_VERSION +
               "&limit=1";
    const { allPlaces } = this.state;
    let errors = [];
    allPlaces.map((place, id) => {
      const data = static_data + "&ll=" + place.latitude + "," + place.longitude;
      fetch("https://api.foursquare.com/v2/venues/explore?" + data)
      .then(res => res.json())
      .then(
        (result) => {
          if (result.response && result.response.groups) {
            allPlaces[id].formattedAddress = result.response.groups[0].items[0].venue.location.formattedAddress.join(", ");
            this.setState({allPlaces});
          } else {
            errors.push("FourSquare API has not successfully returned full address of the venue:" + place.title + "\n");
          }
        },
        // Show error message to user.
        (error) => {
          errors.push("An error occurred reading from FourSquare API for the venue:" + place.title + "\n");
        }
      );
      return "";
    });

    setTimeout(function(){ 
      if (errors !== undefined && errors.length > 0) {
        window.alert(errors.toString().replace(new RegExp(',', 'g'), '')); 
      }
    }, 3000);
  }

  // When filter clicked, gets the query and filters the places accordingly.
  handleQuery(query) {
    const filteredPlaces = this.state.allPlaces.filter(place => place.title.includes(query));
    this.setState({filteredPlaces});
  }

  // Provides functionality to hide or display the sidebar menu.
  handleViewSidebar(shouldBeDisplayed) {
    if (shouldBeDisplayed) {
      this.setState({
        sidebarStyle: {width: '250px'},
        fullContentStyle: {marginLeft: '250px'}
    });
    } else if (!shouldBeDisplayed) {
      this.setState({
        sidebarStyle: {width: '0px'},
        fullContentStyle: {marginLeft: '0px'}
      });
    }
  }

  // It closes open info window.
  onInfoWindowClose() {
    this.setState({
      selectedPlace: {},
    });
  }

  // It opens info window related with the chosen marker.
  onPlaceSelected(place) {
    this.setState({
      selectedPlace: place,
    });
  }

  render() {
    const { sidebarStyle, filteredPlaces, selectedPlace } = this.state;
    const style = { height: `calc(95vh)` };
    return (
      <React.Fragment>
        <Sidebar
          aria-label="Side Menu"
          sidebarStyle={sidebarStyle}
          filteredPlaces={filteredPlaces}
          handleViewSidebar={this.handleViewSidebar}
          onPlaceSelected={this.onPlaceSelected}
          handleQuery={this.handleQuery}
          />

        <div id="fullContent" style={this.state.fullContentStyle}>
          <span className="burgerIcon" 
            tabIndex="1"
            onClick={() => this.handleViewSidebar(true)}>&#9776;</span>
          <div id="mapContent">
            <MapComponent
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB868uN5xDP2HfMsvu08Z8-TZMR1t33-Tg&v=3.exp&libraries=places"
              loadingElement={<div style={style} />}
              containerElement={<div style={style} />}
              mapElement={<div style={style} />}
              filteredPlaces={filteredPlaces}
              selectedPlace={selectedPlace}
              onPlaceSelected={this.onPlaceSelected}
              onInfoWindowClose={this.onInfoWindowClose}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}