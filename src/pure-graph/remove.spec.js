import {test} from 'tap';
import {
  removeEdgeWithId, removeEdgeFromTo,
  removeEdgesToNode, removeEdgesFromNode, removeEdgesIncidentToNode,
  removeNode
} from './remove';

import {
  addEdge, hasEdgeFromTo, hasEdgeWithId
} from './edges'

import {
  addNode, hasNode
} from './nodes';

import is from 'is';
import {EMPTY_GRAPH} from './empty';
import {compose} from 'ramda';


const TEST_GRAPH = compose(
  addNode('0'),
  addNode('1')
)(EMPTY_GRAPH);



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
    t.fail(`expected not to throw, thrown with '${ e.message }'`);
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
  const removed = removeEdgeWithId(testEdgeId, added);

  t.deepEqual(hasEdgeFromTo(startId, endId, added), true);
  t.deepEqual(hasEdgeFromTo(startId, endId, removed), false);

  t.deepEqual(hasEdgeWithId(testEdgeId, added), true);
  t.deepEqual(hasEdgeWithId(testEdgeId, removed), false);

  t.end();
});



// removeEdgesToNode

test(`edges export a removeEdgesToNode() function`, t => {
  t.equals(is.fn(removeEdgesToNode), true);
  t.end();
});

test(`edges removeEdgesToNode() removes the edges to the node`, t => {
  const testGraph = compose(
    addEdge('2-0', '2', '0'),
    addEdge('1-0', '1', '0'),
    addNode('2'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);


  const got = removeEdgesToNode('0', testGraph);


  const expected = compose(
    addNode('2'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);

  t.deepEqual(got, expected);
  t.end();
});


// removeEdgesFromNode

test(`edges export a removeEdgesFromNode() function`, t => {
  t.equals(is.fn(removeEdgesFromNode), true);
  t.end();
});

test(`edges removeEdgesFromNode() removes the edges to the node`, t => {
  const testGraph = compose(
    addEdge('0-1', '0', '1'),
    addEdge('0-2', '0', '2'),
    addNode('2'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);


  const got = removeEdgesFromNode('0', testGraph);


  const expected = compose(
    addNode('2'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);

  t.deepEqual(got, expected);
  t.end();
});


// removeEdgesIncidentToNode

test(`edges export a removeEdgesIncidentToNode() function`, t => {
  t.equals(is.fn(removeEdgesIncidentToNode), true);
  t.end();
});

test(`edges removeEdgesIncidentToNode() removes the edges to the node`, t => {
  const testGraph = compose(
    addEdge('0-1', '0', '1'),
    addEdge('0-2', '0', '2'),
    addEdge('1-0', '1', '0'),
    addEdge('2-0', '2', '0'),
    addNode('2'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);


  const got = removeEdgesIncidentToNode('0', testGraph);


  const expected = compose(
    addNode('2'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);

  t.deepEqual(got, expected);
  t.end();
});



// ===================== //
// =    remove node    = //
// ===================== //

test(`nodes export a 'removeNode' function`, t => {
  t.equal(is.fn(removeNode), true);
  t.end();
});


test(`nodes removeNode: hasNode returns false after node has been removed`, t => {
  const testId = '13';

  const afterAdded = addNode(testId, EMPTY_GRAPH);
  t.equal(hasNode(testId, afterAdded), true);

  const afterRemoved = removeNode(testId, afterAdded);
  t.equal(hasNode(testId, afterRemoved), false);

  t.end();
});

test(`nodes removeNode(x) after addNode(x) returns the same graph`, t => {
  const testId = '13';
  const afterAdded = addNode(testId, EMPTY_GRAPH);
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


test(`nodes removeNode() removes the edges originating at and coming from the node`, t => {
  const testGraph = compose(
    addEdge('0-1', '0', '1'),
    addNode('0'),
    addNode('1')
  )(EMPTY_GRAPH);

  const afterRemoved = removeNode('0', testGraph);

  t.equal(hasEdgeWithId('0-1', afterRemoved), false);
  t.deepEqual(removeNode('1', afterRemoved), EMPTY_GRAPH);
  t.end();
});

test(`nodes removeNode() removes the edges correctly (specific case)`, t => {
  const testGraph = compose(
    addEdge('2-0', '2', '0'),
    addEdge('0-1', '0', '1'),
    addNode('0'),
    addNode('1'),
    addNode('2')
  )(EMPTY_GRAPH);


  const result = removeNode('1', testGraph);


  const expected = compose(
    addEdge('2-0', '2', '0'),
    addNode('2'),
    addNode('0')
  )(EMPTY_GRAPH);

  t.deepEqual(result, expected), 'removes the node correctly';
  t.end();
});

