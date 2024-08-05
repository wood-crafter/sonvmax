import useSWR from "swr"
import { API_ROOT } from "../constant"
import { Category, PagedResponse, Product, RequestOptions } from "../type"
import { FetchWithAuthOptions, useAuthenticatedFetch } from "./useAuthenticatedFetch";

export const requestOptions: RequestOptions = {
  method: "GET",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
}

export function useCategories(page: number, size = 999) {
  const fetcher = useAuthenticatedFetch();
  const { data, isLoading, error, mutate } = useSWR({ url: `/category/get-category?page=${page}&size=${size}`, fetcher }, fetchCategories)

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

export async function fetchCategories({url, fetcher} : FetchWithAuthOptions) {
  const res = await fetcher(`${API_ROOT}${url}`, {...requestOptions})

  return res.json() as Promise<PagedResponse<Category>>
}

export function useProducts(categoryId: string | undefined, page: number, size = 20) {
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