import useSWR from "swr"
import { API_ROOT } from "../constant"
import { ParentColor } from "../type"
import { requestOptions } from "./useProduct"

export async function fetchColors(url: string) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<{ colors: ParentColor[] }>
}

const groupColorsByChildType = (colors: ParentColor[] | undefined): ParentColor[][] => {
  const groupedColors: { [key: string]: ParentColor[] } = {};
  if (!colors) return [];

  // Initialize each group with all parent colors
  const colorTypes = new Set<string>();
  colors.forEach(parentColor => {
    parentColor.childs.forEach(child => {
      colorTypes.add(child.colorType);
    });
  });

  colorTypes.forEach(type => {
    groupedColors[type] = colors.map(parentColor => ({
      name: parentColor.name,
      rgb: parentColor.rgb,
      childs: [],
      type: type,
    }));
  });

  // Add child colors to the appropriate parent in each group
  colors.forEach((parentColor) => {
    parentColor.childs.forEach((child) => {
      const parentColorGroup = groupedColors[child.colorType];
      const existingParent = parentColorGroup.find(pc => pc.name === parentColor.name);
      if (existingParent) {
        existingParent.childs.push(child);
      }
    });
  });

  // Convert the grouped colors object to an array of arrays
  return Object.values(groupedColors);
}

export function useColors() {
  const { data, isLoading, error, mutate } = useSWR(`/color/get-color`, fetchColors)

  return {
    data: groupColorsByChildType(data?.colors),
    isLoading,
    error,
    mutate,
  }
}