$KERMA_VIEW_ROOT/node_modules/.bin/sloc $KERMA_VIEW_ROOT/src -f csv > stats1.csv
$KERMA_VIEW_ROOT/node_modules/.bin/sloc $KERMA_VIEW_ROOT/src -f csv -d > stats2.csv
$KERMA_VIEW_ROOT/node_modules/.bin/csv2md stats1.csv > $KERMA_VIEW_ROOT/docs/STATS.md
echo >> $KERMA_VIEW_ROOT/docs/STATS.md
echo >> $KERMA_VIEW_ROOT/docs/STATS.md
$KERMA_VIEW_ROOT/node_modules/.bin/csv2md stats2.csv >> $KERMA_VIEW_ROOT/docs/STATS.md
rm -f stats1.csv
rm -f stats2.csv