import useSWR from "swr"
import { API_ROOT } from "../constant"
import { Category, PagedResponse, Product, RequestOptions } from "../type"

export const requestOptions: RequestOptions = {
  method: "GET",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
}

export function useCategories(page: number, size = 20, accessToken: string) {
  const { data, isLoading, error, mutate } = useSWR(`/category/get-category?page=${page}&size=${size}`, (url: string) => fetchCategories(url, {...requestOptions, headers: {...requestOptions.headers, "Authorization": `Bearer ${accessToken}`}}))

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

export async function fetchCategories(url: string, requestOptions: RequestOptions) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<PagedResponse<Category>>
}

export function useProducts(page: number, size = 20) {
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