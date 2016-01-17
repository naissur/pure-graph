import {test} from 'tap';
// import {addNode, getNode, removeNode, hasNode} from './nodes';
import {addNode, getNode, removeNode, hasNode, addEdge, hasEdge, removeEdge, EMPTY_GRAPH} from '.';
import {compose} from 'ramda';


// ======================================= //
// =     pure-graph integration tests    = //
// ========================================//

test('adding nodes and edges', t => {
  const startId = '0';
  const endId = '1';
  const startData = {x: 10, y: 10};
  const endData = {x: 40, y: 40};

  const addedEdge = compose(
    addEdge(startId, endId),
    addNode(startId, startData),
    addNode(endId, endData)
  )(EMPTY_GRAPH);

  const [hasStart, hasEnd, hasEdgeAdded, gotStartData, gotEndData] = [
    hasNode(startId),
    hasNode(endId),
    hasEdge(startId, endId),
    getNode(startId),
    getNode(endId)
  ].map(fn => fn(addedEdge));

  // check existance
  t.equal(hasStart, true, 'added start node');
  t.equal(hasEnd, true, 'added end node');
  t.equal(hasEdgeAdded, true, 'added edge');

  // check node data
  t.deepEqual(gotStartData, {id: startId, data: startData}, 'start node data gets retrieved correctly');
  t.deepEqual(gotEndData, {id: endId, data: endData}, 'end node data gets retrieved correctly');

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


