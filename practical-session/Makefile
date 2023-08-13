dist/instructions.pdf:
	mkdir -p dist/
	pandoc -o dist/instructions.pdf --variable geometry:margin=2cm --variable colorlinks=true src/instructions.md

install: dist/instructions.pdf

clean:
	rm -rf dist/*