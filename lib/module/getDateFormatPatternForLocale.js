export function getDateFormatPatternForLocale(locale) {
  const parts = new Intl.DateTimeFormat(locale).formatToParts();
  return parts.map(part => {
    let char;

    switch (part.type) {
      case "era":
        char = "G";
        break;

      case "year":
        char = "y";
        break;

      case "month":
        char = "M";
        break;

      case "day":
        char = "d";
        break;

      default:
        char = part.value;
        break;
    }

    return Array.from({
      length: part.value.length
    }, () => char).join("");
  }).join("");
}
//# sourceMappingURL=getDateFormatPatternForLocale.js.map