# pure-graph (WIP)
[![Build Status](https://travis-ci.org/Naissur/pure-graph.svg?branch=master)](https://travis-ci.org/Naissur/pure-graph)
[![Coverage Status](https://coveralls.io/repos/Naissur/pure-graph/badge.svg?branch=master&service=github)](https://coveralls.io/github/Naissur/pure-graph?branch=master)

Simple library for working with directed graphs, built using a functional approach.

# Motivation

The approach used in this library is to store the graph data as **plain JS objects**, and use the provided pure functions  to manipulate it. In this way, testing for the equality of two graphs, sending and receiving them through the wire, and composing their transformations (by just using a composition of functions) is straightforward.

# Example

**note**: the published code is compiled to es5, so using es6 is not obligatory.


```javascript
import g from 'pure-graph';
import _ from 'ramda';
import assert from 'assert';

const empty = g.EMPTY_GRAPH;        // initialize an empty graph
  
const testGraph = _.compose(        // add nodes with '0' and '1' id's, and an edge between them
  g.addEdge('0', '1'),              // (composed functions are applied from the last to the first)
  g.addNode('1', {x: 30, y: 40}),
  g.addNode('0', {x: 10, y: 20})
)(empty);

assert(g.hasNode('0', testGraph), 'a start node has been added');
assert(g.hasNode('1', testGraph), 'an end node has been added');

assert.deepEqual(g.getNode('0', testGraph).data, {x: 10, y: 20}, 'start node data has been stored');
assert.deepEqual(g.getNode('1', testGraph).data, {x: 30, y: 40}, 'end node data has been stored');

assert(g.hasEdge('0', '1', testGraph), 'has an edge from start node to end node');
assert(!g.hasEdge('2', '1', testGraph), `doesn't have an edge from node '2' to node '1'`);


// handles errors correctly

try {
  g.getNode('3', testGraph);    
} catch (e) {
  assert.equal(e, 'getNode: no node with the id 3');
}

```

# API

**note**: all the functions are curried by default.

## Utils

##### EMPTY_GRAPH: GraphData

An empty graph constant.

## Nodes

#### addNode : NodeId -> NodeData -> GraphData -> GraphData

Adds a node with `NodeId` id and `NodeData` data. `NodeId` and `NodeData` can be of any js types.


#### getNode : NodeId -> GraphData -> NodeData

Gets a `NodeId` node data from a graph. Throws an error if the node has not been found.

#### mapNodeData : NodeId -> (NodeData -> NodeData) -> GraphData -> NodeData

Transforms a node's data by applying mapping function. Returns an unmodified graph if the node hasn't been found.

#### setNodeData = NodeId -> NodeData -> GraphData -> GraphData

Sets node data. Throws an error if the node has not been found.

#### hasNode : NodeId -> GraphData -> Boolean

...

#### removeNode : NodeId -> GraphData -> GraphData

Removes a node with `NodeId` id from the graph. Returns an unmodified graph if the node hasn't been found.


## Edges

#### addEdge : NodeId -> NodeId -> GraphData -> GraphData

Adds an edge between nodes with the given id's. If one of the nodes has not been found, throws an error.

#### hasEdge: NodeId -> NodeId -> GraphData -> Boolean

...

#### removeEdge : NodeId -> NodeId -> GraphData -> GraphData

Removes the edge between nodes with the given id's. If any of the nodes has not been found, throws an error.

