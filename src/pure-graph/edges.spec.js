import {test} from 'tap';
import {addEdge, removeEdge, removeEdgeWithId, removeEdgeFromTo, getEdges, hasEdgeFromTo, hasEdgeWithId} from './edges';
import {addNode} from './nodes';
import is from 'is';
import {EMPTY_GRAPH} from './empty';
import {compose} from 'ramda';


const TEST_GRAPH = compose(
  addNode('0', {data: 'data'}),
  addNode('1', {data: 'data'})
)(EMPTY_GRAPH);



// ==================== //
// =     add edge     = //
// ==================== //

test('edges export an addEdge() function', t => {
  t.equal(is.fn(addEdge), true);
  t.end();
});

test(`edges addEdge applied to EMPTY_GRAPH results in a 'nodes [...] do not exist' error`, t => {
  const testStart = '13';
  const testEnd = '14';
  const testEdgeId = '13-14';

  try {
    addEdge(testEdgeId, testStart, testEnd, EMPTY_GRAPH);
    t.fail('expected to fail');
  } catch (e) {
    t.equal(e.message, `addEdge: nodes ${testStart} and ${testEnd} do not exist`);
  }

  t.end();
});


test(`edges addEdge fails with correct error if the start node does not exist`, t => {
  const testStart = '13';
  const testEnd = '14';
  const testEdgeId = '13-14';

  const added = addNode(testEnd, null, EMPTY_GRAPH );

  try {
    addEdge(testEdgeId, testStart, testEnd, added);
    t.fail('expected to fail');
  } catch (e) {
    t.equal(e.message, `addEdge: node ${testStart} does not exist`);
  }

  t.end();
});


test(`edges addEdge fails with correct error if the end node does not exist`, t => {
  const testStart = '13';
  const testEnd = '14';
  const testEdgeId = '13-14';

  const added = addNode(testStart, null, EMPTY_GRAPH );

  try {
    addEdge(testEdgeId, testStart, testEnd, added);
    t.fail('expected to fail');
  } catch (e) {
    t.equal(e.message, `addEdge: node ${testEnd} does not exist`);
  }

  t.end();
});



// ==================== //
// =     has edge     = //
// ==================== //

test(`edges export a hasEdgeFromTo function`, t => {
  t.equal(is.fn(hasEdgeFromTo), true);
  t.end();
});

test(`edges hasEdgeFromTo returns false on empty graph`, t => {
  const result = hasEdgeFromTo('0', '1', EMPTY_GRAPH);

  t.equal(result, false);
  t.end();
});


test(`edges hasEdgeFromTo returns true after the edge has been added`, t => {
  const added = addEdge('0-1', '0', '1', TEST_GRAPH);

  const result = hasEdgeFromTo('0', '1', added);

  t.equal(result, true);
  t.end();
});



test(`edges export a hasEdgeWithId function`, t => {
  t.equal(is.fn(hasEdgeWithId), true);
  t.end();
});


test(`edges hasEdgeWithId returns false on empty graph`, t => {
  const result = hasEdgeWithId('0-1', EMPTY_GRAPH);

  t.equal(result, false);
  t.end();
});


test(`edges hasEdgeWithId returns true after the edge has been added`, t => {
  const testEdgeId = '0-1';
  const added = addEdge(testEdgeId, '0', '1', TEST_GRAPH);

  const result = hasEdgeWithId(testEdgeId, added);

  t.equal(result, true);
  t.end();
});


// ===================== //
// =    remove edge    = //
// ===================== //

test(`edges export a removeEdgeFromTo() function`, t => {
  t.equals(is.fn(removeEdgeFromTo), true);
  t.end();
});


test(`edges removeEdgeFromTo doesn't throw error when the edge doesn't exist, and returns the same graph`, t => {
  try {
    const removed = removeEdgeFromTo('0', '1', EMPTY_GRAPH);
    t.deepEqual(removed, EMPTY_GRAPH, 'ok');
  } catch (e) {
    t.fail('expected not to throw');
  }

  t.end();
});


test(`edges removeEdgeFromTo: composition of 'addEdge' and 'removeEdgeFromTo' doesn't change the graph`, t => {
  const startId = '0';
  const endId = '1';
  const testEdgeId = '0-1';

  const result = compose(
    removeEdgeFromTo(startId, endId),
    addEdge(testEdgeId, startId, endId)
  )(TEST_GRAPH);

  t.deepEqual(result, TEST_GRAPH, 'ok');

  t.end();
});


test(`edges removeEdgeFromTo: hasEdgeFromTo & hasEdgeWithId returns false after removeEdgeFromTo has been invoked`, t => {
  const startId = '0';
  const endId = '1';
  const testEdgeId = '0-1';

  const added = addEdge(testEdgeId, startId, endId, TEST_GRAPH);
  const removed = removeEdgeFromTo(startId, endId, added);

  t.deepEqual(hasEdgeFromTo(startId, endId, added), true);
  t.deepEqual(hasEdgeFromTo(startId, endId, removed), false);

  t.deepEqual(hasEdgeWithId(testEdgeId, added), true);
  t.deepEqual(hasEdgeWithId(testEdgeId, removed), false);

  t.end();
});



test(`edges export a removeEdgeWithId() function`, t => {
  t.equals(is.fn(removeEdgeWithId), true);
  t.end();
});

test(`edges removeEdgeWithId doesn't throw error when the edge doesn't exist, and returns the same graph`, t => {
  try {
    const removed = removeEdgeWithId('0-1', EMPTY_GRAPH);
    t.deepEqual(removed, EMPTY_GRAPH, 'ok');
  } catch (e) {
    t.fail('expected not to throw');
  }

  t.end();
});


test(`edges removeEdgeWithId: composition of 'addEdge' and 'removeEdgeWithId' doesn't change the graph`, t => {
  const startId = '0';
  const endId = '1';
  const testEdgeId = '0-1';

  const result = compose(
    removeEdgeWithId(testEdgeId),
    addEdge(testEdgeId, startId, endId)
  )(TEST_GRAPH);

  t.deepEqual(result, TEST_GRAPH, 'ok');

  t.end();
});


test(`edges removeEdgeWithId: hasEdgeFromTo & hasEdgeWithId returns false after removeEdgeWithId has been invoked`, t => {
  const startId = '0';
  const endId = '1';
  const testEdgeId = '0-1';

  const added = addEdge(testEdgeId, startId, endId, TEST_GRAPH);
  const removed = removeEdgeWithId(testEdgeId);

  t.deepEqual(hasEdgeFromTo(startId, endId, added), true);
  t.deepEqual(hasEdgeFromTo(startId, endId, removed), false);

  t.deepEqual(hasEdgeWithId(testEdgeId, added), true);
  t.deepEqual(hasEdgeWithId(testEdgeId, removed), false);

  t.end();
});



// ==================== //
// =    get edges     = //
// ==================== //


test(`edges export a getEdges() function`, t => {
  t.equal(is.fn(getEdges), true);
  t.end();
});

test(`edges getEdges return [] for an empty graph`, t => {
  t.deepEqual(getEdges(EMPTY_GRAPH), []);
  t.end();
});


test(`edges getEdges gets the edges from the graph`, t => {
  const testGraph = compose(
    addEdge('3-0', '3', '0'),
    addEdge('2-3', '2', '3'),
    addEdge('1-2', '1', '2'),
    addEdge('0-1', '0', '1'),
    addNode('3', null),
    addNode('2', null),
    addNode('1', null),
    addNode('0', null)
  )(EMPTY_GRAPH);

  const result = getEdges(testGraph);

  t.deepEqual(result, [
    ['0', '1'],
    ['1', '2'],
    ['2', '3'],
    ['3', '0']
  ].map( ([from, to]) => ({from, to}) ));
  t.end();
});

