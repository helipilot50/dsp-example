#!/bin/bash
echo "Building frontend..."
mkdir -p publish
echo "created publish folder"

# React
mkdir -p publish/react
cd react
yarn build
cd ..
echo "built react"
cp -r react/build/* publish/react
echo "copied react to publish"

# Angular
mkdir -p publish/angular
cd angular
yarn build
cd ..
echo "built angular"
cp -r angular/dist/not-dsp-angular/* publish/angular
echo "copied angular to publish"
