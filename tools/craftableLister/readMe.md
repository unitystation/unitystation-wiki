## Prerequisites

- You must have [node.js](https://nodejs.org/en/) installed.
- You must have the [UnityStation](https://github.com/unitystation/unitystation) project cloned.

## Food Lister

It will output:

- a "recipes.txt" file containing a markdown table with all the food that can be crafted
- a "noncraftables.txt" file containinng a markdown table with all the food that is not craftable\*
- an "orphaned.txt" file containing a list of all the textures that have no prefab pointing to them

\*by craftable i mean it has no ingredients, but can still be found in the game (vendomat items, world items, items that can be spawned only by admins)

### How do i get it working?

1. edit the foodRecipesLister.js and change this variable to point to the "UnityProject"! folder on your computer.
   > var basePath = "C:/git/unitystation/UnityProject";
2. Open a bash console in the craftableLister folder (windows explorer, right click, Git Bash Here )
3. Run this command "node foodRecipeLister.js"

## Drinks Lister

It will output:

- a "drinks.txt" file containing all the drinks that can be crafted
- a "simpleReagents.txt" file containinng all the simple reagents (juice, simple alcohol from machines)

### How do i get it working?

1. edit the drinksRecipeLister.js and change this variable to point to the "UnityProject"! folder on your computer.
   > var basePath = "C:/git/unitystation/UnityProject";
2. Open a bash console in the craftableLister folder (windows explorer, right click, Git Bash Here )
3. Run this command "node drinksRecipeLister.js"
