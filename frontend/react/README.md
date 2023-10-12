# not-cmp-react

This project is an example WebApp in React

# How to Run

The WebApp url is `http://localhost:3000`

## Code generation

Typscript types and operations are generated from the GraphQL schema with

```
npm run codegen
```

You should run this command when the schema changes. The generated code is located in `src/graphql/types.ts`, this file should NOT be edited by hand.

## Development

Install dependencies once and then only when they change.

```
npm install
```

Run in development mode

```
npm start
```

## Docker

Build docker image with

```
docker build . -t not-cmax-react
```

This will performa a `production` build and may take some time

To run using Docker

```
docker run -t not-cmax-react -p
```
