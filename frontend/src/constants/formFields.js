export const FORM_FIELD_KEYS_BY_TYPE = {
  purchase: ["itemName", "quantity", "price", "reason"],
  vacation: ["startDate", "endDate", "reason"]
};

export const FORM_FIELD_LABELS = {
  itemName: "Наименование товара",
  quantity: "Количество",
  price: "Цена",
  reason: "Причина / обоснование",
  startDate: "Дата начала",
  endDate: "Дата окончания"
};

export function labelFormField(key) {
  return FORM_FIELD_LABELS[key] || key;
}
