/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import camelcase from "camelcase";
import { basename, parse } from "path";

// This is a custom Jest transformer turning file imports into filenames.
// http://facebook.github.io/jest/docs/en/webpack.html

export function process(src, filename) {
  const assetFilename = JSON.stringify(basename(filename));

  if (filename.match(/\.svg$/)) {
    // Based on how SVGR generates a component name:
    // https://github.com/smooth-code/svgr/blob/01b194cf967347d43d4cbe6b434404731b87cf27/packages/core/src/state.js#L6
    const pascalCaseFilename = camelcase(parse(filename).name, {
      pascalCase: true,
    });
    const componentName = `Svg${pascalCaseFilename}`;
    return `const React = require('react');
       module.exports = {
         __esModule: true,
         default: ${assetFilename},
         ReactComponent: React.forwardRef(function ${componentName}(props, ref) {
           return {
             $$typeof: Symbol.for('react.element'),
             type: 'svg',
             ref: ref,
             key: null,
             props: Object.assign({}, props, {
               children: ${assetFilename}
             })
           };
         }),
       };`;
  }

  return `module.exports = ${assetFilename};`;
}
