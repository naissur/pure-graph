import {test} from 'tap';
import {
  addNode, removeNode, hasNode, 
  addEdge, getEdges, hasEdgeWithId, hasEdgeFromTo, removeEdgeWithId, removeEdgeFromTo, 
  EMPTY_GRAPH
} from './index.js';

import {compose} from 'ramda';

// ======================================= //
// =     pure-graph integration tests    = //
// ========================================//

test('adding nodes and edges', t => {
  const startId = '0';
  const endId = '1';
  const testEdgeId = '0-1';

  const addedEdge = compose(
    addEdge(testEdgeId, startId, endId),
    addNode(startId),
    addNode(endId)
  )(EMPTY_GRAPH);

  const [gotEdges, hasStart, hasEnd, gotEdgeWithId, gotEdgeFromTo] = [
    getEdges,
    hasNode(startId),
    hasNode(endId),
    hasEdgeWithId(testEdgeId),
    hasEdgeFromTo(startId, endId)
  ].map(fn => fn(addedEdge));

  // check existance
  t.equal(hasStart, true, 'added start node');
  t.equal(hasEnd, true, 'added end node');
  t.equal(gotEdgeWithId, true, 'has edge with id');
  t.equal(gotEdgeFromTo, true, 'has edge from to');


  // check retrieving edges
  t.deepEqual(gotEdges, [{id: testEdgeId, from: startId, to: endId}], 'edge retrieved correctly');

  t.end();
});


test('removing nodes and edges from to', t => {
  const added = compose(
    addEdge('0-1', '0', '1'),
    addNode('0'),
    addNode('1')
  )(EMPTY_GRAPH);

  const removed = compose(
    removeEdgeFromTo('0', '1'),
    removeNode('1'),
    removeNode('0')
  )(added);

  const [hasStart, hasEnd, hasEdgeAdded] = [
    hasNode('0'),
    hasNode('1'),
    hasEdgeFromTo('0', '1')
  ].map(fn => fn(removed));

  t.equal(hasStart, false, 'removed start node');
  t.equal(hasEnd, false, 'removed end node');
  t.equal(hasEdgeAdded, false, 'removed edge');

  t.end();
});

test('removing nodes', t => {
  const added = compose(
    addEdge('0-1', '0', '1'),
    addNode('0'),
    addNode('1')
  )(EMPTY_GRAPH);

  const removed = compose(
    removeNode('1'),
    removeNode('0')
  )(added);

  const [hasStart, hasEnd, hasEdgeAdded] = [
    hasNode('0'),
    hasNode('1'),
    hasEdgeFromTo('0', '1')
  ].map(fn => fn(removed));

  t.equal(hasStart, false, 'removed start node');
  t.equal(hasEnd, false, 'removed end node');
  t.equal(hasEdgeAdded, false, 'removed edge');

  t.end();
});

test('removing edges by id', t => {
  const added = compose(
    addEdge('0-1', '0', '1'),
    addNode('0'),
    addNode('1')
  )(EMPTY_GRAPH);


  const removedWithId = removeEdgeWithId('0-1', added);
  const removedFromTo = removeEdgeFromTo('0', '1', added);


  t.equal(hasEdgeFromTo('0', '1', removedWithId), false, 'removed edge');
  t.equal(hasEdgeFromTo('0', '1', removedFromTo), false, 'removed edge');
  t.end();
});

