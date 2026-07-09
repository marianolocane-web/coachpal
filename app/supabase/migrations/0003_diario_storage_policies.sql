-- Storage policies for the `diario-audio` bucket. Buckets ship with RLS
-- enabled on `storage.objects` and no policies at all, so uploads fail with
-- "new row violates row-level security policy" until these exist.
--
-- Objects are stored at `{user_id}/{entry_id}/{message_id}.{ext}` — scope
-- access to whoever owns that first path segment.

create policy "diario_audio_owner_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'diario-audio'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "diario_audio_owner_select" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'diario-audio'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
