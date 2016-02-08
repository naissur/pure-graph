import {test} from 'tap';
import is from 'is';
import {compose} from 'ramda';

import {
  addNode, addEdge, EMPTY_GRAPH
} from './index.js';

import {convertToIncidentForm, convertFromIncidentForm} from './convert';

const TEST_GRAPH = compose(
  addEdge('0-2', '0', '2'),
  addEdge('0-1', '0', '1'),
  addNode('2'),
  addNode('1'),
  addNode('0')
)(EMPTY_GRAPH);


test('convert exports a convertToIncidentForm function', t => {
  t.assert(is.fn(convertToIncidentForm));
  t.end();
});

test('convert exports a convertFromIncidentForm function', t => {
  t.assert(is.fn(convertFromIncidentForm));
  t.end();
});


test('convertToIncidentForm(g) !== g', t => {
  const converted = convertToIncidentForm(TEST_GRAPH);

  t.notDeepEqual(converted, TEST_GRAPH);
  t.end();
});

test('convertToIncidentForm and convertFromIncidentForm are inverse of each other', t => {
  const forward = compose(
    convertFromIncidentForm,
    convertToIncidentForm
  )(TEST_GRAPH);

  t.deepEqual(forward, TEST_GRAPH);
  t.end();
});

test('convertToIncidentForm compresses the graph', t => {
  const initial = TEST_GRAPH;
  const converted = convertToIncidentForm(initial);

  const initialSize = JSON.stringify(initial).length;
  const convertedSize = JSON.stringify(converted).length;

  t.assert(initialSize > convertedSize, `initialSize(${initialSize}) > convertedSize( ${ convertedSize } )`);
  t.end();
});


