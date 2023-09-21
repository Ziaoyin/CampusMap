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

// Latitude of the UW Seattle campus
import React from "react";

export const UW_LATITUDE : number = 47.65878405511131;

// Offset to translate coordinate system
export const UW_LATITUDE_OFFSET : number = 807.35188;

// Scale to translate coordinate system
export const UW_LATITUDE_SCALE : number = -0.00000576766;

// Longitude of the UW Seattle campus
export const UW_LONGITUDE : number = -122.31305164734569;

// Offset to translate coordinate system
export const UW_LONGITUDE_OFFSET : number = 1370.6408;

// Scale to translate coordinate system
export const UW_LONGITUDE_SCALE : number = 0.00000848028;

// Map center
export const UW_LATITUDE_CENTER = 47.65440627742146;

// Map center
export const UW_LONGITUDE_CENTER = -122.30476957834502;


export const COLORS: string[] = ["Red", "Blue", "Green", "Pink", "Yellow", "Black", "Purple"];

// color for lines
export const DEFAULT_COLOR: string = COLORS[0];

export const INSTRUCTIONS: string[] = ["We're thrilled to introduce you to Campus Mapper, the ultimate tool crafted to provide" +
"you with a frictionless experience as you navigate the intricate pathways of the UW campus." +
"Below, we present an in-depth guide to help you maximize the potential of our feature-rich" +
"map interface:", "Positioned elegantly at the bottom left corner of the interface, our intuitive search bar" +
"serves as your portal to pinpointing specific buildings across campus. As you type in your desired" +
"location, our intelligent algorithm swiftly suggests matching options. Once you've selected" +
"your locations, a single tap on \"Map\" illuminates the shortest and most efficient route connecting" +
"these points. Not just directions, but you'll also be provided with the exact distance (in feet) separating" +
"the two buildings, ensuring you're equipped with comprehensive information. Should you wish" +
"to start anew, the \"Clear\" button swiftly resets your choices and the map, ready for your" +
"next exploration.", "Delving deeper into customization, we empower you to imprint your unique journey on the map." +
"Adding a personal touch to the campus exploration experience, you can seamlessly integrate your" +
"own buildings or special locations onto the map. All it takes is entering the building components" +
"as per our specifications, and voilà – your campus becomes a canvas for your" +
"distinctive exploration.", "Recognizing that a visually engaging interface enhances the exploration journey, we invite you to" +
"infuse vibrant life into your map. Create an environment that resonates with your aesthetic preferences," +
"and let the map reflect your personal journey through shades that inspire you."];