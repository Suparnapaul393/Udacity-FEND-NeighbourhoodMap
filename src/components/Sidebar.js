import React, { Component } from "react";

export default class Sidebar extends Component {
  constructor() {
    super();

    this.state = {
      query: ''
    }

    this.onChangeQuery = this.onChangeQuery.bind(this);
  }

  // Updates prompted query.
  onChangeQuery(event) {
    var query = event.target.value;
    this.setState({query});
  }

  // Filters places according to the given query.
  filterPlaces = () => {
    const { query } = this.state;
    this.props.handleQuery(query);
  }

  // Lists all places and provides search functionality.
  render() {
    const { filteredPlaces, sidebarStyle, onPlaceSelected } = this.props;

    return (
    <div id="left-sidebar" className="sidenav" style={sidebarStyle}>
      <a
        className="closebtn" 
        onClick={() => this.props.handleViewSidebar(false)}
        tabIndex="20">
        &times;
      </a>
      <input 
        className="search" 
        type="text" 
        placeholder="Search" 
        onChange={this.onChangeQuery} 
        tabIndex="2" />
      <button 
        className="filterButton" 
        type="button" 
        onClick={() => this.filterPlaces()}
        tabIndex="3">
        Filter
      </button>
      {
        filteredPlaces.map((place, id) => (
          <a
            key={id} 
            aria-label="Place"
            onClick={() => onPlaceSelected(place)}
            >
            {place.title}
          </a>
        ))
      }
    </div>)
  }
}