import Users from '../../main/users/users';

describe('Users', () => {
  it('Returns a valid code with correct credentials', async () => {
    const user = new Users();

    const result = await user.validate('user', 'password');
    expect(result).toEqual('1');
  });
  it('Does not return a code with incorrect credentials', async () => {
    const user = new Users();

    const result = await user.validate('use', 'password');
    expect(result).toBeNull();
  });
});
