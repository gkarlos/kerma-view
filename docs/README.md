This is the **Source Code** documentation of [**Kerma-View**](https://github.com/gkarlos/kerma-view). For usage examples see [**here**](https://github.com/gkarlos/kerma-view)


## Dependencies

To run KermaView from source you will need to intall [**nodejs**](https://nodejs.org/en/) ( >= 12.16.3 LTS)

## Installation

1. Clone the repo <br/>
    `git clone https://github.com/gkarlos/kerma-view`
2. Install dependencies <br/>
    `cd kerma-view && npm install`
3. Start KermaView <br/>
    `npm start`

<br/>This documentation can be built with: `npm run docs:build`


## Dependencies

KermaView is built on top of [electron 8.2.1](https://github.com/electron/electron).

Additional depends that are installed

| | |
|-|-|
| [cli-color 2.0.0](https://www.npmjs.com/package/cli-color)    | Terminal colors |
| [commander 5.0.0](https://github.com/tj/commander.js)         | CL argument parser |     
| [jsdoc  3.6.4](https://github.com/jsdoc/jsdoc) (**dev**)      | Documentation generator |
| [minami 1.2.3](https://github.com/nijikokun/minami) (**dev**) | Template for jsdoc      |


| > Run `npm install` from the root of the project to install the dependencies. |
| --- |

### Stuff to check 
- https://onury.io/docma/ (docs)

### Other electron projects with relevant components
- https://github.com/ZeroX-DG/SnippetStore
- https://github.com/jcf94/vizgraph