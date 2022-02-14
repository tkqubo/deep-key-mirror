import { deepEqual, equal } from 'power-assert';
import { matrix } from '../src';
import 'jest';

describe('matrix', () => {
  it("doesn't process null nor undefined", () => {
    equal(matrix(null), null);
    equal(matrix(undefined), null);
  });
  it('processes 1 string array', () => {
    deepEqual(matrix([['apple', 'orange', 'grape']]), {
      apple: 'apple',
      orange: 'orange',
      grape: 'grape',
    });
  });
  it('processes 2 string array', () => {
    const actual = matrix([
      ['company', 'individual'],
      ['engineer', 'designer', 'manager'],
    ]);
    const expected = {
      company: {
        engineer: 'company.engineer',
        designer: 'company.designer',
        manager: 'company.manager',
      },
      individual: {
        engineer: 'individual.engineer',
        designer: 'individual.designer',
        manager: 'individual.manager',
      },
    };
    deepEqual(actual, expected);
  });
  it('processes action names of async operation', () => {
    const actual = matrix(
      [
        ['user', 'team', 'group'],
        ['get', 'getList', 'post', 'put', 'delete'],
        ['request', 'success', 'failure'],
      ],
      { joinString: '_', upperCase: true },
    );
    equal(actual.user.get.request, 'USER_GET_REQUEST');
    equal(actual.user.delete.success, 'USER_DELETE_SUCCESS');
    equal(actual.team.post.request, 'TEAM_POST_REQUEST');
    equal(actual.team.getList.request, 'TEAM_GETLIST_REQUEST');
    equal(actual.group.put.failure, 'GROUP_PUT_FAILURE');
  });
});
