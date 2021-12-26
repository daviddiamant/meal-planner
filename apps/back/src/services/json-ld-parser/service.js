import sanitizeHtml from "sanitize-html";

import { recipesDAL } from "../../common/DAL";

const regexForUnits =
  /(^(ev|eventuellt|kanske|valfritt|\s)*(\d|en|ett|två|tre|fyra|fem|sex|sju|åtta|nio|tio|några|nått|någon|något|[\u00BC-\u00BE\u2150-\u215E]|ca|cirka|ungefär|ung|typ|ish|nästan)+(\d|\/|\.|,|\s|dussin|tjog|rågat|stor|liten|medelstor|mellan|[\u00BC-\u00BE\u2150-\u215E]|-)*)(knyte|knyten|ark|skiva|skivor|stjälk|stjälkar|kvist|kvistar|sats|satsar|halv|hel|klyfta|klyftor|kruka|krukor|flaska|flaskor|ask|askar|paket|förpackning|förpackningar|förp|pack|påse|påsar|portion|portioner|port|burk|burkar|kopp|koppar|mugg|muggar|glas|sked|skedar|nypa|nypor|näve|nävar|handfull|skopa|skopor|trave|travar|st|stycken|kg|hg|g|gr|kilo|kilon|kilogram|hekto|hekton|hektogram|gram|l|liter|dl|deciliter|ml|milliliter|cl|centiliter|krm|kryddmått|krm|tsk|tesked|teskedar|dsk|dessertsked|dessertskedar|msk|matsked|matskedar|kkp|kaffekopp|kaffekoppar|cm|centimeter)?\s+/gm;

const parseIngredients = (ingredients) => {
  if (!ingredients) {
    return {};
  }

  return ingredients.map((ingredient) => {
    let unit = ingredient.match(regexForUnits);
    unit = unit ? unit[0].trim() : unit;

    return unit
      ? { unit, ingredient: ingredient.substring(unit.length).trim() }
      : { unit: "", ingredient };
  });
};

const parseInstructions = (instructions, baseTitle) => {
  let newInstructions = [];
  if (instructions) {
    /**
     * Should be array(object(array()))
     * sections(sectionName, instruction(text))
     * */
    if (
      (typeof instructions[0] === "object" ||
        typeof instructions[0] === "function") &&
      instructions[0] !== null
    ) {
      // Its a list of objects
      let baseInstructions = [];
      for (const instruction of instructions) {
        if (instruction["@type"] === "HowToStep") {
          baseInstructions = [...baseInstructions, instruction.text];
        } else if (instruction["@type"] === "HowToSection") {
          const section = parseInstructions(
            instruction.itemListElement,
            baseTitle
          );

          if (section[0]) {
            section[0].name = instruction.name || baseTitle || "Instruktioner";

            newInstructions = [...newInstructions, section[0]];
          }
        }
      }

      if (baseInstructions.length) {
        const recRes = parseInstructions(baseInstructions, baseTitle);

        newInstructions = [
          ...newInstructions,
          {
            name: baseTitle || "Instruktioner", // Since this is just a list of instructions, we do not have one
            instructions: recRes[0].instructions || null,
          },
        ];
      }
    } else if (Array.isArray(instructions)) {
      // Its a list of strings
      newInstructions = [
        {
          name: baseTitle || "Instruktioner", // Since this is just a list of strings, we do not have one
          instructions: instructions.map((x) => {
            const recRes = parseInstructions(x, baseTitle);

            return recRes[0].instructions[0] || null;
          }),
        },
      ];
    } else {
      // It is just a string
      newInstructions = [
        {
          name: baseTitle || "Instruktioner", // Since this is a string, we do not have one
          instructions: [
            sanitizeHtml(instructions, {
              allowedTags: [],
              allowedAttributes: {},
            }).trim(),
          ],
        },
      ];
    }
  }
  instructions = newInstructions;
  instructions = instructions || {};

  return instructions;
};

export const parseJsonLD = async (json) => {
  let recipeId, jsonLD;
  try {
    ({ recipeId, jsonLD } = JSON.parse(json));

    if (!recipeId) {
      throw new Error("no id");
    }
  } catch (error) {
    return;
  }

  let ingredients = jsonLD?.recipeIngredient;
  let instructions = jsonLD?.recipeInstructions;

  ingredients = parseIngredients(ingredients);
  instructions = parseInstructions(instructions, jsonLD?.name);

  const { updateRecipe } = recipesDAL();
  await updateRecipe(recipeId, { ingredients, instructions });
};
