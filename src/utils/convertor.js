const sequelizeArrayToJSON = (array) => {
   return array.map(object => object.toJSON());
};

const objectToArray = (object, fieldName) => {
    return object.map((obj) => obj[fieldName]);
}

module.exports = {
    sequelizeArrayToJSON,
    objectToArray
}