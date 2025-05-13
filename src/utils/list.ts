import { Category } from "./type";

export const categories: Category[] = [
  {
    id: "medical",
    name: "medical",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
  },
  {
    id: "family",
    name: "family",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
  },
  {
    id: "urgent bills",
    name: "urgent bills",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
  },
  {
    id: "emergency",
    name: "emergency",
    bgColor: "bg-orange-100",
    textColor: "text-orange-800",
  },
  {
    id: "crisis",
    name: "crisis",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
  },
  {
    id: "transportation",
    name: "transportation",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
  },
  {
    id: "animal",
    name: "animal",
    bgColor: "bg-pink-100",
    textColor: "text-pink-800",
  },
  {
    id: "charity",
    name: "charity",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-800",
  },
  {
    id: "food",
    name: "food",
    bgColor: "bg-teal-100",
    textColor: "text-teal-800",
  },
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find((category) => category.id === id);
};

export const getCategoryByName = (name: string): Category | undefined => {
  return categories.find((category) => category.name === name);
};
