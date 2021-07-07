
const stylis = require('stylis');
const expressionMark = '--________stylis_it________';

module.exports = babel => {
  return {
    visitor: {
      TaggedTemplateExpression(path, state) {
        const tag = path.get('tag');
        const tagName = tag.isIdentifier() ? tag.node.name : 
          (tag.isCallExpression() ? tag.node.callee.name : 
          (tag.isMemberExpression() ? tag.node.property.name : false));

        const optTags = getOption(state, 'tags', ['css']);
        if (optTags.includes(tagName)) {
          const quasi = path.get('quasi');
          const quasis = quasi.get('quasis');
          const expressions = quasi.get('expressions');
          let srcCSS = '';
          quasi.node.quasis.forEach((v, i) => {
            srcCSS += v.value.raw; 
            if (i < expressions.length) {
              srcCSS += expressionMark + i; 
              if (v.value.raw.trimRight().slice(-1) != ':') srcCSS += ':{};';
            }
          })

          const newCSS = stylis.serialize(stylis.compile(srcCSS), stylis.middleware([
            stylis.stringify
          ])); 
          
          const re = new RegExp(expressionMark + '(\\d)(:{};)?', 'g');
          let startIndex = 0;
          const newQuasis = [], newExpressions = [];
          while (1) {
            const result = re.exec(newCSS);
            
            if (result === null) {
              const raw = newCSS.substring(startIndex);
              newQuasis.push(
                babel.types.templateElement({raw}, true)
              )
              break;
            }
            
            const raw = newCSS.substring(startIndex, result.index);
            newQuasis.push(
              babel.types.templateElement({raw}, false)
            )
            startIndex = re.lastIndex;

            newExpressions.push(expressions[result[1]]);
          }

          newQuasis.forEach((v, i) => {
            if (i < quasis.length) {
              quasis[i].replaceWith(v);
            } else {
              quasis[quasis.length-1].insertAfter(v);
            }
          })
        
          newExpressions.forEach((v, i) => {
            if (i < expressions.length) {
              expressions[i].replaceWith(v);
            } else {
              expressions[expressions.length-1].insertAfter(v);
            }
          })

          //path.skip();
          
        } // end of if (tagName === 'css')
      }
    }
  }
}

//
const getOption = ({opts}, name, defaultValue = true) => {
  return opts[name] === undefined || opts[name] === null
    ? defaultValue : opts[name];
}
