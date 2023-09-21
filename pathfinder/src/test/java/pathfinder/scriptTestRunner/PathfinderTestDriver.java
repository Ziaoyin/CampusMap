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

package pathfinder.scriptTestRunner;

import graph.Graph;
import pathfinder.MinGraph;
import pathfinder.datastructures.Path;

import java.io.*;
import java.util.*;

/**
 * This class implements a test driver that uses a script file format
 * to test an implementation of Dijkstra's algorithm on a graph.
 */
public class PathfinderTestDriver {
    private final Map<String, Graph<String, Double>> graphs = new HashMap<>();
    private final PrintWriter output;
    private final BufferedReader input;
    // Leave this constructor public
    public PathfinderTestDriver(Reader r, Writer w) {
        // TODO: Implement this, reading commands from `r` and writing output to `w`.
        // See GraphTestDriver as an example.
        input = new BufferedReader(r);
        output = new PrintWriter(w);
    }

    /**
     * @throws IOException if the input or output sources encounter an IOException
     * @spec.effects Executes the commands read from the input and writes results to the output
     **/
    // Leave this method public
    public void runTests() throws IOException {
        String inputLine;
        while((inputLine = input.readLine()) != null) {
            if((inputLine.trim().length() == 0) ||
                    (inputLine.charAt(0) == '#')) {
                // echo blank and comment lines
                output.println(inputLine);
            } else {
                // separate the input line on white space
                Scanner scan = new Scanner(inputLine);
                String command = scan.next();
                String graphName = scan.next();
                if (command.equals("CreateGraph")) {
                    createGraph(graphName);
                } else if (command.equals("AddNode")) {
                    String nodeData = scan.next();
                    addNode(graphName, nodeData);
                } else if (command.equals("AddEdge")) {
                    String parentNode = scan.next();
                    String childNode = scan.next();
                    Double edgeLabel = scan.nextDouble();
                    addEdge(graphName, parentNode, childNode, edgeLabel);
                } else if (command.equals("ListNodes")) {
                    listNodes(graphName);
                } else if (command.equals("ListChildren")) {
                    String parentNode = scan.next();
                    listChildren(graphName, parentNode);
                } else if (command.equals("FindPath")) {
                    String sourceNode = scan.next();
                    String destNode = scan.next();
                    findPath(graphName, sourceNode, destNode);
                } else {
                    output.println("Unrecognized command: " + command);
                    break;
                }
            }
            output.flush();
        }
    }

    private void createGraph(String graphName) {
        graphs.put(graphName, new Graph<>());
        output.println("created graph " + graphName);
    }

    private void addNode(String graphName, String nodeName) {
        Graph<String, Double> graph = graphs.get(graphName);
        graph.addVertex(nodeName);
        output.println("added node " + nodeName + " to " + graphName);
    }

    private void addEdge(String graphName, String parentName, String childName,
                         Double edgeLabel) {
        Graph<String, Double> graph = graphs.get(graphName);
        graph.addEdge(parentName, childName, edgeLabel);
        output.println(String.format("added edge %.3f", edgeLabel) + " from "
                + parentName + " to " + childName + " in " + graphName);
    }

    private void listNodes(String graphName) {
        Graph<String, Double> graph = graphs.get(graphName);
        Set<String> nodes = new TreeSet<>(graph.getVertices());
        StringBuilder builder = new StringBuilder();
        for (String node : nodes) {
            builder.append(" ");
            builder.append(node);
        }
        output.println(graphName + " contains:" + builder.toString());
    }

    private void listChildren(String graphName, String parentName) {
        Graph<String, Double> graph = graphs.get(graphName);
        Set<String> nodes = new TreeSet<>(graph.getOutgoing(parentName));
        StringBuilder builder = new StringBuilder();
        for (String child : nodes) {
            Set<Double> outgoing = new TreeSet<>(graph.getLabel(parentName, child));
            for (Double edge : outgoing) {
                builder.append(" ");
                builder.append(child);
                builder.append("(");
                builder.append(edge );
                builder.append(")");
            }
        }
        output.println("the children of " + parentName + " in "
                       + graphName + " are:" + builder.toString());
    }

    private void findPath(String graphName, String nodeName, String destName) {
        Graph<String, Double> graph = graphs.get(graphName);
        if (!graph.hasVertex(nodeName)) {
            output.println("unknown: " + nodeName);
        } else if (!graph.hasVertex(destName)) {
            output.println("unknown: " + destName);
        } else {
            Path<String> path = MinGraph.findMin(graph, nodeName, destName);
            output.println("path from " + nodeName + " to " + destName + ":");
            if (path == null) {
                output.println("no path found");
            } else {
                for (Path<String>.Segment segment : path) {
                    output.println(segment.getStart() + " to " + segment.getEnd()
                            + String.format(" with weight %.3f", segment.getCost()));
                }
                output.println(String.format("total cost: %.3f", path.getCost()));
            }
        }
    }
}
