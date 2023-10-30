#!/bin/bash
echo "Building frontend..."

# not-dsp-graphql
echo "building not-dsp-graphql"
cd not-dsp-graphql
yarn install
yarn build
cd ..

# React
if [[ $1 == React ]]; then
  echo "*** building react *** "
  cd react
  yarn install
  yarn build
  cd ..
fi

# Angular
if [[ $1 == Angular ]]; then
  echo "*** building angular ***"
  cd angular
  yarn install
  yarn build
  cd ..
fi

