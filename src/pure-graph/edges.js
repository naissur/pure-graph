import {compose, curry, find, prop, values, keys, assocPath, map, contains} from 'ramda';
import xtend from 'xtend';
import {hasNode} from './nodes';

export const getEdgesFromNode = curry( (nodeId, graph) => {
  if (!hasNode(nodeId, graph)) throw new Error(`getEdgesFromNode: no node with the id ${nodeId}`);

  return compose(
    map(edgeId => getEdgeWithId(edgeId, graph)),
    keys
  )(graph.nodes[nodeId].edgesFrom);
});


export const getEdgesToNode = curry( (nodeId, graph) => {
  if (!hasNode(nodeId, graph)) throw new Error(`getEdgesToNode: no node with the id ${nodeId}`);

  return compose(
    map(edgeId => getEdgeWithId(edgeId, graph)),
    keys
  )(graph.nodes[nodeId].edgesTo);
});

export const getEdgesIncidentToNode = curry( (nodeId, graph) => {
  if (!hasNode(nodeId, graph)) throw new Error(`getEdgesIncidentToNode: no node with the id ${nodeId}`);
  const {edgesFrom, edgesTo} = graph.nodes[nodeId];
  
  return compose(
    map(edgeId => getEdgeWithId(edgeId, graph)),
    keys
  )(xtend(edgesFrom, edgesTo));
});

export const getEdgeFromTo = curry( (startNodeId, endNodeId, graph) => {
  if (!hasEdgeFromTo(startNodeId, endNodeId, graph)) {
    throw new Error(`getEdgeFromTo: edge from ${JSON.stringify(startNodeId)} to ${JSON.stringify(endNodeId)} doesn't exist`);
  }

  const edgesFromStart = getEdgesFromNode(startNodeId, graph); // find among the edges from start node
  return find(edge => (edge.to === endNodeId), edgesFromStart);
});


const getReachableNodesIds = curry((nodeId, graph) => (
  compose(
    map(prop('to')),
    getEdgesFromNode(nodeId)
  )(graph)
));


export const getEdges = compose(values, prop('edges'));

export const hasEdgeFromTo = curry((startNodeId, endNodeId, graph) => {
  if (!hasNode(startNodeId, graph)) return false;
  if (!hasNode(endNodeId, graph)) return false;

  const reachableFromStart = getReachableNodesIds(startNodeId, graph); // check only the nodes reachable from the start one

  return contains(endNodeId, reachableFromStart);
});

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


export const getEdgeWithId = curry( (edgeId, graph) => {
  if (!hasEdgeWithId(edgeId, graph)) throw new Error(`getEdgeWithId: edge with id ${JSON.stringify(edgeId)} doesn't exist`);

  return graph.edges[edgeId];
});

export const hasEdgeWithId = curry( (edgeId, graph) => {
  return !!graph.edges[edgeId];
});



