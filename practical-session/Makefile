dist/instructions.pdf:
	mkdir -p dist/
	pandoc -o dist/instructions.pdf src/instructions.md

install: dist/instructions.pdf

clean:
	rm -rf dist/*