var fs = require('fs');
var path = require('path');


// scriptableobject -> prefab -> sprite
// 1) c:\git\unitystation\UnityProject\Assets\Resources\ScriptableObjects\FoodRecipes\
// read
// Name: Meat Donut
//   Ingredients:
//   - requiredAmount: 1
//     ingredientName: raw cutlet
//   - requiredAmount: 1
//     ingredientName: pastry base
//   Output: {fileID: 5602298466666205948, guid: c3aae48c2e0c81140a838e4e5a6f5b2a, type: 3}


// 2 c:\git\unitystation\UnityProject\Assets\Resources\Prefabs\Items\Food\Snacks\
// read donutmeat.meta -> get guid
// read donutmean.prefab -> get the sprite!


// 3 READ THE TEXTURES FROM c:\git\unitystation\UnityProject\Assets\Textures\items\food\
// read the .asset files, get the guid!
// match with png!




// this is where we are reading the craftable recipes from. 
// eg: we will find a 'bearburger' recipe
const CRAFTABLE_FOLDER = '/Assets/Resources/ScriptableObjects/FoodRecipes';

// this is where we're trying to find the textures, based on the recipe name. 
// eg:we'll search for files containing 'bearburger'
const TEXTURE_FOLDER = '/Assets/Textures/items/food';

let craftables = [];

let assetFiles = []
let textureFiles = [];

var foldersRead = 0;

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


const init = ()  => {
    if (foldersRead !== 2) {
//        console.log(' not ready yet ');
        return;
    }
    craftables = readRecipes(assetFiles);

//    console.log(craftables);
    craftables.map(craftable => {
        const matchedImage = matchRecipeNameWithImage(craftable.textureName, textureFiles)
        if (matchedImage) {
            console.log(`matched ${craftable.name} with ${matchedImage}`)
        }
        else {
            console.log('---- not matched', craftable.name);
        }
    })
//    
}

var basePath =  'C:/git/unitystation/UnityProject';
const prefabPath = basePath + CRAFTABLE_FOLDER;
const texturePath = basePath + TEXTURE_FOLDER;

walk(prefabPath, (err, res) => {
    // only the .asset interest us
    assetFiles = res.filter(arg => arg.indexOf('.asset') !== -1 && arg.indexOf('.meta') === -1);
    foldersRead++;
    init();
})

walk(texturePath, (err, res) => {
    textureFiles = res.filter(arg => arg.indexOf('.png') !== -1 && arg.indexOf('.meta') === -1);
    foldersRead++;
    init();    
});


const matchRecipeNameWithImage = (recipeName, textureFiles) => {
    const lowerCaseRecipeName = recipeName.toLowerCase();
    const filesNr = textureFiles.length;
    for (let i=0; i<filesNr; i++) {
        if (textureFiles[i].indexOf(lowerCaseRecipeName) !== -1) {
            return textureFiles[i];
        }
    }
    return null;
}

const readRecipes = (filesList) => {
    const myRecipes = [];
    filesList.map(file => {
        const newRecipe = extractRecipeFromFile(file);
        if (newRecipe) myRecipes.push(newRecipe);
    })
    return myRecipes;
}




 /**
  * Extracts a recipe from a given file path
  * @param {*} fileName - path to the .asset file
  * @returns(object)
  */
const extractRecipeFromFile = (fileName) => {
    const fileContents = fs.readFileSync(fileName).toString();
    
    const lines = fileContents.split('\r\n');
    let recipe = {
        name:'',
        textureName:'',
        ingredients:''
    };

    let isCraftable = false;
    lines.forEach(line => {
        // hardcoded as per unity saving scheme (2 spaces)!

//        m_Name

        if (line.indexOf('m_Name: ') === 2) {
            // edge case. some of the craftables are plural (CheeseWedges, but the texture  is singular (cheesewedge.png))
            let recipeName = line.split('m_Name: ')[1];
            if (recipeName.charAt(recipeName.length-1) === 's') {
                recipeName.slice(0, recipeName.length-1)
            }
            
            recipe.textureName = recipeName;
        }

        if (line.indexOf('Name: ') === 2) {
            recipe.name = line.split('Name: ')[1];
        }

        if (line.indexOf('requiredAmount: ') != -1) {
            recipe.ingredients += `requiredAmount: ${line.split('requiredAmount: ')[1]} `;
            isCraftable = true;
        }

        if (line.indexOf('ingredientName: ') != -1) {
            recipe.ingredients += `ingredientName: ${line.split('ingredientName: ')[1]} `;
            isCraftable = true;
        }
    })

    if (isCraftable) {
        return recipe;
    }
    else {
        return null;
    }
}