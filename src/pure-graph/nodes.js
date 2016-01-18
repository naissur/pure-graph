import xtend from 'xtend';
import {curry, dissocPath, contains, mapObjIndexed, values} from 'ramda';
import is from 'is';

export const addNode = curry((nodeId, nodeData, graph) => {
  if (hasNode(nodeId, graph)) { return graph; }

  const newNodeIds = graph.nodeIds.concat(nodeId);

  const transformedNodesData = xtend({}, graph.nodes, {
    [nodeId]: { id: nodeId, data: nodeData }
  });

  return xtend({}, graph, {
    nodeIds: newNodeIds, 
    nodes: transformedNodesData
  });
});

export const getNode = curry((nodeId, graph) => {
  let node;

  try {
    node = graph.nodes[nodeId];
  } catch (e) {
    throw new Error('getNode: got an invalid graph');
  }

  if (!is.defined(node)) {
    throw new Error(`getNode: no node with the id ${nodeId}`);
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

export const mapNodeData = curry( (nodeId, fn, graph) => {
  if (!hasNode(nodeId, graph)) { return graph; }

  const node = graph.nodes[nodeId];
  const transformedNodesData = xtend({}, graph.nodes, {
    [nodeId]: xtend({}, node, {data: fn(node.data)})
  });

  return xtend({}, graph, { nodes: transformedNodesData });
});

export const setNodeData = curry( (nodeId, data, graph) => {
  if (!hasNode(nodeId, graph)) throw new Error(`setNodeData: node with id ${nodeId} doesn't exist`);

  return mapNodeData(nodeId, () => data, graph);
});

export const mapNodes = curry( (fn, graph) => {
  const newNodes = 
    mapObjIndexed( ({data, id}) => ({
      id, data: fn(data, id)
    }), graph.nodes);

  return xtend({}, graph, {nodes: newNodes});
});


export const getNodes = curry( graph => (
  values(graph.nodes)
));

