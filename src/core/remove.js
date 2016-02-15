import {compose, curry, dissocPath, reduce, prop, map} from 'ramda';

import {
  hasEdgesFromTo, hasEdgeWithId,
  getEdgesFromTo, getEdgeWithId, 
  getEdgesToNode, getEdgesFromNode,
  getEdgesIncidentToNode, 
  getEdgesBetween
} from './edges'

import {
  hasNode
} from './nodes';




export const removeEdgesFromTo = curry((startNodeId, endNodeId, graph) => {
  if (!hasEdgesFromTo(startNodeId, endNodeId, graph)) return graph;

  return compose(
    reduce(
      (res, edgeId) => removeEdgeWithId(edgeId, res),
      graph),
    map(prop('id')),
    getEdgesFromTo(startNodeId, endNodeId)
  )(graph);
});

export const removeEdgeWithId = curry((edgeId, graph) => {
  if (!hasEdgeWithId(edgeId, graph)) return graph;

  const {from, to} = getEdgeWithId(edgeId, graph);

  return compose(
    dissocPath(['nodes', from, 'edgesFrom', edgeId]),
    dissocPath(['nodes', to, 'edgesTo', edgeId]),
    dissocPath(['edges', edgeId])
  )(graph);
});

export const removeNode = curry((nodeId, graph) => {
  if (!hasNode(nodeId, graph)) return graph;

  const toRemoveEdgeIds = compose(
    map(prop('id')),
    getEdgesIncidentToNode(nodeId)
  )(graph);

  const removedEdges = reduce( (result, edgeId) => removeEdgeWithId(edgeId, result), graph, toRemoveEdgeIds);
  const removedNode = dissocPath(['nodes', nodeId], removedEdges);

  return removedNode;
});


export const removeEdgesToNode = curry( (nodeId, graph) => (
  compose(
    reduce( (result, id) => removeEdgeWithId(id, result), graph ),
    map(prop('id')),
    getEdgesToNode(nodeId)
  )(graph)
));


export const removeEdgesFromNode = curry( (nodeId, graph) => (
  compose(
    reduce( (result, id) => removeEdgeWithId(id, result), graph ),
    map(prop('id')),
    getEdgesFromNode(nodeId)
  )(graph)
));

export const removeEdgesIncidentToNode = curry( (nodeId, graph) => (
  compose(
    removeEdgesToNode(nodeId),
    removeEdgesFromNode(nodeId)
  )(graph)
));


export const removeEdgesBetweenNodes = curry( (node1, node2, graph) => (
  compose(
    reduce( (result, id) => removeEdgeWithId(id, result), graph ),
    map(prop('id')),
    getEdgesBetween(node1, node2)
  )(graph)
));
