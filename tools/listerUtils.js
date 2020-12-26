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
    texture: "",
  };

  let isCraftable = false;
  lines.forEach((line) => {
    // hardcoded as per unity saving scheme (2 spaces)!
    if (line.indexOf("Name: ") === 2) {
      recipe.name = line.split("Name: ")[1];
    }

    if (line.indexOf("requiredAmount: ") != -1) {
      recipe.ingredients += `requiredAmount: ${
        line.split("requiredAmount: ")[1]
      } `;
      isCraftable = true;
    }

    if (line.indexOf("ingredientName: ") != -1) {
      recipe.ingredients += `ingredientName: ${
        line.split("ingredientName: ")[1]
      } `;
      isCraftable = true;
    }

    if (line.indexOf("Output: ") != -1) {
      recipe.prefabId = line.split("guid: ")[1].split(",")[0];
    }
  });

  if (isCraftable) {
    return recipe;
  } else {
    return null;
  }
};

module.exports = {
  walk,
  extractRecipeFromScriptableObjectFile,
};
