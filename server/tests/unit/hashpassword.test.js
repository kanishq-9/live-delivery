const { hashPassword } = require("../../validators/bcrypt.validator");

hashPassword
test('should return hashedPassword', async() => {
  const hash = await hashPassword('testT@1234');
  expect(hash).not.toBe('testT@1234');
})
