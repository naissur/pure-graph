import {compose, curry, map, keys} from 'ramda';
import xtend from 'xtend';

import {
  hasNode
} from './nodes';

import {
  getEdgeWithId
} from './edges';



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

