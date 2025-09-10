import type { Order } from "@/schema/message"

const MARK_RE = /[四五六七八九]码组[三六]/
const UNFIXED_2_RE = /双飞/

export function ordersFormat(orders: Order[]): string {
  return orders.map((o) => orderFormat(o)).join("\n")
}

function method(method: string) {
  if (method === "单" || method === "组三" || method === "组六") {
    return ""
  }
  return `${method} `
}

function bets(method: string, times: number): string {
  if (MARK_RE.test(method) || UNFIXED_2_RE.test(method)) {
    return ""
  }
  return ` ${times}${method === "组三" || method === "组六" ? "组" : `单`}`
}

export function orderFormat(order: Order): string {
  return `${order.lotto} ${method(order.method)} ${order.numbers?.join(" ")}${bets(order.method, order.times)} ${order.price}元`
}
