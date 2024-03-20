import { styled } from "@mui/material/styles";
import { Paper } from "@mui/material";

const toPascalCase = (str: string) => {
  if (str) {
    str = str.replace(/_/g, " ");
    str = str.toLowerCase();
    if (/^[a-z\d]+$/i.test(str)) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return str
      .replace(
        /([a-z\d])([a-z\d]*)/gi,
        (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase()
      )
      .replace(/[^a-z\d]/gi, " ");
  }
  return str;
};

const groupBy = (array: Array<any>, key: string) => {
  return array.reduce((result: any, currentValue: any) => {
    if (currentValue[key]) {
      (result[toPascalCase(currentValue[key])] =
        result[toPascalCase(currentValue[key])] || []).push(currentValue);
    }
    return result;
  }, {});
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const formatAmount = (amount: number, currency:string): string => {
  return amount.toLocaleString("en-US", { style: "currency", currency });
};

const renameObjKeys = (obj, newKeys) => {
  const keyValues = Object.keys(obj).map((key) => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
}

export { groupBy, toPascalCase, Item, formatAmount, renameObjKeys };
