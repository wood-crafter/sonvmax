import useSWR from "swr"
import { API_ROOT } from "../constant"
import { PagedResponse, Product } from "../type"
import { requestOptions } from "./utils";

export function useProducts(page: number, size = 20, categoryId:string | undefined = undefined) {
  if (categoryId) {
    const { data, isLoading, error, mutate } = useSWR(`/product/get-products-by-category/${categoryId}?page=${page}&size=${size}`, fetchProducts)

    return {
      data,
      isLoading,
      error,
      mutate,
    }
  }
  const { data, isLoading, error, mutate } = useSWR(`/product/get-product?page=${page}&size=${size}`, fetchProducts)

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

export function useProductsById(id: string) {
  const { data, isLoading, error, mutate } = useSWR(`/product/get-product/${id}`, fetchProductsById)

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

export async function fetchProducts(url: string) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<PagedResponse<Product>>
}

export async function fetchProductsById(url: string) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<Product>
}