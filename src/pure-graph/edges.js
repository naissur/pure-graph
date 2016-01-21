import {compose, curry, find, prop, values, equals, keys, reject, omit, pick} from 'ramda';
import is from 'is';
import {hasNode} from './nodes';
import xtend from 'xtend';

export const addEdge = curry((edgeId, startNodeId, endNodeId, graph) => {
  const hasStart = hasNode(startNodeId, graph);
  const hasEnd = hasNode(endNodeId, graph);

  if (!hasStart && !hasEnd) throw new Error(`addEdge: nodes ${startNodeId} and ${endNodeId} do not exist`);
  if (!hasStart) throw new Error(`addEdge: node ${startNodeId} does not exist`);
  if (!hasEnd) throw new Error(`addEdge: node ${endNodeId} does not exist`);

  const toExtend = {
    edges: xtend({}, graph.edges, {[edgeId]: {id: edgeId, from: startNodeId, to: endNodeId}})
  };

  return xtend({}, graph, toExtend);
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


export const removeEdgeFromTo = curry((startNodeId, endNodeId, graph) => {
  const filteredEdges = reject(compose(
    equals({from: startNodeId, to: endNodeId}),
    pick(['from', 'to'])
  ), graph.edges)
  
  return xtend({}, graph, {edges: filteredEdges});
});

export const removeEdgeWithId = curry((edgeId, graph) => {
  const filteredEdges = omit([edgeId], graph.edges);
  return xtend({}, graph, {edges: filteredEdges});
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

