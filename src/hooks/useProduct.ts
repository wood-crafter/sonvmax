import useSWR from "swr"
import { API_ROOT } from "../constant"
import { PagedResponse, Product } from "../type"
import { requestOptions } from "./utils";

export function useProducts(page: number, size = 20, active = false, categoryId:string | undefined = undefined, searchName: string) {
  let url = ''
  if (categoryId) {
    url = `/product/get-products-by-category/${categoryId}?page=${page}&size=${size}` + (active ? `&active=${active}` : '')
  } else {
    url = `/product/get-product?page=${page}&size=${size}` + (active ? `&active=${active}` : '')
  }
  if (searchName) {
    url = `/product/get-product-by-name/?searchName=${searchName}&page=${page}&size=${size}` + (active ? `&active=${active}` : '')
  }
  const { data, isLoading, error, mutate } = useSWR(url, fetchProducts)

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