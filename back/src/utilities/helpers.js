/* eslint-disable no-useless-escape */
import fp from "fastify-plugin";
import { URL } from "url";

// Add all helpers that is needed
const helpers = fp((fastify, _, done) => {
  fastify.decorate("validURL", (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  });

  fastify.decorate("slugify", async (stringToBeSlugged, collection = false) => {
    const slugify = (toSlugify) => {
      // https://medium.com/@mhagemann/the-ultimate-way-to-slugify-a-url-string-in-javascript-b8e4a0d849e1
      const a =
        "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
      const b =
        "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------";
      const p = new RegExp(a.split("").join("|"), "g");

      return toSlugify
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, "-and-") // Replace & with 'and'
        .replace(/[^\w\-]+/g, "") // Remove all non-word characters
        .replace(/\-\-+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, ""); // Trim - from end of text
    };

    let slugified = slugify(stringToBeSlugged);
    if (collection) {
      // We have a collection to check against
      let inDB = await collection.find({ slug: slugified }).toArray();
      if (inDB.length > 0) {
        // This slug is taken!
        let tries = 1;
        let newSlugified = null;
        do {
          // Count and retry until we have a free one
          newSlugified = `${slugified}-${tries}`;
          inDB = await collection.find({ slug: newSlugified }).toArray();
          tries++;
        } while (inDB.length > 0);
        // Ok we have a unique one!
        slugified = newSlugified;
      }
    }

    return slugified;
  });

  fastify.decorate("firstNotNull", (priorityArray) => {
    let foundValue = null;
    for (let i = 0; i < priorityArray.length; i++) {
      const priorityItem = priorityArray[i];
      if (!priorityItem.key && priorityItem.value) {
        // We do not have a key, so the item itself is enough
        foundValue = priorityItem.value;
        break;
      } else if (
        priorityItem.key &&
        priorityItem.value &&
        priorityItem.value[priorityItem.key]
      ) {
        // We have a key, so the item is required and that item needs to have that key
        foundValue = priorityItem.value[priorityItem.key];
        break;
      }
    }

    return foundValue;
  });

  done();
});

export default helpers;
