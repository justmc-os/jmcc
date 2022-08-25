# USAGE:
# yarn tree [filename]

if [ ! -f antlr-4.10.1-complete.jar ]; then
  curl -O https://www.antlr.org/download/antlr-4.10.1-complete.jar
fi

cd src/core/grammar
ANTLR=../../../antlr-4.10.1-complete.jar

# Compile parsers
java -cp $ANTLR org.antlr.v4.Tool JustCodeLexer.g4 -o .rig
java -cp $ANTLR org.antlr.v4.Tool JustCodeParser.g4 -o .rig

cd .rig
ANTLR=../$ANTLR

# Compile parser classes
javac -cp $ANTLR *.java
# Execute TestRig
java -cp "$ANTLR;." org.antlr.v4.gui.TestRig JustCode file -gui ../../../../$1
