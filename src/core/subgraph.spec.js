import {test} from 'tap';

import {
  addNode
} from './nodes.js';

import {
  addEdge
} from './edges.js';

import {EMPTY_GRAPH} from './empty';
import is from 'is';
import { compose, difference } from 'ramda';

import {
  getNodesOfSubgraphTo,
  getNodesOfSubgraphFrom
} from './subgraph';


test('subgraph getNodesOfSubgraphTo exists', t => {
  t.assert(is.fn(getNodesOfSubgraphTo ))
  t.end();
});

test('subgraph getNodesOfSubgraphTo gets the nodes of subgraph of a simple graph', t => {
  const testGraph = compose(
    addEdge('0-1', '0', '1'),
    addEdge('1-2', '1', '2'),
    addNode('2'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);

  const testNodeId = '1';
  const expected = ['1', '0'];

  const result = getNodesOfSubgraphTo(testNodeId, testGraph);

  t.deepEqual(difference(result, expected), [])
  t.deepEqual(difference(expected, result), [])
  t.end();
});

test('subgraph getNodesOfSubgraphTo gets the nodes of subgraph of a complex graph', t => {
  const testGraph = compose(
    addEdge('0-1', '0', '1'),
    addEdge('2-1', '2', '1'),
    addEdge('3-2', '3', '2'),
    addNode('3'),
    addNode('2'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);
  const expected = ['3', '2', '1', '0'];
  const testNodeId = '1';


  const result = getNodesOfSubgraphTo(testNodeId, testGraph);


  t.deepEqual(difference(result, expected), [])
  t.deepEqual(difference(expected, result), [])
  t.end();
});


/*
test('subgraph getNodesOfSubgraphTo gets the nodes of subgraph of a cyclic graph', t => {
  const testGraph = compose(
    addEdge('0-1', '0', '1'),
    addEdge('1-0', '1', '0'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);
  const expected = ['1', '0'];
  const testNodeId = '0';


  const result = getNodesOfSubgraphTo(testNodeId, testGraph);


  t.deepEqual(difference(result, expected), [])
  t.deepEqual(difference(expected, result), [])
  t.end();
});
*/



test('subgraph getNodesOfSubgraphFrom exists', t => {
  t.assert(is.fn(getNodesOfSubgraphFrom));
  t.end();
});

test('subgraph getNodesOfSubgraphFrom gets the nodes of subgraph of a simple graph', t => {
  const testGraph = compose(
    addEdge('1-0', '1', '0'),
    addEdge('2-1', '2', '1'),
    addNode('2'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);

  const testNodeId = '1';
  const expected = ['1', '0'];

  const result = getNodesOfSubgraphFrom(testNodeId, testGraph);

  t.deepEqual(difference(result, expected), [])
  t.deepEqual(difference(expected, result), [])
  t.end();
});


test('subgraph getNodesOfSubgraphFrom gets the nodes of subgraph of a complex graph', t => {
  const testGraph = compose(
    addEdge('1-0', '1', '0'),
    addEdge('1-2', '1', '2'),
    addEdge('2-3', '2', '3'),
    addNode('3'),
    addNode('2'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);
  const expected = ['3', '2', '1', '0'];
  const testNodeId = '1';


  const result = getNodesOfSubgraphFrom(testNodeId, testGraph);


  t.deepEqual(difference(result, expected), [])
  t.deepEqual(difference(expected, result), [])
  t.end();
});

/*

test('subgraph getNodesOfSubgraphFrom gets the nodes of subgraph of a cyclic graph', t => {
  const testGraph = compose(
    addEdge('0-1', '0', '1'),
    addEdge('1-0', '1', '0'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);
  const testNodeId = '0';
  const expected = ['1', '0'];


  const result = getNodesOfSubgraphFrom(testNodeId, testGraph);


  t.deepEqual(difference(result, expected), [])
  t.deepEqual(difference(expected, result), [])
  t.end();
});

*/

test('subgraph getNodesOfSubgraphFrom gets the nodes of subgraph of a large tree', t => {
  const testGraph = compose(
    addEdge('7-8', '7', '8'),
    addEdge('6-7', '6', '7'),
    addEdge('5-6', '5', '6'),
    addEdge('4-5', '4', '5'),
    addEdge('3-4', '3', '4'),
    addEdge('2-3', '2', '3'),
    addEdge('1-2', '1', '2'),
    addEdge('0-1', '0', '1'),
    addNode('8'),
    addNode('7'),
    addNode('6'),
    addNode('5'),
    addNode('4'),
    addNode('3'),
    addNode('2'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);
  const testNodeId = '2';
  const expected = ['2', '3', '4', '5', '6', '7', '8'];


  const result = getNodesOfSubgraphFrom(testNodeId, testGraph);


  t.deepEqual(difference(result, expected), [])
  t.deepEqual(difference(expected, result), [])
  t.end();
});

