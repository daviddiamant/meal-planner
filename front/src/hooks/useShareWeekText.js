import { useEffect, useState } from "react";

const getWeek = (currentDate) => {
  var firstJanuary = new Date(currentDate.getFullYear(), 0, 1);
  return Math.ceil(
    ((currentDate - firstJanuary) / 86400000 + firstJanuary.getDay() + 1) / 7
  );
};

function useShareWeekText(week) {
  const [shareTitle, setTitle] = useState(null);
  const [shareText, setText] = useState(null);

  const onMount = () => {
    if (!week.length || !(navigator && navigator.share)) {
      setTitle("");
      setText("");
      return;
    }
    // Create the share title
    const title = `Dav & Lov matsedel - V.${getWeek(new Date())}`;

    // Create the share text
    let text = week.reduce((textSoFar, recipe) => {
      if (
        typeof recipe.title === "undefined" ||
        typeof recipe.url === "undefined"
      ) {
        return textSoFar;
      }

      return `${textSoFar}${recipe.title} - ${recipe.url.replace(
        /\/$/,
        ""
      )}\n\n`;
    }, "");

    // Add title
    text = `${title} \n\n${text.trim()}`;

    setTitle(title);
    setText(text);
  };
  useEffect(onMount, [week]);

  return { title: shareTitle, text: shareText };
}

export default useShareWeekText;
