package pathfinder;

import graph.Graph;
import pathfinder.datastructures.Path;

import java.util.PriorityQueue;
import java.util.*;

/**
 * A utility class that can find the shortest path within a graph representing
 * a map.
 */
public class MinGraph {

    // Doesn't represent an ADT so no RI or AF is appropriate

    /**
     * Finds the shortest path from a given source node to destination node
     * @spec.requires the given source and destination label must be associated with nodes in the graph
     * @param graph a directed labeled graph in which the path needs to be found
     * @param source the label associated with the node in which we start from
     * @param destination the label associated with the node we are trying to find the shortest path to
     * @return a Path representing the shortest path from the source to the destination
     *         otherwise if there is no path between the two nodes, returns null
     */
    public static <K> Path<K> findMin(Graph<K, Double> graph, K source, K destination) {
        Queue<Path<K>> active = new PriorityQueue<>(Comparator.comparingDouble(Path::getCost));
        Set<K> finished = new HashSet<>();

        active.add(new Path<>(source));

        while (!active.isEmpty()) {
            Path<K> minPath = active.remove();
            K minDest = minPath.getEnd();

            if (minDest.equals(destination)) {
                return minPath;
            }

            if (finished.contains(minDest)) {
                continue;
            }
            for (K child : graph.getOutgoing(minDest)) {
                if (!finished.contains(child)) {
                    Path<K> newPath = minPath.extend(child, Collections.min(graph.getLabel(minDest, child)));
                    active.add(newPath);
                }
            }

            finished.add(minDest);
        }
        return null;
    }
}
