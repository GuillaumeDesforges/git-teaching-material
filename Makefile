dist/practical-session/instructions.pdf:
	mkdir -p dist/practical-session
	rm -f dist/practical-session/instructions.pdf
	pandoc -o dist/practical-session/instructions.pdf src/practical-session/instructions.md

install: dist/practical-session/instructions.pdf

clean:
	rm -rf dist/*