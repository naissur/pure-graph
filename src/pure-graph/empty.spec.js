import {test} from 'tap';
import {EMPTY_GRAPH} from './empty';
import is from 'is';


test(`empty exports an 'EMPTY_GRAPH' constant`, t => {
  t.equal(is.defined(EMPTY_GRAPH), true);
  t.end();
});

