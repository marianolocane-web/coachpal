import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth';
import * as habitsApi from './habitsApi';
import * as logsApi from './logsApi';
import * as unitsApi from './unitsApi';
import * as moodsApi from './moodsApi';
import { seedDemoData } from './seedDemoData';
import type { HabitInput } from './types';

export function useHabits() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['habits', user?.id],
    queryFn: () => habitsApi.listHabits(user!.id),
    enabled: !!user,
  });
}

export function useHabit(id: string | undefined) {
  return useQuery({
    queryKey: ['habit', id],
    queryFn: () => habitsApi.getHabit(id!),
    enabled: !!id,
  });
}

export function useLogsRange(fromIso: string, toIso: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['logsRange', user?.id, fromIso, toIso],
    queryFn: () => logsApi.getLogsForUserRange(user!.id, fromIso, toIso),
    enabled: !!user,
  });
}

export function useHabitLogs(habitId: string | undefined, fromIso?: string, toIso?: string) {
  return useQuery({
    queryKey: ['habitLogs', habitId, fromIso, toIso],
    queryFn: () => logsApi.getLogsForHabit(habitId!, fromIso, toIso),
    enabled: !!habitId,
  });
}

export function useMoodsRange(fromIso: string, toIso: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['moodsRange', user?.id, fromIso, toIso],
    queryFn: () => moodsApi.getMoodsForUserRange(user!.id, fromIso, toIso),
    enabled: !!user,
  });
}

export function useUnits() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['units', user?.id],
    queryFn: () => unitsApi.listOrSeedUnits(user!.id),
    enabled: !!user,
  });
}

export function useUpsertLog() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { habitId: string; logDate: string; done?: boolean; valueNumber?: number | null; valueText?: string | null; comment?: string | null }) =>
      logsApi.upsertLog({ ...input, userId: user!.id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['logsRange'] });
      qc.invalidateQueries({ queryKey: ['habitLogs'] });
    },
  });
}

export function useUpsertMood() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ logDate, emoji, moodTags }: { logDate: string; emoji: string | null; moodTags?: string[] }) =>
      moodsApi.upsertMood(user!.id, logDate, emoji, moodTags),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['moodsRange'] }),
  });
}

export function useCreateHabit() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: HabitInput) => habitsApi.createHabit(input, user!.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['habits'] }),
  });
}

export function useUpdateHabit() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: HabitInput }) => habitsApi.updateHabit(id, input, user!.id),
    onSuccess: (habit) => {
      qc.invalidateQueries({ queryKey: ['habits'] });
      qc.invalidateQueries({ queryKey: ['habit', habit.id] });
    },
  });
}

export function useDeleteHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => habitsApi.softDeleteHabit(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['habits'] }),
  });
}

export function useCreateUnit() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (label: string) => unitsApi.createUnit(user!.id, label),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['units'] }),
  });
}

export function useUpdateUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, label }: { id: string; label: string }) => unitsApi.updateUnit(id, label),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['units'] }),
  });
}

export function useDeleteUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unitsApi.deleteUnit(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['units'] }),
  });
}

export function useSeedDemoData() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => seedDemoData(user!.id),
    onSuccess: () => qc.invalidateQueries(),
  });
}
