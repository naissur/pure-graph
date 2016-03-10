import {test} from 'tap';
import {
  addEdge, getEdges, 
  hasEdgesFromTo, hasEdgesBetween, hasEdgeWithId, 
  getEdgesFromTo, getEdgesBetween, getEdgeWithId, 
  getEdgesFromNode, getEdgesToNode, getEdgesIncidentToNode,
  getNodesAdjacentTo, getNodesFrom, getNodesTo
} from './edges';

import {addNode} from './nodes';
import is from 'is';
import {EMPTY_GRAPH} from './empty';
import {compose} from 'ramda';


const TEST_GRAPH = compose(
  addNode('0'),
  addNode('1')
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

  const added = addNode(testEnd, EMPTY_GRAPH );

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

  const added = addNode(testStart, EMPTY_GRAPH );

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

/*
    with id
*/


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



/*
    from to
*/

test(`edges export a hasEdgesFromTo function`, t => {
  t.equal(is.fn(hasEdgesFromTo), true);
  t.end();
});

test(`edges hasEdgesFromTo returns false on empty graph`, t => {
  const result = hasEdgesFromTo('0', '1', EMPTY_GRAPH);

  t.equal(result, false);
  t.end();
});


test(`edges hasEdgesFromTo returns true after the edge has been added`, t => {
  const added = addEdge('0-1', '0', '1', TEST_GRAPH);

  const result = hasEdgesFromTo('0', '1', added);

  t.equal(result, true);
  t.end();
});


/*
    between
*/


test(`edges export a hasEdgesBetween function`, t => {
  t.equal(is.fn(hasEdgesBetween), true);
  t.end();
});

test(`edges hasEdgesBetween returns false on empty graph`, t => {
  const result = hasEdgesBetween('0', '1', EMPTY_GRAPH);

  t.equal(result, false);
  t.end();
});


test(`edges hasEdgesBetween returns true after the edges has been added`, t => {
  const added = addEdge('0-1', '0', '1', TEST_GRAPH);

  const result = hasEdgesBetween('1', '0', added);

  t.equal(result, true);
  t.end();
});


test(`edges hasEdgesBetween returns true after the edges has been added (multiple case)`, t => {
  const added = compose(
    addEdge('0-1', '0', '1'),
    addEdge('1-0', '1', '0')
  )(TEST_GRAPH);

  t.assert(hasEdgesBetween('0', '1', added));
  t.assert(hasEdgesBetween('1', '0', added));

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
    addNode('3'),
    addNode('2'),
    addNode('1'),
    addNode('0')
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

test(`edges export a getEdgesFromTo function`, t => {
  t.equal(is.fn(getEdgesFromTo), true);
  t.end();
});

test(`edges getEdgesFromTo returns [] if no edges have been found`, t => {
  const result = getEdgesFromTo('2', '1', TEST_GRAPH_EDGED);

  t.deepEqual(result, []);

  t.end();
});


test(`edges getEdgesFromTo returns correct edges if they have been found`, t => {

  const edge = getEdgesFromTo('0', '1', TEST_GRAPH_EDGED);
  t.deepEqual(edge, [{ id: '0-1', from: '0', to: '1' }]);

  t.end();
});



test(`edges export a getEdgesBetween function`, t => {
  t.equal(is.fn(getEdgesBetween), true);
  t.end();
});

test(`edges getEdgesBetween throws a correct error if the edge hasn't been found`, t => {

  try {
    getEdgesBetween('2', '1', TEST_GRAPH_EDGED);
    t.fail('expected to throw');
  } catch (e) {
    t.equal(e.message, `getEdgesBetween: no edges from "2" to "1"`);
  }

  t.end();
});


test(`edges getEdgesBetween returns correct edges if they have been found`, t => {
  const edge = getEdgesBetween('1', '0', TEST_GRAPH_EDGED);
  
  t.deepEqual(edge, [{ id: '0-1', from: '0', to: '1' }]);

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
    addNode('2'),
    addNode('1'),
    addNode('0')
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
    addNode('2'),
    addNode('1'),
    addNode('0')
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


test(`edges getEdgesIncidentToNode returns the edges incident to the node`, t => {
  const testGraph = compose(
    addEdge('0-1', '0', '1'),
    addEdge('0-2', '0', '2'),
    addEdge('1-0', '1', '0'),
    addEdge('2-0', '2', '0'),
    addNode('2'),
    addNode('1'),
    addNode('0')
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



// nodes


test(`edges export an 'getNodesAdjacentTo' function`, t => {
  t.equal(is.fn(getNodesAdjacentTo), true);
  t.end();
});


test(`edges getNodesAdjacentTo throws an error if the node doesn't exist with the correct message`, t => {
  const testGraph = EMPTY_GRAPH;
  const testId = '0';


  try {
    getNodesAdjacentTo(testId, testGraph);
    t.fail('expected to fail');
  } catch(e) {
    t.equal(e.message, `getNodesAdjacentTo: no node with the id ${testId}`);
  }


  t.end();
});


test(`edges getNodesAdjacentTo returns [] if there are no adjacent nodes`, t => {
  const testGraph = compose(
    addNode('2'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);


  const result = getNodesAdjacentTo('0', testGraph);


  t.deepEqual(result, [ ]);
  t.end();
});

test(`edges getNodesAdjacentTo returns the nodes adjacent to the node`, t => {
  const testGraph = compose(
    addEdge('0-1', '0', '1'),
    addEdge('0-2', '0', '2'),
    addEdge('1-0', '1', '0'),
    addEdge('2-0', '2', '0'),
    addNode('2'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);


  const result = getNodesAdjacentTo('0', testGraph);


  t.deepEqual(result, [ '2', '1' ]);
  t.end();
});



test(`edges export an 'getNodesTo' function`, t => {
  t.equal(is.fn(getNodesTo), true);
  t.end();
});

test(`edges getNodesTo throws an error if the node doesn't exist with the correct message`, t => {
  const testGraph = EMPTY_GRAPH;
  const testId = '0';


  try {
    getNodesTo(testId, testGraph);
    t.fail('expected to fail');
  } catch(e) {
    t.equal(e.message, `getNodesTo: no node with the id ${testId}`);
  }


  t.end();
});


test(`edges getNodesTo returns [] if there are no nodes to`, t => {
  const testGraph = compose(
    addNode('2'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);


  const result = getNodesTo('0', testGraph);


  t.deepEqual(result, []);
  t.end();
});


test(`edges getNodesTo returns the nodes adjacent to the node`, t => {
  const testGraph = compose(
    addEdge('0-1', '0', '1'),
    addEdge('0-2', '0', '2'),
    addEdge('1-0', '1', '0'),
    addEdge('2-0', '2', '0'),
    addNode('2'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);


  const result = getNodesTo('0', testGraph);


  t.deepEqual(result, [ '2', '1' ]);
  t.end();
});




test(`edges export an 'getNodesFrom' function`, t => {
  t.equal(is.fn(getNodesFrom), true);
  t.end();
});

test(`edges getNodesFrom throws an error if the node doesn't exist with the correct message`, t => {
  const testGraph = EMPTY_GRAPH;
  const testId = '0';


  try {
    getNodesFrom(testId, testGraph);
    t.fail('expected to fail');
  } catch(e) {
    t.equal(e.message, `getNodesFrom: no node with the id ${testId}`);
  }


  t.end();
});


test(`edges getNodesFrom returns [] if there are no nodes to`, t => {
  const testGraph = compose(
    addNode('2'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);


  const result = getNodesFrom('0', testGraph);


  t.deepEqual(result, []);
  t.end();
});


test(`edges getNodesFrom returns the nodes adjacent to the node`, t => {
  const testGraph = compose(
    addEdge('0-1', '0', '1'),
    addEdge('0-2', '0', '2'),
    addEdge('1-0', '1', '0'),
    addEdge('2-0', '2', '0'),
    addNode('2'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);


  const result = getNodesFrom('0', testGraph);


  t.deepEqual(result, [ '2', '1' ]);
  t.end();
});

