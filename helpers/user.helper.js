module.exports = {
  userNormalizator: (userToNormalize) => {
    const fieldToRemove = ['password'];

    fieldToRemove.forEach((value) => {
      delete userToNormalize[value];
    });

    return userToNormalize;
  }
};
