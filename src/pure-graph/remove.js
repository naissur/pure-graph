import {compose, curry, dissocPath, reduce, prop, map} from 'ramda';

import {
  hasEdgeFromTo, hasEdgeWithId,
  getEdgeFromTo, getEdgeWithId, 
  getEdgesToNode, getEdgesFromNode,
  getEdgesIncidentToNode
} from './edges'

import {
  hasNode
} from './nodes';




export const removeEdgeFromTo = curry((startNodeId, endNodeId, graph) => {
  if (!hasEdgeFromTo(startNodeId, endNodeId, graph)) return graph;

  return compose(
    edgeId => removeEdgeWithId(edgeId, graph),
    prop('id'),
    getEdgeFromTo(startNodeId, endNodeId)
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

