import {test} from 'tap';
import {
  addEdge, getEdges, 
  hasEdgeFromTo, hasEdgeWithId, 
  getEdgeFromTo, getEdgeWithId, 
  getEdgesFromNode, getEdgesToNode, getEdgesIncidentToNode
} from './edges';

import {addNode} from './nodes';
import is from 'is';
import {EMPTY_GRAPH} from './empty';
import {compose} from 'ramda';


const TEST_GRAPH = compose(
  addNode('0', {data: 'data'}),
  addNode('1', {data: 'data'})
)(EMPTY_GRAPH);

const TEST_GRAPH_EDGED = addEdge('0-1', '0', '1', TEST_GRAPH);



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
    ['0-1', '0', '1'],
    ['1-2', '1', '2'],
    ['2-3', '2', '3'],
    ['3-0', '3', '0']
  ].map( ([id, from, to]) => ({id, from, to}) ));
  t.end();
});


// ==================== //
// =     get edge     = //
// ==================== //

test(`edges export a getEdgeFromTo function`, t => {
  t.equal(is.fn(getEdgeFromTo), true);
  t.end();
});

test(`edges getEdgeFromTo throws a correct error if the edge hasn't been found`, t => {

  try {
    getEdgeFromTo('2', '1', TEST_GRAPH_EDGED);
    t.fail('expected to throw');
  } catch (e) {
    t.equal(e.message, `getEdgeFromTo: edge from "2" to "1" doesn't exist`);
  }

  t.end();
});


test(`edges getEdgeFromTo returns a correct edge if it has been found`, t => {

  const edge = getEdgeFromTo('0', '1', TEST_GRAPH_EDGED);
  t.deepEqual(edge, { id: '0-1', from: '0', to: '1' });

  t.end();
});



test(`edges export a getEdgeWithId function`, t => {
  t.equal(is.fn(getEdgeWithId), true);
  t.end();
});


test(`edges getEdgeWithId throws a correct error if the edge hasn't been found`, t => {

  try {
    getEdgeWithId('2-1', TEST_GRAPH_EDGED);
    t.fail('expected to throw');
  } catch (e) {
    t.equal(e.message, `getEdgeWithId: edge with id "2-1" doesn't exist`);
  }

  t.end();
});


test(`edges getEdgeWithId returns a correct edge if it has been found`, t => {

  const edge = getEdgeWithId('0-1', TEST_GRAPH_EDGED);
  t.deepEqual(edge, { id: '0-1', from: '0', to: '1' });

  t.end();
});



// ======================================== //
// =       get edges from / to nodes      = //
// ======================================== //



// ============== //
// =    from    = //
// ============== //

test(`edges export an 'getEdgesFromNode' function`, t => {
  t.equal(is.fn(getEdgesFromNode), true);
  t.end();
});

test(`edges getEdgesFromNode throws an error if the node doesn't exist with the correct message`, t => {
  const testGraph = EMPTY_GRAPH;
  const testId = '0';


  try {
    getEdgesFromNode(testId, testGraph);
    t.fail('expected to fail');
  } catch(e) {
    t.equal(e.message, `getEdgesFromNode: no node with the id ${testId}`);
  }


  t.end();
});

test(`edges getEdgesFromNode returns the edges originating at the node`, t => {
  const testGraph = compose(
    addEdge('0-1', '0', '1'),
    addEdge('0-2', '0', '2'),
    addNode('2', null),
    addNode('1', null),
    addNode('0', null)
  )(EMPTY_GRAPH);


  const result = getEdgesFromNode('0', testGraph);


  t.deepEqual(result, [
    {id: '0-2', from: '0', to: '2'},
    {id: '0-1', from: '0', to: '1'}
  ]);
  t.end();
});


// ============== //
// =     to     = //
// ============== //


test(`edges export an 'getEdgesToNode' function`, t => {
  t.equal(is.fn(getEdgesToNode), true);
  t.end();
});


test(`edges getEdgesToNode throws an error if the node doesn't exist with the correct message`, t => {
  const testGraph = EMPTY_GRAPH;
  const testId = '0';


  try {
    getEdgesToNode(testId, testGraph);
    t.fail('expected to fail');
  } catch(e) {
    t.equal(e.message, `getEdgesToNode: no node with the id ${testId}`);
  }


  t.end();
});


test(`edges getEdgesToNode returns the edges ending at the node`, t => {
  const testGraph = compose(
    addEdge('1-0', '1', '0'),
    addEdge('2-0', '2', '0'),
    addNode('2', null),
    addNode('1', null),
    addNode('0', null)
  )(EMPTY_GRAPH);


  const result = getEdgesToNode('0', testGraph);


  t.deepEqual(result, [
    {id: '2-0', from: '2', to: '0'},
    {id: '1-0', from: '1', to: '0'}
  ]);
  t.end();
});


// ========================== //
// =        incident        = //
// ========================== //


test(`edges export an 'getEdgesIncidentToNode' function`, t => {
  t.equal(is.fn(getEdgesIncidentToNode), true);
  t.end();
});


test(`edges getEdgesIncidentToNode throws an error if the node doesn't exist with the correct message`, t => {
  const testGraph = EMPTY_GRAPH;
  const testId = '0';


  try {
    getEdgesIncidentToNode(testId, testGraph);
    t.fail('expected to fail');
  } catch(e) {
    t.equal(e.message, `getEdgesIncidentToNode: no node with the id ${testId}`);
  }


  t.end();
});


test(`edges getEdgesIncidentToNode returns the edges adjacent to the node`, t => {
  const testGraph = compose(
    addEdge('0-1', '0', '1'),
    addEdge('0-2', '0', '2'),
    addEdge('1-0', '1', '0'),
    addEdge('2-0', '2', '0'),
    addNode('2', null),
    addNode('1', null),
    addNode('0', null)
  )(EMPTY_GRAPH);


  const result = getEdgesIncidentToNode('0', testGraph);


  t.deepEqual(result, [
    {id: '0-2', from: '0', to: '2'},
    {id: '0-1', from: '0', to: '1'},
    {id: '2-0', from: '2', to: '0'},
    {id: '1-0', from: '1', to: '0'}
  ]);
  t.end();
});



