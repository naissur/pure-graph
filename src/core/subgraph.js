import { equals, compose, map, flatten, union, difference } from 'ramda';

import {
  getNodesTo
} from './edges'

/*
export const getSubgraphTo = (nodeId, graph) => {
  const subgraphNodes = getSubgraphToNodes(nodeId, graph);
  const subgraphEdges = getSubgraphToEdges(nodeId, graph);

  console.log(subgraphNodes, subgraphEdges);

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

  if (equals(difference(nextFringe, nodesFringe)), []) return nextFringe;

  return union(nextFringe, iterateSubGraphToNodes(nextFringe, graph));
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

