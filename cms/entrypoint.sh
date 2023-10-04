#!/bin/bash
set -e

case "${NODE_ENV}" in
    development)
        echo "Running Development Server"
        exec yarn dev
        ;;
    test)
        echo "Running Test"
        exec yarn test
        ;;
    production)
        echo "Running Production Server"
        exec yarn start
        ;;
    *)
        echo "Unknown NODE environment: \"${NODE_ENV}\""
esac
