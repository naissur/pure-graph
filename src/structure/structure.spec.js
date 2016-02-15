import {test} from 'tap';
import is from 'is';
import {compose, zip, range, reduce, map} from 'ramda';

import {
  addEdge, addNode, EMPTY_GRAPH
} from '../core';

import {
  hasCyclesInConnectedComponent
} from './structure';


test('structure exports a hasCyclesInConnectedComponent function', t => {
  t.assert(is.fn(hasCyclesInConnectedComponent), 'hasCyclesInConnectedComponent is fn');
  t.end();
});

test('hasCyclesInConnectedComponent handles a simple tree', t => {
  const testTree = compose(
    addEdge('0-1', '0', '1'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);

  t.equal(hasCyclesInConnectedComponent('0', testTree), false, 'returns false if started from 0');
  t.equal(hasCyclesInConnectedComponent('1', testTree), false, 'returns false if started from 1');
  t.end();
});


test('hasCyclesInConnectedComponent handles a simple cyclic graph', t => {
  const testTree = compose(
    addEdge('2-0', '2', '0'),
    addEdge('1-2', '1', '2'),
    addEdge('0-1', '0', '1'),
    addNode('2'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);

  t.equal(hasCyclesInConnectedComponent('0', testTree), true, 'returns true if started from 0');
  t.equal(hasCyclesInConnectedComponent('1', testTree), true, 'returns true if started from 1');
  t.end();
});


test('hasCyclesInConnectedComponent handles a medium-sized cyclic graph', t => {
  const testTree = compose(
    addEdge('4-2', '4', '2'),
    addEdge('4-3', '4', '3'),
    addEdge('2-3', '2', '3'),
    addEdge('1-2', '1', '2'),
    addEdge('0-1', '0', '1'),
    addNode('4'),
    addNode('3'),
    addNode('2'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);

  t.equal(hasCyclesInConnectedComponent('0', testTree), true, 'returns true if started from 0');
  t.end();
});


test('hasCyclesInConnectedComponent handles a directed K-2', t => {
  const testTree = compose(
    addEdge('1-0', '1', '0'),
    addEdge('0-1', '0', '1'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);

  t.equal(hasCyclesInConnectedComponent('0', testTree), true, 'returns true if started from 0');
  t.equal(hasCyclesInConnectedComponent('1', testTree), true, 'returns true if started from 1');
  t.end();
});



test('hasCyclesInConnectedComponent handles on a directed K-3', t => {
  const testTree = compose(
    addEdge('2-0', '2', '0'),
    addEdge('1-2', '1', '2'),
    addEdge('0-1', '0', '1'),
    addNode('2'),
    addNode('1'),
    addNode('0')
  )(EMPTY_GRAPH);

  t.assert(hasCyclesInConnectedComponent('0', testTree), 'returns true if started from 0');
  t.assert(hasCyclesInConnectedComponent('1', testTree), 'returns true if started from 1');

  t.end();
});


test('hasCyclesInConnectedComponent handles a one-noded graph', t => {
  const testTree = compose(
    addNode('0')
  )(EMPTY_GRAPH);

  t.equal(hasCyclesInConnectedComponent('0', testTree), false, 'returns false if started from 0');
  t.end();
});


test('hasCyclesInConnectedComponent handles a large tree', t => {
  const N = 100;
  const ids = zip(
    map(String, range(0, N)),
    map(String, range(1, N + 1)));

  const testTree = reduce(
    (graph, [id1, id2]) => 
      compose(
        addEdge(`${id1}__${id2}`, id1, id2),
        addNode(id2)
      )(graph)
  )(addNode('0', EMPTY_GRAPH), ids);

  t.equal(hasCyclesInConnectedComponent('50', testTree), false, 'returns false if started from 0');
  t.end();
});


test('hasCyclesInConnectedComponent handles a large cyclic graph', t => {
  const N = 100;
  const ids = zip(map(String, range(0, N)), map(String, range(1, N + 1)));
  
  const testCyclic = compose(
    addEdge('0__N', '0', String(N)),
    reduce(
      (graph, [id1, id2]) => compose(
        addEdge(`${id1}__${id2}`, id1, id2),
        addNode(id2)
      )(graph)
    )(addNode('0', EMPTY_GRAPH))
  )(ids);

  t.equal(hasCyclesInConnectedComponent('50', testCyclic), true, 'returns true if started from 0');
  t.end();
});

test('hasCyclesInConnectedComponent throws an error if the number of checks is over 1,000', t => {
  const N = 1000;
  const ids = zip(
    map(String, range(0, N)),
    map(String, range(1, N + 1)));

  const testTree = reduce(
    (graph, [id1, id2]) => 
      compose(
        addEdge(`${id1}__${id2}`, id1, id2),
        addNode(id2)
      )(graph)
  )(addNode('0', EMPTY_GRAPH), ids);


  try {
    hasCyclesInConnectedComponent('0', testTree);
    t.fail('expected to throw');
  } catch(e) {
    t.assert(e.message, 'hasCyclesInConnectedComponent: made more than 1,000 checks');
    t.pass();
  }
  t.end();
});

