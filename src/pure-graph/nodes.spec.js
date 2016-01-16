import {test} from 'tap';
import {addNode, getNode, removeNode, hasNode} from './nodes';
import {EMPTY_GRAPH} from './empty';
import is from 'is';
import {compose} from 'ramda';


// ==================== //
// =     add node     = //
// ==================== //

test(`nodes export an 'addNode' function`, t => {
  t.equal(is.fn(addNode), true);
  t.end();
});


test(`nodes addNode applied to EMPTY_GRAPH !== EMPTY_GRAPH`, t => {
  const got = addNode('13', 'nodeData', EMPTY_GRAPH);

  t.notDeep(got, EMPTY_GRAPH);
  t.end();
});

test(`nodes addNode returns the same structure when applied once and twice to the empty graph with the same params`, t => {
  const once = addNode('13', 'nodeData', EMPTY_GRAPH );
  const twice = addNode('13', 'nodeData', once );

  t.deepEqual(once, twice);
  t.end();
});


// ==================== //
// =     get node     = //
// ==================== //


test(`nodes export a 'getNode' function`, t => {
  t.equal(is.fn(getNode), true);
  t.end();
});


test(`nodes getNode gets the previously added node, as an object with the correct shape`, t => {
  const testId = '13';
  const testData = {a: 1, b: 2};
  const added = addNode(testId, testData, EMPTY_GRAPH);

  const got = getNode(testId, added);

  t.deepEqual(got, { id: testId, data: testData });
  t.end();
});

test(`nodes getNode throws an error when the graph is invalid, correctly`, t => {
  const testId = '13';

  try {
    getNode(testId, []);
    t.fail('must have thrown');
  } catch (e) {
    t.equal(e, 'getNode: got an invalid graph');
    t.pass('passed');
  }

  t.end();
});

test(`nodes getNode throws an error when the node doesn't exist, with the correct error`, t => {
  const testId = '13';

  try {
    getNode(testId, EMPTY_GRAPH);
    t.fail('must have thrown');
  } catch (e) {
    t.equal(e, `getNode: no node with the id ${testId}`);
    t.pass('passed');
  }

  t.end();
});



// ===================== //
// =    remove node    = //
// ===================== //

test(`nodes export a 'removeNode' function`, t => {
  t.equal(is.fn(removeNode), true);
  t.end();
});


test(`nodes removeNode(x) after addNode(x) returns the same graph`, t => {
  const testId = '13';
  const testData = {a: 1, b: 2};
  const afterAdded = addNode(testId, testData, EMPTY_GRAPH);
  const afterRemoved = removeNode(testId, afterAdded);

  t.deepEqual(afterRemoved, EMPTY_GRAPH);
  t.end();
});

test(`nodes removeNode doesn't throw error when the node doesn't exist, and returns the same graph`, t => {
  const testId = 'testId';

  try {
    const removed = removeNode(testId, EMPTY_GRAPH);
    t.deepEqual(removed, EMPTY_GRAPH, 'ok');
  } catch (e) {
    t.fail('expected not to throw');
  }

  t.end();
});


// ===================== //
// =      has node     = //
// ===================== //


test(`nodes export a 'hasNode' function`, t => {
  t.equal(is.fn(hasNode), true);
  t.end();
});


test(`nodes hasNode returns false on an EMPTY_GRAPH`, t => {
  const testId = 'testId';

  const result = hasNode(testId, EMPTY_GRAPH);

  t.equal(result, false);
  t.end();
});

test(`nodes hasNode returns true after a node has been added`, t => {
  const testId = '13';
  const testData = {a: 1, b: 2};
  const added = addNode(testId, testData, EMPTY_GRAPH);

  const result = hasNode(testId, added);

  t.equal(result, true);
  t.end();
});


test(`nodes hasNode returns false after a node has been added and then removed`, t => {
  const testId = '13';
  const testData = {a: 1, b: 2};
  const afterAddAndRemove = compose(
    removeNode(testId),
    addNode(testId, testData)
  )(EMPTY_GRAPH);

  const result = hasNode(testId, afterAddAndRemove);

  t.equal(result, false);
  t.end();
});




