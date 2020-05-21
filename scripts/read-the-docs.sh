DOCS_ROOT=$KERMA_VIEW_ROOT/docs/dev
DOCS=$DOCS_ROOT/index.html

if [ ! -d $DOCS_ROOT ]; then
  printf "\e[1m\e[31merror:\e[0m No docs found. Make sure you run `npm run docs:build` first."
  exit
fi

if [ ! -f $DOCS ]; then
  printf "\e[1m\e[31merror:\e[0m No docs found. Make sure you run `npm run docs:build` first."  
  exit
fi

if which xdg-open > /dev/null
then
  xdg-open ${DOCS}
elif which gnome-open > /dev/null
then
  gnome-open ${DOCS}
fi
