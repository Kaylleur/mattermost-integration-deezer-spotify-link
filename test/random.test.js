// dumb test
const error = {
  code: 401,
  message: 'Unauthorized'
};

test('error should have message Unauthorized', () => {
  expect(error.message).toBe('Unauthorized');
  expect(error.code).toBe(401);
});
