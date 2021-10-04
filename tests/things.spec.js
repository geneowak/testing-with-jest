test('expectations', () => {
  expect('Some string').toBe('Some string');
  expect(13).toBe(13);
  expect([13]).toEqual([13]);

  const result = { value: Date.now() };

  console.log(result);

  expect(result).toEqual({
    value: expect.any(Number),
  });
});
