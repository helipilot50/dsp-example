#!/bin/bash
echo "Building frontend..."

# not-dsp-graphql
echo "building not-dsp-graphql"
cd not-dsp-graphql
yarn build
cd ..

# React
echo "building react"
cd react
yarn build
cd ..

# # Angular
# mkdir -p publish/angular
# cd angular
# yarn build
# cd ..
# echo "built angular"
# cp -r angular/dist/not-dsp-angular/* publish/angular
# echo "copied angular to publish"
