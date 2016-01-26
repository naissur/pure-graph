import {test} from 'tap';
import is from 'is';
import {compose} from 'ramda';

import {EMPTY_GRAPH} from './empty';
import {
  getEdgesFromNode, getEdgesToNode, getEdgesIncidentToNode
} from './incident';

import {
  addEdge
} from './edges';

import {
  addNode
} from './nodes';


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


// ============= //
// =    adj     = //
// ============= //


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



