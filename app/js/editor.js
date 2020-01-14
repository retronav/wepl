(function () {
	let $ = require('jquery')
	let path = require('path');
	let emmetMonaco = require('emmet-monaco-es');
	let amdLoader = require('../node_modules/monaco-editor/min/vs/loader.js');
	let amdRequire = amdLoader.require;
	let amdDefine = amdLoader.require.define;
	let editorLang = {
		'html': 'HTML',
		'css': 'CSS',
		'javascript': 'JavaScript'
	}
	function uriFromPath(_path) {
		var pathName = path.resolve(_path).replace(/\\/g, '/');
		if (pathName.length > 0 && pathName.charAt(0) !== '/') {
			pathName = '/' + pathName;
		}
		return encodeURI('file://' + pathName);
	}
	amdRequire.config({
		baseUrl: uriFromPath(path.join(__dirname, '../node_modules/monaco-editor/min'))
	});
	// workaround monaco-css not understanding the environment
	self.module = undefined;
	amdRequire(['vs/editor/editor.main'], function () {
		emmetMonaco.emmetHTML();
		window.editorHTML = monaco.editor.create(document.querySelector('.editorHTML'), {
			language: 'html',
			cursorBlinking: 'solid',
			cursorSmoothCaretAnimation: true,
			fontSize: 18,
			value: `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<script src="./app.js" defer></script>
		<link rel="stylesheet" href="./styles.css">
		<title>Document</title>
	</head>
	<body>
		<h1>Hello World</h1>
		<p>Edit this template...</p>
	</body>
	</html>`,
			fontFamily: 'dm',
			automaticLayout: true,
			fontLigatures: true,
		});
		emmetMonaco.emmetCSS();
		window.editorCSS = monaco.editor.create(document.querySelector('.editorCSS'), {
			language: 'css',
			fontSize: 18,
			cursorBlinking: 'solid',
			cursorSmoothCaretAnimation: true,
			fontFamily: 'dm',
			automaticLayout: true,
			fontLigatures: true,
		});
		monaco.languages.registerDocumentFormattingEditProvider('javascript', {
			async provideDocumentFormattingEdits(model, options, token) {
			  const prettier = require('prettier/standalone');
			  const babylon = require('prettier/parser-babylon');
			  const text = prettier.format(model.getValue(), {
				parser: 'babylon',
				plugins: [babylon],
				singleQuote: true,
			  });
		  
			  return [
				{
				  range: model.getFullModelRange(),
				  text,
				},
			  ];
			},
		  });
		monaco.languages.registerDocumentFormattingEditProvider('html', {
			async provideDocumentFormattingEdits(model, options, token) {
			  const prettier = require('prettier/standalone');
			  const htmlParser = require('prettier/parser-html');
			  const text = prettier.format(model.getValue(), {
				parser: 'html',
				plugins: [htmlParser],
				singleQuote: false,
			  });
		  
			  return [
				{
				  range: model.getFullModelRange(),
				  text,
				},
			  ];
			},
		  });
		monaco.languages.registerDocumentFormattingEditProvider('css', {
			async provideDocumentFormattingEdits(model, options, token) {
			  const prettier = require('prettier/standalone');
			  const css = require('prettier/parser-postcss')
			  const text = prettier.format(model.getValue(), {
				parser: 'css',
				plugins : [css],
				singleQuote: true,
			  });
		  
			  return [
				{
				  range: model.getFullModelRange(),
				  text,
				},
			  ];
			},
		  });
		window.editorJS = monaco.editor.create(document.querySelector('.editorJS'), {
			language: 'javascript',
			fontSize: 18,
			cursorBlinking: 'solid',
			cursorSmoothCaretAnimation: true,
			fontFamily: 'dm',
			automaticLayout: true,
			fontLigatures: true,
		});
		monaco.editor.defineTheme('purple', {
			base: 'vs-dark',
			inherit: true,
			rules: [{
				token: '',
				background: '#2b2f36'
			}],
			colors: {
				"editor.background": '#2b2f36',
			}
		})
		monaco.editor.setTheme('purple')
		//Handle menu inputs
		$('.editorCSS').hide()
		$('.editorJS').hide()
		$('.downpanel .lang').html(editorLang[window.editorHTML.getRawOptions().language])
		$('.sideview .css').click(() => {
			$('.editorCSS').show()
			$('.editorJS').hide()
			$('.editorHTML').hide()
			$('.downpanel .lang').html(editorLang[window.editorCSS.getRawOptions().language])
		})
		$('.sideview .js').click(() => {
			$('.editorCSS').hide()
			$('.editorJS').show()
			$('.editorHTML').hide()
			$('.downpanel .lang').html(editorLang[window.editorJS.getRawOptions().language])
		})
		$('.sideview .html').click(() => {
			$('.editorCSS').hide()
			$('.editorJS').hide()
			$('.editorHTML').show()
			$('.downpanel .lang').html(editorLang[window.editorHTML.getRawOptions().language])
		})
	});
})();