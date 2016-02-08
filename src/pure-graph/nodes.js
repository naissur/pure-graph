import {curry, assocPath, keys, compose, prop, path} from 'ramda';

export const addNode = curry((nodeId, graph) => 
  assocPath(
    ['nodes', nodeId], {
      id: nodeId,
      edgesFrom: {}, edgesTo: {} 
    }
  )(graph)
);

export const hasNode = curry( (nodeId, graph) => {
  return !!path(['nodes', nodeId], graph);
});

export const getNodesIds = compose(keys, prop('nodes'));


