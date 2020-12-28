var fs = require("fs");
var utils = require("./listerUtils");



let craftables = [];
// pairs a prefabId to an object {nutritionLevel, initialDescription, spriteId, prefabId}
let prefabDictionary = {};
// pairs PREFAB_ID with SPRITE_ID
let spriteIdToImageDictionary = {};

// list of all scriptableObject files
let reactionFiles = [];
let reactionObjects = [];


// list of all scriptableObject files
let reagentsFiles = [];
let reagentObjects = []

// list of all scriptableObject files
let textureFiles = [];


let morphableGlassObject;
let glassKeys = {}


// B52: 
// .meta
// guid: 825e3281f4989673cb81d18311bd17d6

// .asset
// displayName: B-52
// description: Coffee, Irish Cream, and cognac. You will get bombed.


// drinkin glass morphable -> mKeys 825e3281f4989673cb81d18311bd17d6



// 1) get the reagents list

// 2) get the drinkingGlassMOrphable descriptions ?


// - CustomName: B-52
// CustomDescription: Kahlua, Irish Cream, and cognac. You will get bombed.
// MainSprite: {fileID: 21300000, guid: 8754ae17615a0e2409501af8b478d6b7, type: 3}


// this is the texture

let foldersRead = 0;


// basepath to the unityProject folder
var basePath = "C:/git/unitystation/UnityProject";

// 1. load the morphableglass file
morphableGlassObject = utils.fileToObject(basePath + "/Assets/Resources/ScriptableObjects/Chemistry/Visual/DrinkingGlassMorphable.asset");


// step 2. read the reaction files
const reactionsPath = basePath + "/Assets/Resources/ScriptableObjects/Chemistry/Reactions";
utils.walk(reactionsPath, (err, res) => {
    // only the .asset interest us
    reactionFiles = res.filter(
      (arg) => arg.indexOf(".asset") !== -1 && arg.indexOf(".meta") === -1
    );
    foldersRead++;
    init();
});

// step 3. load all the DRINKING reagents
const reagentsPath = basePath + '/Assets/Resources/ScriptableObjects/Chemistry/Reagents/'
utils.walk(reagentsPath, (err, res) => {
    // only the .asset interest us
    reagentsFiles = res.filter(
      (arg) => arg.indexOf(".asset.meta") !== -1 && (arg.indexOf('Reagents\\Alcohol') !== -1 || arg.indexOf('Reagents\\Drink') !== -1)
    );
    foldersRead++;

    init();
});



// step 3. load all the pictures
const texturePath = basePath + '/Assets/Textures/items/drinks'
utils.walk(texturePath, (err, res) => {
    // only the .asset interest us
    textureFiles = res.filter(
      (arg) => arg.indexOf("png.meta") !== -1
    );
    foldersRead++;

    init();
});


const init = () =>{
    if (foldersRead !== 3) {
        return;
    }

    // 1. parse the glassKeys
    morphableGlassObject.MonoBehaviour.spritesData.m_keys.forEach((el, index) => {
        glassKeys[el.guid] = morphableGlassObject.MonoBehaviour.spritesData.m_values[index]
    })

    // parse all the reagents and their names!
    reagentsFiles.map(file => {
        let reagentMeta  = utils.fileToObject(file);
        let reagentAsset = utils.fileToObject(file.split('.meta')[0]);
        let reagentGuid = reagentMeta.guid;

        reagentObjects[reagentGuid] = {
            name: reagentAsset.MonoBehaviour.displayName,
            description: reagentAsset.MonoBehaviour.description
        }
    })


    // parse all the reactions and ingredient names
    let failedReactions = [];
    reactionFiles.map(file => {
        let reaction  = utils.fileToObject(file);
        if (reaction.MonoBehaviour.results.m_keys.length !== 0) {
            let reactionGuid = reaction.MonoBehaviour.results.m_keys[0].guid
            try {
                reactionObjects[reactionGuid] = {
                    name: reagentObjects[reactionGuid].name,
                    description: glassKeys[reactionGuid].CustomDescription,
                    spriteId: glassKeys[reactionGuid].MainSprite.guid,
                    ingredients: reaction.MonoBehaviour.ingredients.m_keys.map(el => reagentObjects[el.guid].name),
                }
                const amounts = reaction.rawText
                    .split('ingredients:')[1]
                    .split('m_values:')[1]
                    .split('\r\n')[0]
                    .trim()
                    .replace(r = new RegExp(/0/gi), '')
                    .split('');
                reactionObjects[reactionGuid].amounts = amounts;
            }
            catch {
                failedReactions.push( reaction.MonoBehaviour.m_Name);
            }
        }
    }) 

  // STEP 3. Create a dictionary for the textureId -> real png file
  textureFiles.forEach((fileName) => {
    const pngMetaData = utils.extractTextureData(fileName);
    spriteIdToImageDictionary[pngMetaData.textureId] = pngMetaData.pngFileName;
  });

    Object.values(reactionObjects).forEach(reaction => {
        reaction.spriteFile = spriteIdToImageDictionary[reaction.spriteId]
    });

  // OUTPUT THE CRAFTABLE RECIPES!
  let allDrinks = "| Picture | Name | Recipe | Description |\r\n";
  Object.values(reactionObjects).forEach((reaction) => {
      const pngFilePath = reaction.spriteFile.split('\\').pop();
      let ingredients = ""
      for (let i=0; i<reaction.ingredients.length; i++) {
        ingredients += `${reaction.amounts[i]} ${reaction.ingredients[i]} , `;
      }
      ingredients = ingredients.split(',');
      ingredients.pop()
      ingredients = ingredients.join(',').trim(); // remove last comma;
      
      // create the wiki .md table


      allDrinks += `| ![${reaction.name}](${pngFilePath}) |`;
      allDrinks += ` ${reaction.name} |`;
      allDrinks += ` ${ingredients} |`;
      allDrinks += ` ${reaction.description} |\r\n`;
  });    
  if (fs.existsSync("drinks.txt")) fs.unlinkSync("drinks.txt");
  fs.writeFile("drinks.txt", allDrinks, ()=>{});

  Object.keys(reactionObjects).map(key => {
      for (let rkey in reagentObjects) {
          if (reagentObjects[rkey].name === reactionObjects[key].name) {
            delete reagentObjects[rkey];
            console.log('deleting ', reactionObjects[key].name)
          }
          delete reagentObjects[key];
      }
  });
  console.log(reagentObjects);
  

}