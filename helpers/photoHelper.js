const path = require('path');
const uuid = require('uuid').v1;

module.exports = {
  photoDirBuilder: (photoName, itemId, itemType) => {
    const dbPath = path.join(itemType, itemId.toString(), 'photots');
    const uploadPath = path.join(process.cwd(), 'static', dbPath);
    const extension = photoName.split('.').pop();
    const newPhotoName = `${uuid()}.${extension}`;
    const finalPath = path.join(uploadPath, newPhotoName);

    return {
      uploadPath,
      finalPath,
      pathForDb: path.join(dbPath, photoName)
    };
  }
};
