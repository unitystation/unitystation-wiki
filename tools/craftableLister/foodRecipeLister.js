const fs = require('fs');
const path = require('path');
const utils = require('./listerUtils');

const prefabs = require('./prefabs');


// basepath to the unityProject folder
const BASE_PATH = 'C:/git/unitystation/UnityProject';

const craftingManagerPath = `${BASE_PATH}/Assets/Resources/Prefabs/SceneConstruction/NestedManagers/craftingManager.prefab`;

const craftingManagerObj = utils.fileToObject(craftingManagerPath);
const subObj = craftingManagerObj.filter(el => el?.MonoBehaviour?.meals !== undefined)[0];


const extractGuids = (arr) => {
  return arr.map(el=> el.guid);
}

const meals = extractGuids(subObj.MonoBehaviour.meals.recipeList);
const cuts = extractGuids(subObj.MonoBehaviour.cuts.recipeList);
const roll = extractGuids(subObj.MonoBehaviour.roll.recipeList);
const simplemeal = extractGuids(subObj.MonoBehaviour.simplemeal.recipeList);
const grind = extractGuids(subObj.MonoBehaviour.grind.grinderRecipeList);


// CRAWL THE RECIPES
const crawlRecipes = () => {
  return new Promise(resolve => {
    const allRecipes = {};
    const scriptablePath = `${BASE_PATH}/Assets/Resources/ScriptableObjects/FoodRecipes`;
    let scriptableFiles = [];
    
    
    utils.walk(scriptablePath, (err, res) => {
      // only the .asset interest us
      scriptableFiles = res.filter(
        (arg) => arg.indexOf('asset.meta') !== -1
      );

      scriptableFiles.forEach(file => {
        const metaObj = utils.fileToObject(file)[0];
        const recipeObj = utils.fileToObject(file.replace('.meta', ''));
        const outputId = recipeObj[0].MonoBehaviour.Output.guid;

        const ingredients = recipeObj[0].MonoBehaviour.Ingredients;;

        allRecipes[metaObj.guid] = {
          outputId: outputId,
          ingredients
        };
      })
      resolve(allRecipes);      

    });
  })
}



// CRAWL THE REAGENTS
const crawlReagents = () => {
  return new Promise(resolve => {
    let reagentObjects = {};

    const reagentsPath = `${BASE_PATH}/Assets/Resources/ScriptableObjects/Chemistry/Reagents/`;
    utils.walk(reagentsPath, (err, res) => {
      // only the .asset interest us
      reagentsFiles = res.filter(
        (arg) => arg.indexOf('.asset.meta') !== -1
      );


        // parse all the reagents and their names!
        reagentsFiles.forEach(file => {
          const reagentMeta = utils.fileToObject(file)[0];
          const reagentAsset = utils.fileToObject(file.split('.meta')[0])[0];
          const reagentGuid = reagentMeta.guid;
        
          reagentObjects[reagentGuid] = {
            name: reagentAsset.MonoBehaviour.displayName,
            description: reagentAsset.MonoBehaviour.description
          };
        });          
    resolve(reagentObjects)
    });
    


  });
}



const init = async () => {
  let recipes = await crawlRecipes();
  let reagents = await crawlReagents();
  

  let finalMeals = meals.map(mealId => {
    return ({
      outputPrefab: prefabs[recipes[mealId].outputId],
      ingredients: recipes[mealId]
        .ingredients
        .map(ingredient => `${ingredient.requiredAmount} ${ingredient.ingredientName}`)
        .join(',')
    })
  })

  let finalSimplemeals = simplemeal.map(mealId => {
    return ({
      outputPrefab: prefabs[recipes[mealId].outputId],
      ingredients: recipes[mealId]
        .ingredients
        .map(ingredient => `${ingredient.requiredAmount} ${ingredient.ingredientName}`)
        .join(', ')
    })
  })  

  let finalCuts = cuts.map(mealId => {
    return ({
      outputPrefab: prefabs[recipes[mealId].outputId],
      ingredients: recipes[mealId]
        .ingredients
        .map(ingredient => `${ingredient.requiredAmount} ${ingredient.ingredientName}`)
        .join(', ')
    })
  })

  let finalRolls = roll.map(mealId => {
    return ({
      outputPrefab: prefabs[recipes[mealId].outputId],
      ingredients: recipes[mealId]
        .ingredients
        .map(ingredient => `${ingredient.requiredAmount} ${ingredient.ingredientName}`)
        .join(', ')
    })
  })  


  let finalGrind = grind.map(mealId => {
    const reagentId = recipes[mealId].outputId;
    return ({
      outputPrefab: {
        name:reagents[reagentId].name,
        description:reagents[reagentId].description,
      },
      ingredients: recipes[mealId]
      .ingredients
      .map(ingredient => `${ingredient.requiredAmount} ${ingredient.ingredientName}`)
      .join(', ')
  })

  })


  fs.mkdir('foods', () => {});
  fs.mkdir('foods/images', () => {});


  let finalMd = '';
  finalMd += recipeListToMd('MicroWave', finalMeals) + `\r\n\r\n`;
  finalMd += recipeListToMd('Knife', finalCuts) + `\r\n\r\n`;
  finalMd += recipeListToMd('Rolling pin', finalRolls) + `\r\n\r\n`;
  finalMd += recipeListToMd('Combined', finalSimplemeals) + `\r\n\r\n`;

  finalMd += recipeListToMd('Grinder', finalGrind) + `\r\n\r\n`;

  if (fs.existsSync('foods/foods.txt')) fs.unlinkSync('foods/foods.txt');

  fs.writeFile('foods/foods.txt', finalMd, () => {});  

}

const recipeListToMd = (title, recipes) => {
  let finalText = ""
  finalText += `## ${title} \r\n`;
  finalText += "| Picture | Name | Ingredients | \r\n";
  recipes.forEach(meal => {
    const pngFile = meal?.outputPrefab?.spritePng;
    if (pngFile) {
      fs.copyFile(pngFile, `foods/images/${path.basename(pngFile)}`, (err) => {
        if (err) {
          console.log('err', err);
        }
      });
    }
    finalText += `| ![${meal.outputPrefab.name}](${path.basename(pngFile||"")}) |`;
    finalText += ` ${meal.outputPrefab.name} |`;
    finalText += ` ${meal.ingredients} | \r\n`;
  });
  return finalText;
}

init()

return;




// this is where we are reading the craftable recipes from.
// eg: we will find a 'bearburger' recipe

// this is where we're trying to find the textures
const TEXTURE_FOLDER = '/Assets/Textures/items/food';

/** list of caftables
 * contains a whole lotta
 * {
    name: "",
    ingredients: "",
    prefabId: "",
  };
 *
 */
let craftables = [];

// list of all scriptableObject files
let scriptableFiles = [];
// list of all prefab meta files
const prefabMetaFiles = [];
// list of all texture meta files
let textureFiles = [];

let foldersRead = 0;

const init2 = () => {
  if (foldersRead !== 3) {
    return;
  }
  // STEP 1. read the craftables from the list of all possible scriptables (some are not craftable!)
  craftables = readRecipes(scriptableFiles);

  // STEP 2. create a list of all the prefab id's and their corresponding description object
  prefabMetaFiles.forEach((fileName) => {
    const prefabData = utils.extractPrefabData(fileName);
    // point to the actual prefab file
    if (prefabData !== null) {
      prefabDictionary[prefabData.prefabId] = prefabData;
    }
  });

  // STEP 3. Create a dictionary for the textureId -> real png file
  textureFiles.forEach((fileName) => {
    const pngMetaData = utils.extractTextureData(fileName);
    spriteIdToImageDictionary[pngMetaData.textureId] = pngMetaData.pngFileName;
  });

  // OUTPUT THE CRAFTABLE RECIPES!
  let finalList = '| Picture | Name | Ingredients | Nutrition Level | Comments |\r\n';
  craftables.forEach((craftable) => {
    const prefabId = craftable.prefabId;
    if (prefabDictionary[prefabId] && prefabDictionary[prefabId].spriteId) {
      const textureId = prefabDictionary[prefabId].spriteId;
      const pngFilePath = spriteIdToImageDictionary[textureId];
      const nutritionLevel = prefabDictionary[prefabId].nutritionLevel || 'N/A';
      const initialDescription = prefabDictionary[prefabId].initialDescription || 'N/A'; ;

      delete spriteIdToImageDictionary[textureId];
      delete prefabDictionary[prefabId];
      // create the wiki .md table
      let wikiFilePath = '';
      if (pngFilePath) wikiFilePath = pngFilePath.split('\\').pop();
      finalList += `| ![${craftable.name}](${wikiFilePath}) |`;
      finalList += ` ${craftable.name} |`;
      finalList += ` ${craftable.ingredients} |`;
      finalList += ` ${nutritionLevel} |`; // nutritionLevel
      finalList += ` ${initialDescription} |\r\n`; // comments?
    }
  });

  // OUTPUT THE NON CRAFTABLES!
  let nonCraftables = '| Picture | Name | Nutrition Level | Comments |\r\n';
  Object.values(prefabDictionary).forEach((prefabData) => {
    const prefabId = prefabData.prefabId;
    const textureId = prefabDictionary[prefabId].spriteId;
    const pngFilePath = spriteIdToImageDictionary[textureId];
    const nutritionLevel = prefabDictionary[prefabId].nutritionLevel || 'N/A';
    const initialDescription = prefabDictionary[prefabId].initialDescription || 'N/A'; ;

    delete spriteIdToImageDictionary[textureId];
    delete prefabDictionary[prefabId];
    // create the wiki .md table
    let wikiFilePath = '';
    if (pngFilePath) wikiFilePath = pngFilePath.split('\\').pop();
    nonCraftables += `| ![${prefabData.name}](${wikiFilePath}) |`;
    nonCraftables += ` ${prefabData.name} |`;
    nonCraftables += ` ${nutritionLevel} |`;
    nonCraftables += ` ${initialDescription} |\r\n`;
  });

  if (fs.existsSync('orphaned.txt')) fs.unlinkSync('orphaned.txt');
  if (fs.existsSync('recipes.txt')) fs.unlinkSync('recipes.txt');
  if (fs.existsSync('noncraftables.txt')) fs.unlinkSync('noncraftables.txt');

  fs.writeFile(
    'orphaned.txt',
    Object.values(spriteIdToImageDictionary).join(', \r\n'),
    () => {}
  );
  fs.writeFile('recipes.txt', finalList, () => {});
  fs.writeFile('noncraftables.txt', nonCraftables, () => {});
};



utils.walk(texturePath, (err, res) => {
  textureFiles = res.filter((arg) => arg.indexOf('.png.meta') !== -1);
  foldersRead++;
  init();
});

const readRecipes = (filesList) => {
  const myRecipes = [];
  filesList.map((file) => {
    const newRecipe = utils.extractRecipeFromScriptableObjectFile(file);
    if (newRecipe) myRecipes.push(newRecipe);
  });
  return myRecipes;
};
