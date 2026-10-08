import { useEffect, useState } from "react";
import {
  getAllOrders, getUserNames, updateOrderStatus,
  type AdminOrder, type OrderStatus,
} from "../services/admin-service";

/** Loads orders + user names and offers a status change handler. */
export default function useAdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([getAllOrders(), getUserNames()]).then(([o, n]) => {
      setOrders(o);
      setNames(n);
    });
  }, []);

  const changeStatus = async (id: number, status: OrderStatus) => {
    await updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return { orders, names, changeStatus };
}