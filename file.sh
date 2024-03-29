#!/bin/bash
#
# Change the file name from "test" to desired input file 
# (The comments in bash are prefixed with #'s)
for x in $(cat README.md)
do
    echo $x
    touch src/styles/"_"$x".scss"
    touch src/kit/"_"$x".kit"
    echo "<!-- @import '_"$x"' -->" >> src/kit/_main.kit
    echo '@import "_'$x'";' >> src/styles/_main.scss
done
