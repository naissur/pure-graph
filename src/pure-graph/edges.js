import {compose, curry, find, prop, values, equals, keys, assocPath, dissocPath, map} from 'ramda';
import is from 'is';
import {hasNode} from './nodes';
import xtend from 'xtend';

export const addEdge = curry((edgeId, startNodeId, endNodeId, graph) => {
  const hasStart = hasNode(startNodeId, graph);
  const hasEnd = hasNode(endNodeId, graph);

  if (!hasStart && !hasEnd) throw new Error(`addEdge: nodes ${startNodeId} and ${endNodeId} do not exist`);
  if (!hasStart) throw new Error(`addEdge: node ${startNodeId} does not exist`);
  if (!hasEnd) throw new Error(`addEdge: node ${endNodeId} does not exist`);


  const newEdge = {id: edgeId, from: startNodeId, to: endNodeId};
  return compose(
    assocPath(['nodes', startNodeId, 'edgesFrom', edgeId], true ),
    assocPath(['nodes', endNodeId, 'edgesTo', edgeId], true ),
    assocPath(['edges', edgeId], newEdge)
  )(graph);
});

export const hasEdgeFromTo = curry((startNodeId, endNodeId, graph) => {
  const edges = values(graph.edges);

  return !!find(e => (e.from === startNodeId &&
                      e.to === endNodeId), edges);
});

export const hasEdgeWithId = curry( (edgeId, graph) => {
  const edgeIds = keys(graph.edges);
  return !!find(equals(edgeId), edgeIds);
});



export const getEdges = compose(values, prop('edges'));

export const getEdgeFromTo = curry( (startNodeId, endNodeId, graph) => {
  const edges = values(graph.edges);
  const edge = find(e => (e.from === startNodeId &&
                          e.to === endNodeId), edges);

  if (!is.defined(edge)) throw new Error(`getEdgeFromTo: edge from ${JSON.stringify(startNodeId)} to ${JSON.stringify(endNodeId)} doesn't exist`);

  return edge;
});

export const getEdgeWithId = curry( (edgeId, graph) => {
  if (!hasEdgeWithId(edgeId, graph)) throw new Error(`getEdgeWithId: edge with id ${JSON.stringify(edgeId)} doesn't exist`);

  return graph.edges[edgeId];
});

