import {compose, map, reduce, mapObjIndexed, assocPath, toPairs} from 'ramda';

export const convertToIncidentForm = graph => {
  const {nodes, edges} = graph;
  const modifiedNodes = map( () => true, nodes );
  const modifiedEdges = map( ({from, to}) => ({f: from, t: to}), edges );

  return { nodes: modifiedNodes, edges: modifiedEdges };
}

export const convertFromIncidentForm = graph => {
  const {nodes, edges} = graph;

  const restoredEdges= mapObjIndexed( ({f, t}, id ) => ({from: f, to: t, id}), edges);
  const nodesWithIds = mapObjIndexed( (node, id) => ({ id }), nodes);

  // restore edgesFrom & edgesTo
  const shapedNodes = 
    map(compose(
      assocPath(['edgesTo'], {}),
      assocPath(['edgesFrom'], {})
    ))(nodesWithIds);

  const restoredNodes = reduce(
    (result, [edgeId, {from, to} ]) => (
      compose(
        assocPath( [from, 'edgesFrom', edgeId], true ),
        assocPath( [to, 'edgesTo', edgeId], true )
      )(result)
    ),
    shapedNodes,
    toPairs(restoredEdges)
  );

  return {nodes: restoredNodes, edges: restoredEdges};
}
