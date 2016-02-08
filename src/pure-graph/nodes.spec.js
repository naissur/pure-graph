import {test} from 'tap';
import {
  addNode, getNodesIds, hasNode
} from './nodes';

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
  const got = addNode('13', EMPTY_GRAPH);

  t.notDeep(got, EMPTY_GRAPH);
  t.end();
});

test(`nodes addNode returns the same structure when applied once and twice to the empty graph with the same params`, t => {
  const once = addNode('13', EMPTY_GRAPH );
  const twice = addNode('13', once );

  t.deepEqual(once, twice);
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
  const added = addNode(testId, EMPTY_GRAPH);

  const result = hasNode(testId, added);

  t.equal(result, true);
  t.end();
});



// ==================== //
// =    get nodes     = //
// ==================== //


test(`nodes export an 'getNodesIds' function`, t => {
  t.equal(is.fn(getNodesIds), true);
  t.end();
});

test(`nodes getNodesIds on an empty graph returns []`, t => {
  t.deepEqual(getNodesIds(EMPTY_GRAPH), [], 'ok');
  t.end();
});

test(`nodes getNodesIds gets the nodes ids`, t => {
  const testData = [
    'test1', 'test 2', 'test_id'
  ];

  const testGraph = compose(
    ...(testData.map(
      testId => addNode(testId)
    ))
  )(EMPTY_GRAPH);


  const result = getNodesIds(testGraph);


  t.deepEqual(result, testData.reverse());
  t.end();
});




