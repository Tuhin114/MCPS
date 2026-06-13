"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import {
  getNotifications,
  createNotification,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/services/notifications.service";
import type {
  CreateNotificationPayload,
  CreateNotificationResponse,
  GetNotificationsResponse,
  MarkAllReadResponse,
  MarkReadResponse,
} from "@/types/notification.ts";

//  Query key factory ─

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
};

//  useNotifications — fetch + subscribe to realtime inserts

export function useNotifications() {
  const queryClient = useQueryClient();

  const query = useQuery<GetNotificationsResponse, Error>({
    queryKey: notificationKeys.list(),
    queryFn: getNotifications,
    staleTime: 30_000,
  });

  // Supabase Realtime: invalidate whenever a new notification arrives for this user
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

//  useSendNotification — POST a single notification row

export function useSendNotification() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateNotificationResponse,
    Error,
    CreateNotificationPayload
  >({
    mutationFn: createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    },
  });
}

//  useMarkNotificationRead — PATCH single notification ─

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation<MarkReadResponse, Error, string>({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    },
  });
}

//  useMarkAllNotificationsRead ─

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation<MarkAllReadResponse, Error, void>({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    },
  });
}
