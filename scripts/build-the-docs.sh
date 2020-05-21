docexe=$KERMA_VIEW_ROOT/node_modules/.bin/jsdoc

if [ ! -f $docexe ]; then
  printf "\e[1m\e[31merror:\e[0m jsdoc not found. Please run \`npm install\` first\n"
  exit
fi

$docexe -c $KERMA_VIEW_ROOT/docs/conf.json -d $KERMA_VIEW_ROOT/docs/dev -R $KERMA_VIEW_ROOT/docs/README.md 