import {map, compose, equals, flatten, union, all, prop, intersection, difference, length} from 'ramda';

import {
  getNodesAdjacentTo,
  getEdgesBetween
} from '../core';

const MAX_CHECKS = 1000;

export const hasCyclesInConnectedComponent = (startNodeId, graph) => {
  // simple iterative-deepening depth-first search
  
  let visited = [startNodeId];
  let fringe = map(
    node => ({father: startNodeId, node, adjacent: getNodesAdjacentTo(node, graph)}),
    getNodesAdjacentTo(startNodeId, graph)
  );

  let lastFringe = fringe;
  let lastVisited = visited;
  if (!checkCycleCondition(visited, fringe, graph)) return true;

  for(let i = 1; i < MAX_CHECKS; i++) {
    const {nextFringe, nextVisited} = getNextFringeAndVisited(lastFringe, lastVisited, graph);

    if (!checkCycleCondition(nextVisited, nextFringe, graph)) return true;
    if (equals(nextFringe, [])) return false;

    [lastFringe, lastVisited] = [nextFringe, nextVisited];
  }
  

  throw new Error('hasCyclesInConnectedComponent: made more than 1,000 checks');
}

const getNextFringeAndVisited = (fringe, visited, graph) => {
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

const checkCycleCondition = (visited, fringe, graph) => {
  for(let fringeNode of fringe) {
    const {father, node, adjacent} = fringeNode;

    const nEdgesFromFatherToNode = length(getEdgesBetween(father, node, graph));
    if (nEdgesFromFatherToNode > 1) return false;

    const visitedIntersectedWithAdjacent = intersection(visited, adjacent);
    if(!all(equals(father), visitedIntersectedWithAdjacent)) return false;
  };

  return true;
};


