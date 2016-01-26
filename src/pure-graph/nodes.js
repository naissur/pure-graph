import {curry, assocPath, contains, keys, pick, compose, map, over, lensProp, lensPath, prop, reduce} from 'ramda';
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
  const nodeIds = keys(graph.nodes);
  return contains(nodeId, nodeIds);
});

export const mapNodeData = curry( (nodeId, fn, graph) => {
  if (!hasNode(nodeId, graph)) { return graph; }

  return over(lensPath(['nodes', nodeId]), 
      over(lensProp('data'), fn), graph);
});

export const setNodeData = curry( (nodeId, data, graph) => {
  if (!hasNode(nodeId, graph)) throw new Error(`setNodeData: node with id ${nodeId} doesn't exist`);

  return mapNodeData(nodeId, () => data, graph);
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

