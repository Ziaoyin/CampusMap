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

package campuspaths;

import campuspaths.utils.CORSFilter;
import com.google.gson.Gson;
import pathfinder.CampusMap;
import pathfinder.datastructures.Path;
import pathfinder.datastructures.Point;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Spark;
import java.util.*;

public class SparkServer {

    public static void main(String[] args) {
        CORSFilter corsFilter = new CORSFilter();
        corsFilter.apply();
        // The above two lines help set up some settings that allow the
        // React application to make requests to the Spark server, even though it
        // comes from a different server.
        // You should leave these two lines at the very beginning of main().

        CampusMap campus = new CampusMap();

        // to find the shortest path
        Spark.get("/find", new Route() {
            @Override
            public Object handle(Request request, Response response) throws Exception {
                String start = request.queryParams("start");
                String end = request.queryParams("end");

                Path<Point> path = campus.findShortestPath(start, end);

                Gson gson = new Gson();
                return gson.toJson(path);
            }
        });

        // to get all the possible buildings
        Spark.get("/get", new Route() {
           @Override
           public Object handle(Request request, Response response) throws Exception {
               Set<String> campusMap = new TreeSet<>(campus.buildingNames().keySet());
               List<List<String>> result = new ArrayList<>();

               for (String key : campusMap) {
                   List<String> pair = new ArrayList<>();
                   pair.add(key);
                   pair.add(campus.longNameForShort(key));
                   result.add(pair);
               }

               Gson gson = new Gson();
               return gson.toJson(result);
            }
        });

        // to check if a given building is a valid building
        Spark.get("/check", new Route() {
            @Override
            public Object handle(Request request, Response response) throws Exception {
                String shortName = request.queryParams("short").replace("and", "&");
                String longName = request.queryParams("long").replace("and", "&");

                Gson gson = new Gson();
                // checks that the short name exists and that the long name is the long of the short name given
                return gson.toJson(campus.shortNameExists(shortName) &&
                                (longName.equals(campus.longNameForShort(shortName))));
            }
        });

        // to add a building to the campus
        Spark.get("/add", new Route() {
            @Override
            public Object handle(Request request, Response response) throws Exception {
                String x = request.queryParams("x");
                String y = request.queryParams("y");
                String shortName = request.queryParams("shortName");
                String longName = request.queryParams("longName");

                campus.addBuilding(Double.parseDouble(x), Double.parseDouble(y), shortName, longName);

                List<String> list = new ArrayList<>();
                list.add(shortName);
                list.add(longName);
                Gson gson = new Gson();
                List<List<String>> result = new ArrayList<>();
                result.add(list);
                return gson.toJson(result);
            }
        });
    }

}
