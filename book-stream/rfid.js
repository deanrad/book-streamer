const { concat, of, interval } = require('rxjs');
const { agent, after } = require('antares-protocol');
const { map, take } = require('rxjs/operators');
const { createStore } = require('redux');

const store = createStore((state = { validTags: [], log: [] }, action) => {
  switch (action.type) {
    case 'tag/validTags':
      return {
        validTags: action.payload
      };
    case 'tag/valid':
    case 'tag/invalid':
      return {
        ...state,
        log: [
          ...(state.log || []),
          { valid: action.type === 'tag/valid', tag: action.payload }
        ]
      };
    default:
      return state;
  }
});
// ----------- Set up agent --------------
agent.addFilter(({ action }) => store.dispatch(action));
agent.addFilter(({ action }) =>
  console.log(action.type, JSON.stringify(store.getState()))
);

agent.on('start', getValidTags, {
  type: 'tag/validTags'
});

agent.on('start', getTagScans, { type: 'tag/scan' });

agent.on(
  'tag/scan',
  ({ action }) => {
    const isValid = (store.getState().validTags || []).includes(action.payload);
    return of({
      type: 'tag/' + (isValid ? 'valid' : 'invalid'),
      payload: action.payload
    });
  },
  {
    processResults: true
  }
);

agent.on(/^tag\/(in)?valid$/, showResult, { concurrency: 'cutoff' });

// ----------- Do processing --------------

agent.process({ type: 'start' });

// ----------- Define implementations --------------

function getValidTags() {
  return of([1.1, 2.2, 3.141592]);
}

function getTagScans() {
  return interval(500).pipe(
    map(
      i =>
        ({
          '0': 1.1,
          '1': 5.5
        }[i])
    ),
    take(2)
  );
}

const log = msg => console.log(msg);

function showResult({ action }) {
  const msg = action.type === 'tag/valid' ? 'Yay!' : 'Oops..';
  return concat(after(300, log, msg), after(300, log, 'Try again soon...'));
}

/*
LEFTOFF: Seeing why ajaxStreamingGet concatMap after seems not to be cancelable,
when it seems to work fine in mute mode. Is it the `type` param in the config to `on`?

Note the following output shows mute mode works - the invalid scan
which comes second is muted- no part of its result is shown.
(getTagScans 500 msec apart, result showing halves 300 msec each)

agent.on(/^tag\/(in)?valid$/, showResult, { concurrency: 'cutoff' });

function showResult({ action }) {
  const msg = action.type === 'tag/valid' ? 'Yay!' : 'Oops..';
  return concat(after(300, log, msg), after(300, log, 'Try again soon...'));
}

start {"validTags":[],"log":[]}
tag/validTags {"validTags":[1.1,2.2,3.141592]}
tag/scan {"validTags":[1.1,2.2,3.141592]}
tag/valid {"validTags":[1.1,2.2,3.141592],"log":[{"valid":true,"tag":1.1}]}
Yay!
tag/scan {"validTags":[1.1,2.2,3.141592],"log":[{"valid":true,"tag":1.1}]}
tag/invalid {"validTags":[1.1,2.2,3.141592],"log":[{"valid":true,"tag":1.1},{"valid":false,"tag":5.5}]}
Try again soon...

Cutoff mode suffers too, same timing params:

start {"validTags":[],"log":[]}
tag/validTags {"validTags":[1.1,2.2,3.141592]}
tag/scan {"validTags":[1.1,2.2,3.141592]}
tag/valid {"validTags":[1.1,2.2,3.141592],"log":[{"valid":true,"tag":1.1}]}
Yay!
tag/scan {"validTags":[1.1,2.2,3.141592],"log":[{"valid":true,"tag":1.1}]}
tag/invalid {"validTags":[1.1,2.2,3.141592],"log":[{"valid":true,"tag":1.1},{"valid":false,"tag":5.5}]}
Try again soon...
Oops..
Try again soon...

The 2nd
*/
