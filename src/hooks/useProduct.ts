import useSWR from "swr"
import { API_ROOT } from "../constant"
import { Category, PagedResponse, Product, RequestOptions } from "../type"

export const requestOptions: RequestOptions = {
  method: "GET",
  headers: {
    "Access-Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbklkIjoidGFrYWhpcm8ubWl5YW1vdG9Abm9yaXRzdS5jb20iLCJyb2xlIjowLCJsb2dpbkluZm9JZCI6MjgsImN1c3RvbWVySWQiOjY4LCJzdG9yZUNvZGUiOiJNaXlhbW90byIsImlhdCI6MTcxODMyNTI2MiwiZXhwIjoxNzE4NDExNjYyfQ.Qb8cpuRO6ZyPaHXIznrJq1HqmmkLLdhG9LHC0C9otcs"
  }
}

export function useCategories(page: number, size = 20) {
  const { data, isLoading, error, mutate } = useSWR(`/category/get-category?page=${page}&size=${size}`, fetchCategories)

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

export async function fetchCategories(url: string) {
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

export async function fetchProducts(url: string) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<PagedResponse<Product>>
}

export async function updateProduct(url: string, requestOptions: RequestOptions) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<Product>
}

export async function deleteProduct(url: string, requestOptions: RequestOptions) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<Product>
}

export async function addProduct(url: string, requestOptions: RequestOptions) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<Product>
}