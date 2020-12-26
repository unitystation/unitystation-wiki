var fs = require('fs');
var path = require('path');


const craftables = [];

// const pathToUnityProject = process.argv[2];
// console.log('foobar ', pathToUnityProject);
// if (typeof(pathToUnityProject) === "undefined" || pathToUnityProject.indexOf('UnityProject') !== -1) {
//     throw new Error('You must specify a path to the UnityProject folder!');
// }


/**
 * Read a folder structure recursively
 */
const walk = (dir, done) => {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
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


var basePath =  'C:/git/unitystation/UnityProject';
var prefabPath = basePath + '/Assets/Resources/ScriptableObjects/FoodRecipes';

walk(prefabPath, (err, res) => {
    // only the .asset interest us
    const assetFiles = res.filter(arg => arg.indexOf('.asset') !== -1 && arg.indexOf('.meta') === -1);
    readRecipes(assetFiles)
})

const readRecipes = (filesList) => {
//   console.log('reading ', filesList);
    console.log('read Recipes');
    filesList.map(file => {
        const newRecipe = extractRecipeFromFile(file);
        if (newRecipe) craftables.push(newRecipe);
    })
    console.log(craftables);
}


 /**
  * Extracts a recipe from a given file path
  * @param {*} fileName - path to the .asset file
  * @returns(object)
  */
const extractRecipeFromFile = (fileName) => {
    const fileContents = fs.readFileSync(fileName).toString();
    
    const lines = fileContents.split('\r\n');
    let recipe = "";

    let isCraftable = false;
    lines.forEach(line => {
        // hardcoded as per unity saving scheme (2 spaces)!

        m_Name
        if (line.indexOf('Name: ') === 2) {
            recipe += `Name: ${line.split('Name: ')[1]} `;
        }

        if (line.indexOf('requiredAmount: ') != -1) {
            recipe += `requiredAmount: ${line.split('requiredAmount: ')[1]} `;
            isCraftable = true;
        }

        if (line.indexOf('ingredientName: ') != -1) {
            recipe += `ingredientName: ${line.split('ingredientName: ')[1]} `;
            isCraftable = true;
        }
    })
    recipe += '\r\n';

    if (isCraftable) {
        return recipe;
    }
    else {
        return null;
    }
}