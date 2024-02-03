const Jimp = require("jimp");

const imageUpdate = async (path) => {
  const avatar = await Jimp.read(path);
  avatar.resize(250, 250).writeAsync(path);
};

// значення resize можна винести у константи та використовувати ф-цію у інших місцях

module.exports = imageUpdate;
