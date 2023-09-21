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

import React, {Component} from 'react';

// Allows us to write CSS styles inside App.css, any styles will apply to all components inside <App />
import "./App.css";
import LocationList from "./LocationList";
import Map from "./Map";
import {DEFAULT_COLOR, INSTRUCTIONS} from "./Constants";

interface AppState {
    locations : string[][];
    coordinates: number[];
    show: boolean;
    color: string;
    cost: number;
}

// Interface represents a Path with two points
interface Path {
    start : Point;
    end: Point;
}

// Interface represents a Point wiht a coordinate
interface Point {
    x: number;
    y: number;
}
class App extends Component<{}, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            locations : [],
            coordinates : [],
            show: false,
            color: DEFAULT_COLOR,
            cost: 0
        }
        this.getLocations();
    }

    /**
     * gets all the locations of buildings
     */
    getLocations = async () => {
        try {
            let response = await fetch("http://localhost:4567/get");

            if (!response.ok) {
                alert("The status is wrong! Expected: 200, Was: " + response.status);
                return;
            }

            let responseObject = (await response.json()) as string[][];


            this.setState({
                locations: responseObject
            });
        } catch (e) {
           alert("There was an error contacting the server.");
        }
    }

    /**
     * checks if the locations are valid
     * @param message the string[] representing the buildings
     */
    checkLocations = async (message: string[]) => {
        try {
            let shortLong : string[] = message[0].split(": ").concat(message[1].split(": "));
            // twice, for both buildings
            for (let i = 0; i < 4; i+=2) {
                let responsePromise = fetch("http://localhost:4567/check?short="
                                                        + shortLong[i].replaceAll("&", "and") + "&long="
                                                        + shortLong[i + 1].replaceAll("&", "and"));

                let response = await responsePromise;

                if (!response.ok) {
                    alert("The status is wrong! Expected: 200, Was: " + response.status);
                    return;
                }

                let responseObject = (await response.json()) as boolean;

                // if false, that means it is not an accurate building
                if (!responseObject) {
                    alert(shortLong[i] + ": " + shortLong[i + 1] + " is not a building!");
                    return;
                }

            }

            this.findPath(shortLong);

        } catch (e) {
            alert("There was an error contacting the server.")
        }
    }

    /**
     * finds the shortest path from two given buildings
     * @param shortLong the array representing the building names in the format of pairs
     */
    findPath = async (shortLong : string[]) => {
        try {
            let responsePromise = fetch("http://localhost:4567/find?start=" + shortLong[0] + "&end="+ shortLong[2]);
            let response = await responsePromise;

            if (!response.ok) {
                alert("The status is wrong! Expected: 200, Was: " + response.status);
                return;
            }

            let responseObject = await response.json();
            if (responseObject == null) {
                alert("There is no path between the two!");
                return;
            }

            let cost = responseObject.cost as number;
            let list = responseObject.path as Path[];

            let result : number[] = [];

            // add all the coordinates in groups of 4
            for (let i = 0; i < list.length; i++) {
                result.push(list[i].start.x);
                result.push(list[i].start.y);
                result.push(list[i].end.x);
                result.push(list[i].end.y);
            }


            this.setState({
                coordinates: result,
                cost: cost
            });

        } catch (e) {
            alert("There was an error contacting the server.")
        }
    }

    /**
     * adds the building to the campus
     * @param building the coordinates and name of the building to be added
     */
    addBuild = async (building : string) => {
        try {
            let params = building.split(" ").filter((element) => element.length != 0);

            if (params.length != 4) {
                alert("Add needs 4 components" + "\n" + "Currently have " + params.length + " components");
                return;
            } else if (isNaN(+params[0]) || isNaN(+params[1])) {
                alert(params[0] + " " + params[1] + " is not a proper coordinate!");
                return;
            } else if (+params[0] < 0 || +params[0] > 4000 || +params[1] < 0 || +params[1] > 4000) {
                alert("(" + params[0] + ", " + params[1] + ")" + " is not on campus!");
                return;
            }

            let responsePromise = fetch("http://localhost:4567/add?x=" + params[0] + "&y="
                                                        + params[1] + "&shortName="+ params[2] + "&longName="+ params[3]);
            let response = await responsePromise;

            if (!response.ok) {
                alert("The status is wrong! Expected: 200, Was: " + response.status);
                return;
            }

            let responseObject = (await response.json()) as string[][];

            this.setState({
                locations: this.state.locations.concat(responseObject)
            });

        } catch (e) {
            alert("There was an error contacting the server.")
        }
    }

    /**
     * clears maps
     */
    clear() {
        this.setState({
            coordinates : []
        })
    }

    /**
     * opens/closes the info panel
     */
    onShow() {
        this.setState({
           show: !this.state.show
        });
    }

    /**
     * changes the color of the lines to the given color
     * @param message the color of the line
     */
    color(message: string) {
        this.setState({
           color: message
        });
    }


    render() {
        let popup : JSX.Element;
        if (this.state.show) {
            popup = <div id={"leaflet-container"}>
                <div id={"instructions"}>
                    <h2>Instructions</h2>
                    <p>
                        {INSTRUCTIONS[0]}
                        <br></br> <br></br>
                        {INSTRUCTIONS[1]}
                        <br></br> <br></br>
                        {INSTRUCTIONS[2]}
                        <br></br> <br></br>
                        {INSTRUCTIONS[3]}
                    </p>
                    <button onClick={() => {this.onShow()}}>Close</button>
                </div>
            </div>
        } else {
            popup = <Map edges={this.state.coordinates} color={this.state.color}/>
        }


        return (
            <div>
                <h1 id="app-title">{"Campus Mapper!📌"}</h1>
                <div id={"map"}>
                    {popup}
                </div>
                    <LocationList
                        onChange={(value:string[]) => {this.checkLocations(value)}}
                        locations={this.state.locations}
                        onClear={() => {this.clear()}}
                        onShow={() => {this.onShow()}}
                        addBuild={(value: string) => {this.addBuild(value)}}
                        onColor={(value: string) => this.color(value)}
                        totalCost={this.state.cost}
                    ></LocationList>
            </div>


        );
    }

}

export default App;
