import {test} from 'tap';
import {
  addNode, getNode, getNodes, hasNode,
  mapNodeData, setNodeData, 
  mapNodes
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


test(`nodes getNode gets the previously added nodes, as an object with the correct shape`, t => {
  const startId = '13';
  const endId = '14';
  const startData = {a: 1, b: 2};
  const endData = {a: 3, b: 4};

  const added = compose(
    addNode(startId, startData),
    addNode(endId, endData)
  )(EMPTY_GRAPH);

  const gotStart = getNode(startId, added);
  const gotEnd = getNode(endId, added);

  t.deepEqual(gotStart, { id: startId, data: startData });
  t.deepEqual(gotEnd, { id: endId, data: endData });
  t.end();
});


test(`nodes getNode throws an error when the node doesn't exist, with the correct error`, t => {
  const testId = '13';

  try {
    getNode(testId, EMPTY_GRAPH);
    t.fail('must have thrown');
  } catch (e) {
    t.equal(e.message, `getNode: no node with the id ${testId}`);
    t.pass('passed');
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


// ==================== //
// =     map node     = //
// ==================== //


test(`nodes export a mapNodeData function`, t => {
  t.equal(is.fn(mapNodeData), true);
  t.end();
})


test(`nodes mapNodeData maps a passed function to the given node data`, t => {
  const testId = '13';
  const testData = {a: 1, b: 2};
  const testDataMapFn = data => (data.a + data.b);
  const testGraph = addNode(testId, testData, EMPTY_GRAPH);

  const result = compose(
    getNode(testId),
    mapNodeData(testId, testDataMapFn)
  )(testGraph);

  t.equal(result.data, 3, 'mapping function gets applied correctly');
  t.end();
})


test(`nodes mapNodeData returns the same graph if node doesn't exist`, t => {
  const testId = '13';
  const testDataMapFn = data => (data.a + data.b);
  const initialGraph = EMPTY_GRAPH;

  const result = mapNodeData(testId, testDataMapFn, initialGraph);

  t.equal(result, initialGraph, 'mapping function makes no changes');
  t.end();
})



// ===================== //
// =   set node data   = //
// ===================== //


test(`nodes export an 'setNodeData' function`, t => {
  t.equal(is.fn(setNodeData), true);
  t.end();
});

test(`nodes setNodeData throws a correct error when the node doesn't exist`, t => {
  const testId = '13';

  try {
    setNodeData(testId, 'nodeData', EMPTY_GRAPH);
    t.fail('expected to throw');
  } catch (e) {
    t.equal(e.message, `setNodeData: node with id ${testId} doesn't exist`);
  }

  t.end();
});


test(`nodes setNodeData sets the node data`, t => {
  const testId = '13';
  const testData = {a: 1, b: 2};
  const testGraph = addNode(testId, null, EMPTY_GRAPH);

  const setNodeGraph = setNodeData(testId, testData, testGraph);

  t.deepEqual(getNode(testId, setNodeGraph).data, testData, 'data gets set correctly');
  t.end();
})


// ==================== //
// =    get nodes     = //
// ==================== //


test(`nodes export an 'getNodes' function`, t => {
  t.equal(is.fn(getNodes), true);
  t.end();
});

test(`nodes getNodes on an empty graph returns []`, t => {
  t.deepEqual(getNodes(EMPTY_GRAPH), [], 'ok');
  t.end();
});

test(`nodes getNodes gets the nodes from the graph`, t => {
  const testData = [
    [1, 2], [3, 4], [5, 6], [7, 8]
  ];
  const testGraph = compose(
    ...(testData.map(
      ( [x, y], index) => addNode(index.toString(), {x, y})
    ))
  )(EMPTY_GRAPH);


  const result = getNodes(testGraph);


  const expected = testData.map( ( [x, y], index) => ({id: index, data: {x, y}}) );
  t.deepEqual(result, expected);
  t.end();
});




// ==================== //
// =     map nodes    = //
// ==================== //


test(`nodes export an 'mapNodes' function`, t => {
  t.equal(is.fn(mapNodes), true);
  t.end();
});

test(`nodes mapNodes maps the node data`, t => {
  const testData = [
    ['1', 2], ['3', 4], ['5', 6], ['7', 8]
  ];
  const testGraph = compose(
    ...(testData.map(
      ( [index, data] ) => addNode(index, data)
    ))
  )(EMPTY_GRAPH);


  const result = compose(
    nodes => nodes.map(n => n.data),
    getNodes,
    mapNodes( (data, index) => [index, data] )
  )(testGraph);


  t.deepEqual(result, testData);
  t.end();
});

