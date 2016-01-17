import {test} from 'tap';
import {addEdge, hasEdge, removeEdge} from './edges';
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

  try {
    addEdge(testStart, testEnd, EMPTY_GRAPH);
    t.fail('expected to fail');
  } catch (e) {
    t.equal(e, `addEdge: nodes ${testStart} and ${testEnd} do not exist`);
  }

  t.end();
});

test(`edges addEdge fails with correct error if the start node does not exist`, t => {
  const testStart = '13';
  const testEnd = '14';

  const added = addNode(testEnd, null, EMPTY_GRAPH );

  try {
    addEdge(testStart, testEnd, added);
    t.fail('expected to fail');
  } catch (e) {
    t.equal(e, `addEdge: node ${testStart} does not exist`);
  }

  t.end();
});


test(`edges addEdge fails with correct error if the end node does not exist`, t => {
  const testStart = '13';
  const testEnd = '14';

  const added = addNode(testStart, null, EMPTY_GRAPH );

  try {
    addEdge(testStart, testEnd, added);
    t.fail('expected to fail');
  } catch (e) {
    t.equal(e, `addEdge: node ${testEnd} does not exist`);
  }

  t.end();
});


/*
test(`edges addEdge returns the same structure when applied once and twice to the empty graph with the same params`, t => {
  const once = addEdge('0', '1', TEST_GRAPH);
  const twice = addEdge('0', '1', once);

  t.deepEqual(once, twice);
  t.end();
});
*/



// ==================== //
// =     has edge     = //
// ==================== //


test(`edges hasEdge returns false on empty graph`, t => {
  const result = hasEdge('0', '1', EMPTY_GRAPH);

  t.equal(result, false);
  t.end();
});


test(`edges hasEdge returns true after the edge has been added`, t => {
  const added = addEdge('0', '1', TEST_GRAPH);

  const result = hasEdge('0', '1', added);

  t.equal(result, true);
  t.end();
});


// ===================== //
// =    remove edge    = //
// ===================== //


test(`edges export a removeEdge() function`, t => {
  t.equals(is.fn(removeEdge), true);
  t.end();
});


test(`edges removeEdge doesn't throw error when the edge doesn't exist, and returns the same graph`, t => {
  try {
    const removed = removeEdge('0', '1', EMPTY_GRAPH);
    t.deepEqual(removed, EMPTY_GRAPH, 'ok');
  } catch (e) {
    t.fail('expected not to throw');
  }

  t.end();
});


test(`edges removeEdge: removeEdge after addEdge leaves the graph the same`, t => {
  const startId = '0';
  const endId = '1';

  const result = compose(
    removeEdge(startId, endId),
    addEdge(startId, endId)
  )(TEST_GRAPH);

  t.deepEqual(result, TEST_GRAPH, 'ok');

  t.end();
});


test(`edges removeEdge: hasEdge returns false after removeEdge has been invoked`, t => {
  const startId = '0';
  const endId = '1';

  const added = addEdge(startId, endId, TEST_GRAPH);
  const removed = removeEdge(startId, endId, added);

  t.deepEqual(hasEdge(startId, endId, added), true);
  t.deepEqual(hasEdge(startId, endId, removed), false);

  t.end();
});


