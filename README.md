
# babel-plugin-stylis-css-in-js

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![MIT][license-image]](LICENSE)

Minify CSS in tagged template literals with [stylis](https://github.com/thysultan/stylis.js)!

## Install

```bash
npm install --save-dev babel-plugin-stylis-css-in-js
```

## Usage

### Via config file, .babelrc, etc.
```json
{
  "plugins": ["stylis-css-in-js"]
}
```

### Via babel CLI
```bash
babel --plugins=stylis-css-in-js  your.js
```

### Via Node API
```js
require('babel-core').transform(yourCode, {
  plugins: ['stylis-css-in-js']
});
```

## Example

If you have souces...

```index.html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <title>Test</title>
  </head>
  <body>
    <div id="app"></div>
  </body>

  <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
 
  <script src="index.js"></script>
</html>
```

```index.js

//
window.css = String.raw;

// like the emotion
const injectGlobal = text => {
  const nodes = document.querySelectorAll('style[data-stylis]');
  let css = Array.prototype.find.call(nodes, node => node.getAttribute('data-stylis') === '0'); // 
  if (!css) {
    const css = document.createElement('style');
    css.setAttribute('type', 'text/css');
    css.setAttribute('data-stylis', '0'); // 
    css.appendChild(document.createTextNode(text));
    document.head.appendChild(css);
    return;
  }
  const textNode = css.firstChild;
  textNode.data += text + "\n\n";
}

//
const isTouchDevice = 
  ('ontouchstart' in window.document.documentElement) 
  || window.navigator.maxTouchPoints > 0
  || window.navigator.msMaxTouchPoints > 0;

//
const buttonBackgroundColor = "rgb(100,100,100)";
const buttonColor = "white";
const margin = '10rem';

//
const myCSS = css`
  /* your comment */
  .my-page {
    margin: ${margin}; // your comment

    button {
      cursor: pointer;
      /*text-transform: uppercase;*/
      /*margin-bottom: 10px;*/
      background-image: none;
      background-size: 0;
      background-repeat: no-repeat;
      background-position: 50% 50%;
      padding: 10px 20px;
      //display: inline-block;
      font-family: Roboto;
      border: 0;
      border-radius: 2px;
      box-shadow: 0 2px 5px 0 rgba(0,0,0,.14),0 2px 10px 0 rgba(0,0,0,.1);
      background-color: ${buttonBackgroundColor};
      color: ${buttonColor};
      transition: background-color .3s ease-out;
      will-change: background-color;
    }

    button:hover {
      ${isTouchDevice ? '' : css`
        background-color: black;
        color: red;
      `}
    }
    
    button:active, button:active:hover {
      box-shadow: none;
    }
  }
`;

//
injectGlobal(newCSS);

// 
const MyApp = props =>
  React.createElement('div', {className: 'my-page'},
    React.createElement('button', {}, 'Click Me')
  );

//
ReactDOM.render(React.createElement(MyApp), document.getElementById('app'));
```

Let's babel index.js...

```js
︙

const newCSS = css`
.my-page{margin:${margin};}.my-page button{cursor:pointer;background-image:none;background-size:0;background-repeat:no-repeat;background-position:50% 50%;padding:10px 20px;font-family:Roboto;border:0;border-radius:2px;box-shadow:0 2px 5px 0 rgba(0,0,0,.14),0 2px 10px 0 rgba(0,0,0,.1);background-color:${buttonBackgroundColor};color:${buttonColor};transition:background-color .3s ease-out;will-change:background-color;}.my-page button:hover{${isTouchDevice ? '' : css`background-color:black;color:red;`}}.my-page button:active,.my-page button:active:hover{box-shadow:none;}
`;

︙
```

Awosame!

## Options

In `.babelrc`, etc. :

```json
{
  "plugins": [
    ["stylis-css-in-js", {
      "tags": ["css", "raw"]
    }]
  ]
}
```

| Option               | Default                  |Description                           |
|----------------------|--------------------------|--------------------------------------|
| `tags`               | `["css"]`                | The name used for detecting css tag. |

## Contribution  

1. Fork it  
2. Create your feature branch  
3. Commit your changes  
4. Push to the branch  
5. Create new Pull Request

## License

MIT
