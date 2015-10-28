'use strict';
import * as _ from 'lodash';

export function deepKeyMirror(obj: any): any {
  'use strict';
  if (_.isObject(obj)) {
    return obj;
  }
  if (_.isArray(obj)) {
    return obj;
  }
  return obj;
}
