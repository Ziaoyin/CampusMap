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

package pathfinder;

import graph.Graph;
import pathfinder.datastructures.Path;
import pathfinder.datastructures.Point;
import pathfinder.parser.CampusBuilding;
import pathfinder.parser.CampusPath;
import pathfinder.parser.CampusPathsParser;

import java.util.*;

/**
 * Represents a model of a campus map 
 * Implements the ModelAPI interface
 */
public class CampusMap implements ModelAPI {
    private Graph<Point, Double> campus; // graph representing the possible locations
    private Map<CampusBuilding, Point> locations; // maps campus building to their point locations
    private Map<String, CampusBuilding> names; // maps short name top campus building
    private static final String campusBuildings = "campus_buildings.csv";
    private static final String campusPaths = "campus_paths.csv";

    public static final boolean DEBUG = false;

    // RI: campus != null, locations != null, and names != null. locations and names contain no
    // null elements. Values of names are keys in locations. Values of locations are vertices in campus.

    // AF(this) = campus, containing all possible points, with all buildings in locations.keySet()

    /**
     * Constructs a new campus map
     */
    public CampusMap() {
        campus = new Graph<>();
        locations = new HashMap<>();
        names = new HashMap<>();
        List<CampusBuilding> buildings = CampusPathsParser.parseCampusBuildings(campusBuildings);
        List<CampusPath> paths = CampusPathsParser.parseCampusPaths(campusPaths);

        for (CampusPath p : paths) {
            Point p1 = new Point(p.getX1(), p.getY1());
            Point p2 = new Point(p.getX2(), p.getY2());
            campus.addVertex(p1);
            campus.addVertex(p2);
            campus.addEdge(p1, p2, p.getDistance());
        }

        for (CampusBuilding building : buildings) {
            locations.put(building, new Point(building.getX(), building.getY()));
            names.put(building.getShortName(), building);
        }
        checkRep();
    }

    /**
     * Checks whether a given short acronym/name exists for a building
     * @param shortName The short name of a building to query.
     * @return whether a given short acronym/name exists for a building
     */
    @Override
    public boolean shortNameExists(String shortName) {
        checkRep();
        return names.containsKey(shortName);
    }

    /**
     * Returns the string that represents longer name of the same building as the given short name
     * @param shortName The short name of a building to look up.
     * @return the longer name of the given short name
     * @throws IllegalArgumentException if the given short name doesn't exist
     */
    @Override
    public String longNameForShort(String shortName) {
        checkRep();
        if (!names.containsKey(shortName)) {
            throw new IllegalArgumentException();
        }
        String longName = names.get(shortName).getLongName();
        checkRep();
        return longName;
    }

    /**
     * @return a mapping from all buildings' short/acronym names to long names
     */
    @Override
    public Map<String, String> buildingNames() {
        checkRep();
        Map<String, String> result = new HashMap<>();
        for (CampusBuilding building : locations.keySet()) {
            result.put(building.getShortName(), building.getLongName());
        }
        checkRep();
        return result;
    }

    /**
     * Find the shortest path, by distance, between two given buildings
     * @param startShortName The short name of the building at the beginning of this path.
     * @param endShortName   The short name of the building at the end of this path.
     * @return a path between the start building to end building, or null if no path exists
     * @throws IllegalArgumentException if startShortName or endShortName are null, or
     *                                  if startShortName or endShortName is not associated with a valid building
     */
    @Override
    public Path<Point> findShortestPath(String startShortName, String endShortName) {
        checkRep();
        if (startShortName == null || endShortName == null
                || !shortNameExists(startShortName) || !shortNameExists(endShortName)) {
            throw new IllegalArgumentException();
        }
        CampusBuilding start = names.get(startShortName);
        CampusBuilding end = names.get(endShortName);
        Path<Point> minPath = MinGraph.findMin(campus, locations.get(start), locations.get(end));
        checkRep();
        return minPath;
    }

    /**
     * Adds the given building into the campus
     * @param x the x coordinate of the building
     * @param y the y coordinate of the building
     * @param shortName the short name associated with the building
     * @param longName the long name associated with the building
     */
    public void addBuilding(double x, double y, String shortName, String longName) {
        CampusBuilding build = new CampusBuilding(shortName, longName, x, y);
        Point point = new Point(x, y);
        names.put(shortName, build);
        locations.put(build, point);
        campus.addVertex(point);
    }

    /**
     * Checks that the representation invariant for this is held
     */
    private void checkRep() {
        assert campus != null && locations != null && names != null;

        if (DEBUG) {
            for (String name : names.keySet()) {
                assert name != null;
                assert names.get(name) != null;
                assert locations.containsKey(names.get(name));
            }

            for (CampusBuilding build : locations.keySet()) {
                assert build != null;
                assert locations.get(build) != null;
                assert campus.hasVertex(locations.get(build));
            }
        }
    }
}
