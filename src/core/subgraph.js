import { equals, compose, map, flatten, union, difference } from 'ramda';

import {
  getNodesTo,
  getNodesFrom
} from './edges'

/*
export const getSubgraphTo = (nodeId, graph) => {
  const subgraphNodes = getSubgraphToNodes(nodeId, graph);
  const subgraphEdges = getSubgraphToEdges(nodeId, graph);

  const addedNodes = reduce((total, id) => addNode(id, total), EMPTY_GRAPH, subgraphNodes);
  const addedEdges = reduce( (total, { from, to, id } ) => addEdge(id, from, to, total), addedNodes, subgraphEdges);

  // res => reduce((total, { from, to, id }) => addEdge(id, from, to, total), res, edgesTo),

  return addedEdges;
};
*/

export const getNodesOfSubgraphTo = (nodeId, graph) => {
  const result = iterateSubGraphToNodes([nodeId], graph);

  return result;
};

const iterateSubGraphToNodes = (nodesFringe, graph) => {
  const nextFringe = nextSubGraphToNodes(nodesFringe, graph);

  if (
    equals(difference(nextFringe, nodesFringe), []) &&
    equals(difference(nodesFringe, nextFringe), [])
  ) return union(nodesFringe, nextFringe);

  return union(nodesFringe, iterateSubGraphToNodes(nextFringe, graph));
};

const nextSubGraphToNodes = (nodesFringe, graph) => (
  compose(
    flatten,
    map(node => getNodesTo(node, graph))
  )(nodesFringe)
);

/*
  TODO

  const transduce = (iterator, graph, initial) => {
  };
*/


export const getNodesOfSubgraphFrom = (nodeId, graph) => {
  const result = iterateSubGraphFromNodes([nodeId], graph);

  return result;
};


const iterateSubGraphFromNodes = (nodesFringe, graph) => {
  const nextFringe = nextSubGraphFromNodes(nodesFringe, graph);

  if (
    equals(difference(nextFringe, nodesFringe), []) &&
    equals(difference(nodesFringe, nextFringe), [])
  ) return union(nodesFringe, nextFringe);

  return union(nodesFringe, iterateSubGraphFromNodes(nextFringe, graph));
};


const nextSubGraphFromNodes = (nodesFringe, graph) => (
  compose(
    flatten,
    map(node => getNodesFrom(node, graph))
  )(nodesFringe)
);

