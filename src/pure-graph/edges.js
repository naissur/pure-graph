import {curry, find} from 'ramda';
import {hasNode} from './nodes';
import xtend from 'xtend';

export const addEdge = curry((startNodeId, endNodeId, graph) => {
  const hasStart = hasNode(startNodeId, graph);
  const hasEnd = hasNode(endNodeId, graph);

  if (!hasStart && !hasEnd) { throw `addEdge: nodes ${startNodeId} and ${endNodeId} do not exist`; }
  if (!hasStart) { throw `addEdge: node ${startNodeId} does not exist`; }
  if (!hasEnd) { throw `addEdge: node ${endNodeId} does not exist`; }

  const toExtend = {
    edges: graph.edges.concat({start: startNodeId, end: endNodeId})
  };

  return xtend({}, graph, toExtend);
});


export const hasEdge = curry((startNodeId, endNodeId, graph) => {
  return !!find(e => (e.start === startNodeId &&
                      e.end === endNodeId), graph.edges);
});


export const removeEdge = curry((startNodeId, endNodeId, graph) => {
  const toExtend = {
    edges: graph.edges.filter(edge => (
      edge.start !== startNodeId &&
      edge.end !== endNodeId
    ))
  };

  return xtend({}, graph, toExtend);
});

