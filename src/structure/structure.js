import {map, compose, equals, flatten, union, all, prop, intersection, difference, length} from 'ramda';

import {
  getNodesAdjacentTo,
  getEdgesBetween
} from '../core';

export const hasCyclesInConnectedComponent = (startNodeId, graph) => {
  // simple iterative-deepening depth-first search
  
  let visited = [startNodeId];
  let fringe = map(
    node => ({father: startNodeId, node, adjacent: getNodesAdjacentTo(node, graph)}),
    getNodesAdjacentTo(startNodeId, graph)
  );

  let lastFringe = fringe;
  let lastVisited = visited;
  if (!checkCondition(visited, fringe, graph)) return true;

  for(let i = 0; i < 10000; i++) {
    const {nextFringe, nextVisited} = iterate(lastFringe, lastVisited, graph);

    if (!checkCondition(nextVisited, nextFringe, graph)) return true;
    if (equals(nextFringe, [])) return false;

    [lastFringe, lastVisited] = [nextFringe, nextVisited];
  }
  

  return;
}

const checkCondition = (visited, fringe, graph) => {
  for(let fringeNode of fringe) {
    const {father, node, adjacent} = fringeNode;

    const nEdgesFromFatherToNode = length(getEdgesBetween(father, node, graph));
    if (nEdgesFromFatherToNode > 1) return false;

    const visitedIntersectedWithAdjacent = intersection(visited, adjacent);
    if(!all(equals(father), visitedIntersectedWithAdjacent)) return false;
  };

  return true;
};


const iterate = (fringe, visited, graph) => {
  const prevFringe = map(prop('node'), fringe);
  const nextVisited = union(visited, prevFringe);
  const nextFringe = compose(
    flatten,
    map(father => 
      map(node => ({father, node, adjacent: getNodesAdjacentTo(node, graph)}),
      difference(getNodesAdjacentTo(father, graph), visited)))
  )(prevFringe);

  return {nextFringe, nextVisited};
}

