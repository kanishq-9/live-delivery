const { hashPassword } = require("../../service/bcrypt.service");

hashPassword
test('should return hashedPassword', async() => {
  const hash = await hashPassword('testT@1234');
  expect(hash).not.toBe('testT@1234');
})
