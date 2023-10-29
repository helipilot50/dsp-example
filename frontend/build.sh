#!/bin/bash
echo "Building frontend..."

# not-dsp-graphql
echo "building not-dsp-graphql"
cd not-dsp-graphql
yarn install
yarn build
cd ..

# React
echo "building react"
cd react
yarn install
yarn build
cd ..

# # Angular
# cd angular
# yarn install
# yarn build
# cd ..
