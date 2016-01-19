import {curry, find, prop} from 'ramda';
import {hasNode} from './nodes';
import xtend from 'xtend';

export const addEdge = curry((startNodeId, endNodeId, graph) => {
  const hasStart = hasNode(startNodeId, graph);
  const hasEnd = hasNode(endNodeId, graph);

  if (!hasStart && !hasEnd) throw new Error(`addEdge: nodes ${startNodeId} and ${endNodeId} do not exist`);
  if (!hasStart) throw new Error(`addEdge: node ${startNodeId} does not exist`);
  if (!hasEnd) throw new Error(`addEdge: node ${endNodeId} does not exist`);

  const toExtend = {
    edges: graph.edges.concat({from: startNodeId, to: endNodeId})
  };

  return xtend({}, graph, toExtend);
});


export const hasEdge = curry((startNodeId, endNodeId, graph) => {
  return !!find(e => (e.from === startNodeId &&
                      e.to === endNodeId), graph.edges);
});


export const removeEdge = curry((startNodeId, endNodeId, graph) => {
  const toExtend = {
    edges: graph.edges.filter(edge => (
      edge.from !== startNodeId &&
      edge.to !== endNodeId
    ))
  };

  return xtend({}, graph, toExtend);
});

export const getEdges = prop('edges');

