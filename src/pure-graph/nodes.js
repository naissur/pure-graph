import {curry, assocPath, keys, pick, compose, map, prop, reduce} from 'ramda';
// import is from 'is';

export const addNode = curry((nodeId, nodeData, graph) => 
  assocPath(
    ['nodes', nodeId], {
      id: nodeId, data: nodeData,
      edgesFrom: {}, edgesTo: {} 
    }
  )(graph)
);

export const getNode = curry((nodeId, graph) => {
  const has = hasNode(nodeId, graph);
  if (!has) throw new Error(`getNode: no node with the id ${nodeId}`);

  return pick(['data', 'id'], graph.nodes[nodeId]);
});

export const hasNode = curry( (nodeId, graph) => {
  return !!graph.nodes[nodeId];
});

export const mapNodeData = curry( (nodeId, fn, graph) => {
  if (!hasNode(nodeId, graph)) { return graph; }

  const node = getNode(nodeId, graph);
  const mappedData = fn(node.data);

  return setNodeData(nodeId, mappedData, graph);
});

export const setNodeData = curry( (nodeId, data, graph) => {
  if (!hasNode(nodeId, graph)) throw new Error(`setNodeData: node with id ${nodeId} doesn't exist`);

  return assocPath(['nodes', nodeId, 'data'], data, graph);
});

export const mapNodes = curry( (fn, graph) => (
  reduce( 
    (result, nodeId) => mapNodeData(nodeId, data => fn(data, nodeId), result),
    graph
  )(getNodesIds(graph))
));


export const getNodes = graph => (
  compose(
    map(nodeId => getNode(nodeId, graph)),
    getNodesIds
  )(graph)
);

const getNodesIds = compose(keys, prop('nodes'));

