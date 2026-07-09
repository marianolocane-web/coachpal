import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth';
import * as habitsApi from './habitsApi';
import * as logsApi from './logsApi';
import * as unitsApi from './unitsApi';
import * as moodsApi from './moodsApi';
import * as diarioApi from './diarioApi';
import { seedDemoData } from './seedDemoData';
import type { DiaryMessageContentType, DiaryMessageRole, HabitInput } from './types';

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

// ---- Diario AI ----

export function useDiaryEntries(status: ('active' | 'archived')[] = ['active']) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['diaryEntries', user?.id, status],
    queryFn: () => diarioApi.listEntries(user!.id, status),
    enabled: !!user,
  });
}

export function useDiaryEntry(id: string | undefined) {
  return useQuery({
    queryKey: ['diaryEntry', id],
    queryFn: () => diarioApi.getEntry(id!),
    enabled: !!id,
  });
}

export function useDiaryMessages(entryId: string | undefined) {
  return useQuery({
    queryKey: ['diaryMessages', entryId],
    queryFn: () => diarioApi.listMessages(entryId!),
    enabled: !!entryId,
  });
}

export function useDiaryComments(entryId: string | undefined) {
  return useQuery({
    queryKey: ['diaryComments', entryId],
    queryFn: () => diarioApi.listComments(entryId!),
    enabled: !!entryId,
  });
}

export function useStartDiaryEntry() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => diarioApi.startEntry(user!.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diaryEntries'] }),
  });
}

export function useAddDiaryMessage(entryId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { role: DiaryMessageRole; contentType: DiaryMessageContentType; textContent?: string | null; audioStoragePath?: string | null }) =>
      diarioApi.addMessage({ entryId, ...input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diaryMessages', entryId] }),
  });
}

export function useArchiveDiaryEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => diarioApi.archiveEntry(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['diaryEntries'] });
      qc.invalidateQueries({ queryKey: ['diaryEntry', id] });
    },
  });
}

export function useAddDiaryComment(entryId: string) {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (comment: string) => diarioApi.addComment(entryId, user!.id, comment),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diaryComments', entryId] }),
  });
}

export function useDiarioPersonaPrompt() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['diarioPersonaPrompt', user?.id],
    queryFn: () => diarioApi.getDiarioPersonaPrompt(user!.id),
    enabled: !!user,
  });
}

export function useSetDiarioPersonaPrompt() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (prompt: string | null) => diarioApi.setDiarioPersonaPrompt(user!.id, prompt),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diarioPersonaPrompt'] }),
  });
}
