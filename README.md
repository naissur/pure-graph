# co-dispatchable (WIP)
[![Build Status](https://travis-ci.org/Naissur/co-dispatchable.svg?branch=master)](https://travis-ci.org/Naissur/co-dispatchable)
[![Coverage Status](https://coveralls.io/repos/Naissur/co-dispatchable/badge.svg?branch=master&service=github)](https://coveralls.io/github/Naissur/co-dispatchable?branch=master)

Generator runner with support for custom yield transformations 

# Why another co/bluebird.coroutine ?

The two reasons for making this are to improve the **testability and reusability of generators with asynchronous side-effects**, by decoupling the generator control flow and side-effects producers.


### Motivation example

Suppose one needs to write a program which must:

- fetch server status by an http request
- if the request resolves, log the current number of users into a file with a timestamp
- if the request fails, log the error

Leaving implemetation of `get`, `logInfo` and `logError` behind (they return Promises), the code might look like this:

```javascript
export const run = function* () {
  try {
    const serverData = yield get('http://test-1.url.com');
  } catch (e) {
    return logError(timestamp, `Server error: ${prettify(e)}`);
  }
  const timestamp = (new Date()).getTime();
  yield logInfo(timestamp, `Users count is ${serverData.useresCount}`);
};

...

co(run);
```

Testing the `run` function involves checking whether, in the successful case:

- assert that `get` is invoked with the correct arguments
- resolve the mocked promise returned by `get` with a stubbed response
- `then` assert that logInfo is invoked with the correct params

and in the error case:

- assert that `get` is invoked with the correct arguments
- reject the mocked promise returned by `get` with a stubbed response
- `then` assert that logError is invoked with the correct params

If there were more steps, there would have been more checking the invoked params, and chained `.then` asserts.

### A different approach

The idea is to make the following changes:

- `get`, `logInfo` and `logError` should only return the **descriptors** (plain JSON) of the actions involving side-effects
- the generator runner (`co`) takes care of actually invoking side-effects and resuming the generator with the results

The way one can tell the generator how to handle different yield expressions is to pass the `yieldHandler` function. It must be a function takes in a yielded expression, runs the side-effects, and returns a promise which gets fulfilled with the results.

Making this change enables **testing the generator control flow synchronously, with no mocks**. This is because the generator itself does not produce any side-effects: the only thing it does is to synchronously return their descriptors. So the success case testing steps now look like:

- run the generator once, and ensure that the returned action descriptor has the correct url
- invoke `generator.next()` with a stubbed response
- assert that the correct `logInfo` action descriptor is invoked

The side-effects of `get`, `logInfo`, `logError` and their runners are tested separately.

# Default handler

A default yield handler (`co-dispatchable/co-handler`) is provided (much like `co`'s), which handles:

- **promises**
- **arrays with promise values** - substitutes the promises for the values they resolved with
- **objects with promise values** - the same way as with arrays
- **generator functions** - `run`s the generator, and resumes the root generator with the returned value

If none were matched, the value remains unchanged.


# API

#### run(generatorFunc: GeneratorFunction [, transformYield: a -> b | Promise b] ) : Promise

Runs the generator, resuming it with the transformed `yield` values (either synchronously, or asynchronously). Can be used with the co-handler.


#### combineYieldTransforms(transforms: [a -> b | Promise b]) : a -> Promise b

A helper function for combining the yield transforms.

It returns a transform function which, when tested against some yield, calls all of the transforms and returns the Promise resolving with the value returned by the first (by order) successful one (either returned a value synchronously or resolved asynchronously). If all of the transforms fail, it rejects the promise.
