# Google Book Search Single-Page Application (Antares-style)

These days, browser-based and NodeJS applications are made up of events:
The user types a thing, an API we call gets back to us..

Using the [Antares Protocol](https://npmjs.com/package/antares-protocol) library, we can quickly implement any system
by coming up with a grammar (aka _protocol_) of event type-names, and produce a highly decoupled application with low complexity,
high cohesiveness, and with precise and non-wasteful control of system resources.

For a 'Hello World' of Antares, check out its [RunKit](https://npm.runkit.com/antares-protocol), or the 4 Principles from the [README](https://github.com/deanius/antares):

> 1.  An `agent` processes [Flux Standard Actions](https://github.com/redux-utilities/flux-standard-action) given it through either `agent.process` or `agent.subscribe`.
> 1.  Actions are synchronously processed through functions given to `agent.filter`
> 1.  ...and asynchronously processed through functions known as renderers, configured via `agent.on`.
> 1.  Renderer functions may produce consequences (i.e. effects, or side-effects), return [Observables](https://github.com/tc39/proposal-observable) of new actions to be processed, specify a concurrency mode and be run with other [options](https://deanius.github.io/antares/docs/interfaces/subscriberconfig.html).

---

# UX Requirements

- A search box
- A list of results

---

# Behavior Requirements

- After the user has stopped typing, we should search the Google Books API
- Show a loading spinner while results are being returned

---

# Complete Requirements

Of course, as technicians we know we need to specify it more tightly than
the Product Owner may, to take into account system level issues and code
quality (which we'll fill in ourselves for this demo).

- The UI contains a search box, and a list of results.
- Its easy and clear for the user to work it, share it.
- After the user has stopped typing, we should search the Google Books API.
  - We should not see results from previous searches intermingled with new ones.
  - We should release resources related to previous searches.
- Show a loading spinner while results are being returned.
  - And show results, if we have them in memory already.
- The App should be clean to code, maintain and debug.

We can build this app in 7 cumulative phases, using
only the 4 Antares agent operators (`process`, `subscribe`, `filter`, and `on`).

While we'll use React, you'll see that following the Antares Protocol results in
a Clean Architecture where the app's UI could be switched from React to any other
by changing only a single function.

To illustrate the flexibility of this Antares library was one of my goals in building
this example application the way it is.

Our mantra is that we will be Assigning Consequences to Events, where a consequence
is either a side-effect, or an Action processed in response to the event.

Our design process is to:

- Identify an event and name it
- Assign a consequence to the event, and adjust its operation if necessary
- Repeat

See [the commits](../../commits/master) for how it took shape over the course of about half a day.
