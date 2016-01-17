import {test} from 'tap';
// import {addNode, getNode, removeNode, hasNode} from './nodes';
import {addNode, removeNode, hasNode, addEdge, hasEdge, removeEdge, EMPTY_GRAPH} from '.';
import {compose} from 'ramda';


// ======================================= //
// =     pure-graph integration tests    = //
// ========================================//

test('adding nodes and edges', t => {
  const addedEdge = compose(
    addEdge('0', '1'),
    addNode('0', {x: 10, y: 10}),
    addNode('1', {x: 40, y: 40})
  )(EMPTY_GRAPH);

  const [hasStart, hasEnd, hasEdgeAdded] = [
    hasNode('0'),
    hasNode('1'),
    hasEdge('0', '1')
  ].map(fn => fn(addedEdge));

  t.equal(hasStart, true, 'added start node');
  t.equal(hasEnd, true, 'added end node');
  t.equal(hasEdgeAdded, true, 'added edge');

  t.end();
});


test('removing nodes and edges', t => {
  const added = compose(
    addEdge('0', '1'),
    addNode('0', {x: 10, y: 10}),
    addNode('1', {x: 40, y: 40})
  )(EMPTY_GRAPH);

  const removed = compose(
    removeEdge('0', '1'),
    removeNode('1'),
    removeNode('0')
  )(added);

  const [hasStart, hasEnd, hasEdgeAdded] = [
    hasNode('0'),
    hasNode('1'),
    hasEdge('0', '1')
  ].map(fn => fn(removed));

  t.equal(hasStart, false, 'removed start node');
  t.equal(hasEnd, false, 'removed end node');
  t.equal(hasEdgeAdded, false, 'removed edge');

  t.end();
});


