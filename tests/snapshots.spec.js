const user = {
  name: 'Ellene Owak',
  age: 23,
  job: 'wife',
};

test('user matches', () => {
  expect(user).toMatchSnapshot();
});
