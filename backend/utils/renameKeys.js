/**
 * Renames keys of an object based on a key mapping.
 * @param obj - The object whose keys will be renamed.
 * @param keyMapping - An object that maps old keys to new keys.
 * @returns A new object with the renamed keys.
 */
function renameKeys(obj, keyMapping) {
  return Object.keys(obj).reduce((acc, key) => {
    return {
      ...acc,
      [keyMapping[key] || key]: obj[key],
    };
  }, {});
}

module.exports = {
  renameKeys,
};
