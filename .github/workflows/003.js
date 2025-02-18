
// Dijkstra's Algorithm to find the shortest path in a weighted graph
function dijkstra(graph, startNode) {
    const distances = {};
    const visited = new Set();
    const previousNodes = {};

    // Initialize distances
    for (let node in graph) {
        distances[node] = Infinity;
        previousNodes[node] = null;
    }
    distances[startNode] = 0;

    while (visited.size < Object.keys(graph).length) {
        // Find the unvisited node with the smallest distance
        let currentNode = Object.keys(distances)
            .filter(node => !visited.has(node))
            .reduce((closestNode, node) => 
                distances[node] < distances[closestNode] ? node : closestNode, 
                Object.keys(distances)[0]);

        // Mark the node as visited
        visited.add(currentNode);

        // Update distances for neighbors
        for (let neighbor in graph[currentNode]) {
            let distance = distances[currentNode] + graph[currentNode][neighbor];
            if (distance < distances[neighbor]) {
                distances[neighbor] = distance;
                previousNodes[neighbor] = currentNode;
            }
        }
    }

    return { distances, previousNodes };
}

// Function to retrieve the shortest path from start to end node
function getPath(previousNodes, startNode, endNode) {
    const path = [];
    for (let at = endNode; at !== null; at = previousNodes[at]) {
        path.push(at);
    }
    return path.reverse();
}

// Example usage
const graph = {
    A: { B: 1, C: 4 },
    B: { A: 1, C: 2, D: 5 },
    C: { A: 4, B: 2, D: 1 },
    D: { B: 5, C: 1 }
};

const startNode = 'A';
const endNode = 'D';
const { distances, previousNodes } = dijkstra(graph, startNode);
const path = getPath(previousNodes, startNode, endNode);

console.log("Shortest distances from start node:", distances);
console.log(`Shortest path from ${startNode} to ${endNode}:`, path);
