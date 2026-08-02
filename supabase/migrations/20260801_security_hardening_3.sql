-- =====================================================================
-- SECURITY HARDENING 3 — 2026-08-01 (audit #4 : policies d'écriture)
-- Non destructif : DROP/CREATE de policies (aucune donnée touchée).
-- =====================================================================

-- ---------- #4a : subscriptions = registre de FACTURATION → écriture service_role only ----------
-- La policy "ALL" laissait un bailleur UPDATE fee_amount_cents / payment_status de
-- SES lignes → mettre le forfait à 0 (ou payment_status='waived') AVANT le
-- prélèvement à la signature = placement gratuit. Contournement de facturation.
-- On repasse en LECTURE SEULE (le serveur écrit en service_role, qui bypasse la RLS).
DROP POLICY IF EXISTS "Landlords manage own subscriptions" ON public.subscriptions;
CREATE POLICY "Landlords view own subscriptions" ON public.subscriptions
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = subscriptions.property_id AND p.owner_id = auth.uid()
  ));

-- ---------- #4b : messages = exiger participation À L'ÉCRITURE ----------
-- Le with_check ne vérifiait que `auth.uid() = sender_id` → un user pouvait
-- INSERT un message dans une conversation dont il n'est pas membre (injection).
-- On exige désormais : expéditeur = soi ET participant de la conversation.
DROP POLICY IF EXISTS "Participants voient leurs messages" ON public.messages;
CREATE POLICY "messages_participants" ON public.messages
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
      AND (c.owner_id = auth.uid() OR c.tenant_id = auth.uid())
  ))
  WITH CHECK (
    auth.uid() = sender_id AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND (c.owner_id = auth.uid() OR c.tenant_id = auth.uid())
    )
  );
