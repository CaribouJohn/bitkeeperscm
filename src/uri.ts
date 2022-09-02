/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Uri } from 'vscode';

export interface BitkeeperUriParams {
  path: string;
  ref: string;
  submoduleOf?: string;
}

export function isBitkeeperUri(uri: Uri): boolean {
  return /^bitkeeper$/.test(uri.scheme);
}

export function fromBitkeeperUri(uri: Uri): BitkeeperUriParams {
  return JSON.parse(uri.query);
}

export interface BitkeeperUriOptions {
  replaceFileExtension?: boolean;
  submoduleOf?: string;
}

// As a mitigation for extensions like ESLint showing warnings and errors
// for bitkeeper URIs, let's change the file extension of these uris to .bitkeeper,
// when `replaceFileExtension` is true.
export function toBitkeeperUri(uri: Uri, ref: string, options: BitkeeperUriOptions = {}): Uri {
  const params: BitkeeperUriParams = {
    path: uri.fsPath,
    ref
  };

  if (options.submoduleOf) {
    params.submoduleOf = options.submoduleOf;
  }

  let path = uri.path;

  if (options.replaceFileExtension) {
    path = `${path}.bitkeeper`;
  } else if (options.submoduleOf) {
    path = `${path}.diff`;
  }

  return uri.with({
    scheme: 'bitkeeper',
    path,
    query: JSON.stringify(params)
  });
}

/**
 * Assuming `uri` is being merged it creates uris for `base`, `ours`, and `theirs`
 */
export function toMergeUris(uri: Uri): { base: Uri; ours: Uri; theirs: Uri; } {
  return {
    base: toBitkeeperUri(uri, ':1'),
    ours: toBitkeeperUri(uri, ':2'),
    theirs: toBitkeeperUri(uri, ':3'),
  };
}