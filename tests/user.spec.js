import User from '../User';

describe('User', () => {
  test('name returns full name', () => {
    const user = new User({ firstname: 'Hello', lastname: 'World' });
    expect(user.name).toBe('Hello World');
  });
});
