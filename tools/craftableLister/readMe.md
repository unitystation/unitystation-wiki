## What this tool does

This is basically a file crawler. It will output:

- a "recipes.txt" file containing a markdown table with all the food that can be crafted
- a "noncraftables.txt" file containinng a markdown table with all the food that is not craftable\*
- an "orphaned.txt" file containing a list of all the textures that have no prefab pointing to them

\*by craftable i mean it has no ingredients, but can still be found in the game (vendomat items, world items, items that can be spawned only by admins)

## How do i get it working?

### Prerequisites

- You must have [node.js](https://nodejs.org/en/) installed.
- You must have the [UnityStation](https://github.com/unitystation/unitystation) project cloned.

### Running

1. edit the foodRecipesListr and change this variable to point to the "UnityProject"! folder on your computer.
   > var basePath = "C:/git/unitystation/UnityProject";
2. Open a bash console in this folder, and run "node file.js"
3. Run this command "node foodRecipeLister.js"

## The how (this is the ugly part)

1. crawl the scriptableObjects folder. Search all files and extract the output guid (this points to a prefab)
2. crawl the prefab folder. map each prefab guid to an object with the following props: name, spriteId, nutritionLevel, initialDescription
3. crawl the textures folder. map each guid to it's .png file
4. put them all together.
