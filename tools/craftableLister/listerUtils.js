var fs = require("fs");
var path = require("path");

/**
 * Reads all the files in a folder and it's subfolders recursively
 * @param {*} dir path to folder
 * @param {*} done - callback function. 2 args called, err and an array with all the files
 */
const walk = function (dir, done) {
  var results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

/**
 * Extracts a recipe from a given file path
 * @param {*} fileName - path to the .asset file
 * @returns(object)
 */
const extractRecipeFromScriptableObjectFile = (fileName) => {
  const fileContents = fs.readFileSync(fileName).toString();

  const lines = fileContents.split("\r\n");
  let recipe = {
    name: "",
    ingredients: "",
    prefabId: "",
    textureId: "",
    texturePath: "",
  };

  let isCraftable = false;
  lines.forEach((line) => {
    // hardcoded as per unity saving scheme (2 spaces)!
    if (line.indexOf("Name: ") === 2) {
      recipe.name = line.split("Name: ")[1];
    }

    if (line.indexOf("requiredAmount: ") != -1) {
      recipe.ingredients += `${line.split("requiredAmount: ")[1]} `;
      isCraftable = true;
    }

    if (line.indexOf("ingredientName: ") != -1) {
      recipe.ingredients += `${line.split("ingredientName: ")[1]} + `;
      isCraftable = true;
    }

    if (line.indexOf("Output: ") != -1) {
      recipe.prefabId = line.split("guid: ")[1].split(",")[0];
    }
  });

  recipe.ingredients = recipe.ingredients.slice(
    0,
    recipe.ingredients.length - 3
  );

  return recipe;

  // if (isCraftable) {
  //   return recipe;
  // } else {
  //   return null;
  // }
};

/**
 * Reads the prefab id from a given fileName
 * @param {string} fileName
 */
const extractPrefabData = (fileName) => {
  const metaContents = fs.readFileSync(fileName).toString();
  const prefabId = metaContents.split("guid: ")[1].split("\r\n")[0];

  let prefabContents;
  try {
    prefabContents = fs.readFileSync(fileName.split(".meta")[0]).toString();
  } catch {
    // edge case for .meta files with no prefab (folders)
    return null;
  }

  let spriteId = null;
  //  let spriteSheetId = null;

  if (prefabContents.indexOf("m_Sprite") !== -1) {
    try {
      spriteId = prefabContents
        .split("m_Sprite")[1]
        .split("guid: ")[1]
        .split(",")[0];
    } catch {
      // edge case for prefabs with no sprites. the fk are those?
      //return null;
    }
  }

  if (spriteId === null && prefabContents.indexOf("PresentSpriteSet") !== -1) {
    try {
      spriteId = prefabContents
        .split("PresentSpriteSet")[1]
        .split("guid: ")[1]
        .split(",")[0];
    } catch {
      // edge case for prefabs with no sprites. the fk are those?
      //return null;
    }
  }

  // try to extract the nutritionLevel
  // propertyPath: NutritionLevel;
  // value: 113;
  let nutritionLevel = null;
  if (prefabContents.indexOf("NutritionLevel") !== -1) {
    nutritionLevel = prefabContents
      .split("NutritionLevel")[1]
      .split("value: ")[1]
      .split("\r\n")[0];
  }

  // try to extract the initialDescription
  // propertyPath: initialDescription
  // value: A base for any self-respecting burger.  
  let initialDescription = null;
  if (prefabContents.indexOf("initialDescription") !== -1) {
    initialDescription = prefabContents
      .split("initialDescription")[1]
      .split("value: ")[1]
      .split("objectReference")[0];
  }

  // try to extract the prefab name
  // propertyPath: m_Name
  // value: AstrotamePack  
  let name = null;
  if (prefabContents.indexOf("propertyPath: m_Name") !== -1) {
    try {
      name = prefabContents
        .split("propertyPath: m_Name")[1]
        .split("value: ")[1]
        .split("\r\n")[0];
    }
    catch {
      console.log('foobar');
    }
  }  

  if (spriteId === null) return null;

  return {
    prefabId,
    name,
    spriteId,
    nutritionLevel,
    initialDescription
  };
};

const extractTextureData = (fileName) => {
  const pngMetaContents = fs.readFileSync(fileName).toString();
  const textureId = pngMetaContents.split("guid: ")[1].split("\r\n")[0];

  let pngFileName = fileName.split(".meta")[0];
  return {
    textureId,
    pngFileName,
  };
};

module.exports = {
  walk,
  extractRecipeFromScriptableObjectFile,
  extractPrefabData,
  extractTextureData,
};
