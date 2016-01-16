import xtend from 'xtend';
import {curry, dissocPath, contains} from 'ramda';
import is from 'is';

export const addNode = curry((nodeId, nodeData, graph) => {
  if (hasNode(nodeId, graph)) { return graph; }

  const newNodeIds = graph.nodeIds.concat(nodeId);

  const toAdd = {
    nodeIds: newNodeIds,
    nodes: {
      [nodeId]: {
        id: nodeId,
        data: nodeData
      }
    }
  };

  return xtend({}, graph, toAdd);
});

export const getNode = curry((nodeId, graph) => {
  let node;

  try {
    node = graph.nodes[nodeId];
  } catch (e) {
    throw 'getNode: got an invalid graph';
  }

  if (!is.defined(node)) {
    throw `getNode: no node with the id ${nodeId}`;
  }

  return node;
});

export const removeNode = curry((nodeId, graph) => {
  const removedNode = dissocPath(['nodes', nodeId], graph);
  const removedNodeIds = graph.nodeIds.filter(x => x !== nodeId);
  return xtend({}, graph, removedNode, {nodeIds: removedNodeIds});
});

export const hasNode = curry( (nodeId, graph) => {
  return contains(nodeId, graph.nodeIds);
});


