/*
 * Copyright (C) 2023 Soham Pardeshi.  All rights reserved.  Permission is
 * hereby granted to students registered for University of Washington
 * CSE 331 for use solely during Autumn Quarter 2022 for purposes of
 * the course.  No other use, copying, distribution, or modification
 * is permitted without prior written consent. Copyrights for
 * third-party components of this work must be honored.  Instructors
 * interested in reusing these course materials should contact the
 * author.
 */

import {LatLngExpression} from "leaflet";
import React, { Component } from "react";
import {Circle, MapContainer, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapLine from "./MapLine";
import {
    UW_LATITUDE,
    UW_LATITUDE_CENTER, UW_LATITUDE_OFFSET, UW_LATITUDE_SCALE,
    UW_LONGITUDE,
    UW_LONGITUDE_CENTER,
    UW_LONGITUDE_OFFSET,
    UW_LONGITUDE_SCALE
} from "./Constants";

// This defines the location of the map. These are the coordinates of the UW Seattle campus
const position: LatLngExpression = [UW_LATITUDE_CENTER, UW_LONGITUDE_CENTER];

// NOTE: This component is a suggestion for you to use, if you would like to. If
// you don't want to use this component, you're free to delete it or replace it
// with your hw-lines Map

interface MapProps {
    edges : number[]
    color : string;
}

interface MapState {}

class Map extends Component<MapProps, {}> {

    /**
     * Converts x coordinate to longitude
     */
    xToLon(x: number): number {
        return UW_LONGITUDE + (x - UW_LONGITUDE_OFFSET) * UW_LONGITUDE_SCALE;
    }

    /**
     * Converts y coordinate to latitude
     */
    yToLat(y: number): number {
        return UW_LATITUDE + (y - UW_LATITUDE_OFFSET) * UW_LATITUDE_SCALE;
    }

    render() {
        let fillOptions = { color: this.props.color}
        let start : LatLngExpression = [this.yToLat(+this.props.edges[1]), this.xToLon(+this.props.edges[0])];
        let end : LatLngExpression = [this.yToLat(+this.props.edges[this.props.edges.length-1]), this.xToLon(+this.props.edges[this.props.edges.length-2])];
        let lines: JSX.Element[] = []
        for (let i = 0; i < this.props.edges.length; i+=4) {
            lines.push(
                <MapLine key = {i} color={this.props.color} x1={+this.props.edges[i]} y1={+this.props.edges[i+1]} x2={+this.props.edges[i+2]} y2={+this.props.edges[i+3]}/>
            );
        }
        if (this.props.edges.length > 2) {
            lines.push(
                <Circle center={start} pathOptions={fillOptions} radius={8} />
            );

            lines.push(
                <Circle center={end} pathOptions={fillOptions} radius={8} />
            );
        }

        return (
            <div id="map">
                <MapContainer
                    center={position}
                    zoom={15}
                    scrollWheelZoom={true}
                >

                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {lines}
                </MapContainer>
            </div>
        );
    }
}

export default Map;
