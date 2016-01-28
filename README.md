# pure-graph (WIP)
[![Build Status](https://travis-ci.org/Naissur/pure-graph.svg?branch=master)](https://travis-ci.org/Naissur/pure-graph)
[![Coverage Status](https://coveralls.io/repos/Naissur/pure-graph/badge.svg?branch=master&service=github)](https://coveralls.io/github/Naissur/pure-graph?branch=master)
[![npm package](https://badge.fury.io/js/pure-graph.svg)](https://www.npmjs.com/package/pure-graph)

Simple library for working with directed graphs, built using a functional approach. **(Work in progress)**





# Motivation

The approach used in this library is to store the graph data as **plain JS objects**, and only use the provided pure functions to manipulate it. In this way, testing for the equality of two graphs, sending and receiving them through the wire, and composing their transformations (by just using a composition of functions) is conceptually simple and straightforward.





# Example

**note**: the published code is compiled to ES5, so using ES6 is not obligatory.


```javascript
import g from 'pure-graph';
import _ from 'ramda';
import assert from 'assert';


const empty = g.EMPTY_GRAPH;        // initialize an empty graph
  
const testGraph = _.compose(        // add nodes with '0' and '1' id's, and an edge between them
  g.addEdge('0-1', '0', '1'),       // (composed functions are applied from the last to the first)
  g.addNode('1', {x: 30, y: 40}),
  g.addNode('0', {x: 10, y: 20})
)(empty);


// assertions

assert(g.hasNode('0', testGraph), `has a node with id '0'`);
assert(g.hasNode('1', testGraph), `has a node with id '1'`);

assert(g.hasEdgeFromTo('0', '1', testGraph), `has an edge from '0' to '1'`);
assert.equal(g.hasEdgeFromTo('0', '2', testGraph), false, `doesn't have an edge from '0' to '2'`);

assert(g.hasEdgeWithId('0-1', testGraph), `has an edge with id '0-1'`);
assert.equal(g.hasEdgeWithId('0-2', testGraph), false, `doesn't have an edge with id '0-2'`);


// removal

assert.equal(
  _.compose(
    g.hasEdgeFromTo('0', '1'),
    g.removeEdgeWithId('0-1')
  )(testGraph), false, 'removes the edge between nodes'
);

assert.equal(
  _.compose(
    g.hasNode('0'),
    g.removeNode('0')
  )(testGraph), false, 'removes the node'
);

assert.equal(
  _.compose(
    g.hasEdgeFromTo('0', '1'),
    g.removeNode('0')
  )(testGraph), false, 'removes the edge after removing one of adjacent nodes'
);


// data access

assert.deepEqual(g.getNode('0', testGraph).data, {x: 10, y: 20}, 'start node data has been stored');
assert.deepEqual(g.getNode('1', testGraph).data, {x: 30, y: 40}, 'end node data has been stored');

assert.deepEqual(g.getNodes(testGraph), [ {id: '0', data: {x: 10, y: 20}}, {id: '1', data: {x: 30, y: 40}} ], 'gets a nodes array');
assert.deepEqual(g.getEdges(testGraph), [ {id: '0-1', from: '0', to: '1'} ], 'gets an edges array');

assert.deepEqual(g.getEdgesFromNode('0', testGraph), [ {id: '0-1', from: '0', to: '1'} ], 'gets edges from the node');
assert.deepEqual(g.getEdgesIncidentToNode('1', testGraph), [ {id: '0-1', from: '0', to: '1'} ], 'gets edges incident to the node');
assert.deepEqual(g.getEdges(testGraph), [ {id: '0-1', from: '0', to: '1'} ], 'gets an edges array');

// data transforming functions

const coordsSum = _.compose(
    _.sum,
    _.map(_.prop('data')),
    g.getNodes,
    g.mapNodes( ({x, y}) => (x + y) )
  )(testGraph)

assert.equal(coordsSum, 100);

// error handling

try {
  g.getNode('3', testGraph);    
} catch (e) {
  assert.equal(e.message, 'getNode: no node with the id 3');
}


console.log('all good!');

```




# Installing

`npm i pure-graph`





# Development

`npm run build` builds

`npm test` builds the code and runs the tests **on the code being published** (/lib folder)

`npm run dev` starts a files watching builder and test runner





# API

**note**: all the functions are curried by default.



## Adding

#### `addNode : NodeId -> NodeData -> GraphData -> GraphData`
Adds a node with `NodeId` id and `NodeData` data. `NodeId` and `NodeData` can be of any js types.

#### `addEdge : EdgeId -> NodeId -> NodeId -> GraphData -> GraphData`
Adds an edge between nodes with the given id's. If one of the nodes has not been found, throws an error.



## Asserting

#### `hasNode : NodeId -> GraphData -> Boolean`

#### `hasEdgeFromTo : NodeId -> NodeId -> GraphData -> Boolean`

#### `hasEdgeWithId : EdgeId -> GraphData -> Boolean`



## Retrieving

#### `getNode : NodeId -> GraphData -> {id: NodeId, data: NodeData}`

#### `getEdgeFromTo : NodeId -> NodeId -> GraphData -> {id: EdgeId, from: NodeId, to: NodeId}`

#### `getEdgeWithId : EdgeId -> GraphData -> {id: EdgeId, from: NodeId, to: NodeId}`

**note**: all of the getters above throw an error if the item has not been found.


#### `getNodes : GraphData -> [ {id: NodeId, data: NodeData} ]`

#### `getEdges : GraphData -> [ {id: EdgeId, from: NodeId, to: NodeId} ]`

#### `getEdgesFromNode: NodeId -> GraphData -> [ {id: EdgeId, from: NodeId, to: NodeId} ]`
Gets the edges incident to the node with the given id, directed **from** the node.

#### `getEdgesToNode: NodeId -> GraphData -> [ {id: EdgeId, from: NodeId, to: NodeId} ]`
Gets the edges incident to the node with the given id, directed **towards** the node.

#### `getEdgesIncidentToNode: NodeId -> GraphData -> [ {id: EdgeId, from: NodeId, to: NodeId} ]`
Gets all of the edges incident to the node with the given id.





## Transforming

#### `mapNodeData : NodeId -> (NodeData -> NodeData) -> GraphData -> GraphData`
Transforms a node's data by mapping. Returns an unmodified graph if the node hasn't been found.

#### `setNodeData : NodeId -> NodeData -> GraphData -> GraphData`
Sets node data. Throws an error if the node has not been found.

#### `mapNodes : ( NodeData -> NodeId -> NodeData) -> GraphData -> GraphData`
Transforms the nodes' data by mapping.





## Removing

#### `removeNode : NodeId -> GraphData -> GraphData`
Removes a node with `NodeId` id and **all of the adjacent edges** from the graph. Returns an unmodified graph if the node hasn't been found.

#### `removeEdgeFromTo : NodeId -> NodeId -> GraphData -> GraphData`
Removes the edge between nodes with the given id's. If any of the nodes has not been found, throws an error.

#### `removeEdgeWithId : EdgeId -> GraphData -> GraphData`
Removes the edge with the given id.





## Utils

#### `EMPTY_GRAPH: GraphData`

An empty graph constant.

