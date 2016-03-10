import {compose, curry, prop, values, keys, assocPath, map, contains, path, flatten, without, uniq, filter} from 'ramda';
import xtend from 'xtend';
import {hasNode} from './nodes';



export const getEdges = compose(values, prop('edges'));

export const hasEdgeWithId = curry( (edgeId, graph) => {
  return !!path(['edges', edgeId], graph);
});

export const getEdgeWithId = curry( (edgeId, graph) => {
  if (!hasEdgeWithId(edgeId, graph)) throw new Error(`getEdgeWithId: edge with id ${JSON.stringify(edgeId)} doesn't exist`);

  return path(['edges', edgeId], graph);
});


export const getEdgesFromNode = curry( (nodeId, graph) => {
  if (!hasNode(nodeId, graph)) throw new Error(`getEdgesFromNode: no node with the id ${nodeId}`);

  return compose(
    map(edgeId => getEdgeWithId(edgeId, graph)),
    keys,
    path(['nodes', nodeId, 'edgesFrom'])
  )(graph);
});


export const getEdgesToNode = curry( (nodeId, graph) => {
  if (!hasNode(nodeId, graph)) throw new Error(`getEdgesToNode: no node with the id ${nodeId}`);

  return compose(
    map(edgeId => getEdgeWithId(edgeId, graph)),
    keys,
    path(['nodes', nodeId, 'edgesTo'])
  )(graph);
});

export const getEdgesIncidentToNode = curry( (nodeId, graph) => {
  if (!hasNode(nodeId, graph)) throw new Error(`getEdgesIncidentToNode: no node with the id ${nodeId}`);
  const {edgesFrom, edgesTo} = graph.nodes[nodeId];
  
  return compose(
    map(edgeId => getEdgeWithId(edgeId, graph)),
    keys
  )(xtend(edgesFrom, edgesTo));
});

export const getEdgesFromTo = curry( (startNodeId, endNodeId, graph) => {
  if (!hasEdgesFromTo(startNodeId, endNodeId, graph)) {
    return [];
  }

  const edgesFromStart = getEdgesFromNode(startNodeId, graph); // find among the edges from start node
  return filter(edge => (edge.to === endNodeId), edgesFromStart);
});


export const getEdgesBetween = curry( (startNodeId, endNodeId, graph) => {
  if (!hasEdgesBetween(startNodeId, endNodeId, graph)) {
    throw new Error(`getEdgesBetween: no edges from ${JSON.stringify(startNodeId)} to ${JSON.stringify(endNodeId)}`);
  }

  return [...getEdgesFromTo(startNodeId, endNodeId, graph),
          ...getEdgesFromTo(endNodeId, startNodeId, graph)];
});



export const hasEdgesFromTo = curry((startNodeId, endNodeId, graph) => {
  if (!hasNode(startNodeId, graph)) return false;
  if (!hasNode(endNodeId, graph)) return false;

  const reachableFromStart = map(prop('to'), getEdgesFromNode(startNodeId, graph)); // check only the nodes reachable from the start one

  return contains(endNodeId, reachableFromStart);
});

export const hasEdgesBetween = curry((startNodeId, endNodeId, graph) => {
  if (!hasNode(startNodeId, graph)) return false;
  if (!hasNode(endNodeId, graph)) return false;

  return (
    hasEdgesFromTo(startNodeId, endNodeId, graph) || 
    hasEdgesFromTo(endNodeId, startNodeId, graph)
  )
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


export const getNodesAdjacentTo = curry((nodeId, graph) => {
  if (!hasNode(nodeId, graph)) throw new Error(`getNodesAdjacentTo: no node with the id ${nodeId}`);
  
  const incidentEdges = getEdgesIncidentToNode(nodeId, graph);

  const allIncident = compose(
    without(nodeId),
    uniq,
    flatten,
    map( ({from, to}) => ([from, to]) )
  )(incidentEdges);

  return allIncident;
});

export const getNodesTo = curry((nodeId, graph) => {
  if (!hasNode(nodeId, graph)) throw new Error(`getNodesTo: no node with the id ${nodeId}`);

  const edgesTo = getEdgesToNode(nodeId, graph);
  const nodesTo = edgesTo.map( ({from}) => from);

  return nodesTo;
});

export const getNodesFrom = curry((nodeId, graph) => {
  if (!hasNode(nodeId, graph)) throw new Error(`getNodesFrom: no node with the id ${nodeId}`);

  const edgesTo = getEdgesToNode(nodeId, graph);
  const nodesTo = edgesTo.map( ({from}) => from);

  return nodesTo;
});

