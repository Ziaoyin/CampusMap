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
import {COLORS} from "./Constants";

interface LocationProps {
    onChange:(edges: string[]) => any;
    locations: string[][];
    onClear: () => any;
    onShow: () => any;
    addBuild: (value: string) => any;
    onColor: (value: string) => any;
    totalCost: number;
}

interface LocationState {
    start : string;
    end : string;
    fromTo: string[];
    addText: string;
    colorText: string;
}

/**
 * A text field that allows the user to enter the list of edges.
 * Also contains the buttons that the user will use to interact with the app.
 */
class LocationList extends Component<LocationProps, LocationState> {

    constructor(props: LocationProps) {
        super(props);
        this.state = {
            start: "",
            end: "",
            fromTo: ["", ""],
            addText: "",
            colorText: "red"
        };
    }

    /**
     * clears the textbox
     */
    clearText() {
        this.setState({
            start : "",
            end: "",
            fromTo: []
        });
    }

    /**
     * sets the start location
     * @param message the name of the location
     */
    setStart(message : string) {
        this.setState({
            start : message,
            fromTo: [message, this.state.end]
        });
    }

    /**
     * sets the end location
     * @param message the name of the location
     */
    setEnd(message : string) {
        this.setState({
            end : message,
            fromTo: [this.state.start, message]
        });
    }


    render() {
        let location: JSX.Element[] = [];
        let colors: JSX.Element[]  = [];

        for (let i = 0; i < this.props.locations.length; i++) {
            let pair = this.props.locations[i];
            location.push(<option key={i}>{pair[0] + ": " + pair[1]}</option>);
        }

        for (let i = 0; i < COLORS.length; i++) {
            colors.push(<option value={COLORS[i]}>{COLORS[i]}</option>);
        }


        return (
            <div>
                <div id="edge-list">
                    <label>{"Choose Starting Point:"}
                        <input list="locations"
                               placeholder={"Start:"}
                               name="start"
                               value={this.state.start}
                               onChange={(event: any) => this.setStart(event.target.value)}/>
                        </label>
                    <datalist id="locations">
                        {location}
                    </datalist>

                    <label>{"Choose Destination:"}
                        <input
                            list="locations"
                            placeholder={"End:"}
                            name="end"
                            value={this.state.end}
                            onChange={(event: any) => this.setEnd(event.target.value)}/>
                        </label>
                    <datalist id="locations">
                        {location}
                    </datalist>

                    <button onClick={() => {this.props.onChange(this.state.fromTo)}}>Map</button>
                    <button onClick={() => {this.props.onClear(); this.clearText()}}>Clear</button>
                    <br/>
                    <label><strong>{"Distance: " + Math.round(this.props.totalCost) + " feet"}</strong></label>
                </div>
                <div id={"misc-menu"}>
                    <button onClick={() => {this.props.onShow()}}>Instructions</button>
                    <textarea
                        placeholder={"Enter New Building: \<x1\> \<y1\> \<shortName\> \<longName\>"}
                        rows={2}
                        cols={30}
                        onChange={(event: any) => this.setState({addText:event.target.value})}
                        value={this.state.addText}
                    />
                    <button onClick={() => {this.props.addBuild(this.state.addText)}}>Add</button>
                    <br/>
                    <label>Choose a color:</label>
                    <select name={"options"} id={"options"} onChange={(event: any) => this.setState({colorText:event.target.value})}>
                        {colors}
                    </select>
                    <br/>
                    <button onClick={() => {this.props.onColor(this.state.colorText)}}>Color</button>
                </div>
            </div>
        );
    }
}

export default LocationList;
