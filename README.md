# Eval.JS
### A simple javascript AST evaluator

It basicaly loops through the nodes (parsed by Esprima) and has special behaviour for it (in an object using key: node type).
There is also a scope that stores the ids of objects then you can get the value though the objects object using key: id.

## API

The main api for running stuff is `run(code)` => `[ values ]`.

For extensions / plugins / low-level the api has some stuff:
 - `addObject(value)` => `id` Add an object to "memory"
 - `evalNode(node, scope)` => `value` Run a node
 - `evalNodes(nodes, scope)` => `[ values ]` Run a bunch of nodes. `run` is basicaly an alias for this just also creating a scope.
 - `uuid()` => `id` Generate an id
 - `__uuid` => `id` Internal integer used for generating `id`s
 - `objects` => `{ id: value }` Internal "memory" thingy stores all the values used in the evaluator
