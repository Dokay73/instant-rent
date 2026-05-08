-- Permet au propriétaire d'un bien de voir les candidatures sur ce bien
-- (en plus du locataire qui voit ses propres candidatures)

drop policy if exists "Owners can view applications on their properties" on applications;
create policy "Owners can view applications on their properties"
on applications for select
to authenticated
using (
  exists (
    select 1 from properties
    where properties.id = applications.property_id
    and properties.owner_id = auth.uid()
  )
);

-- Permet au proprio d'updater le statut d'une candidature sur ses biens
drop policy if exists "Owners can update applications on their properties" on applications;
create policy "Owners can update applications on their properties"
on applications for update
to authenticated
using (
  exists (
    select 1 from properties
    where properties.id = applications.property_id
    and properties.owner_id = auth.uid()
  )
);

-- Permet au proprio de voir le profil du candidat
drop policy if exists "Owners can view applicant profiles" on profiles;
create policy "Owners can view applicant profiles"
on profiles for select
to authenticated
using (
  id = auth.uid()
  OR exists (
    select 1 from applications
    join properties on properties.id = applications.property_id
    where applications.tenant_id = profiles.id
    and properties.owner_id = auth.uid()
  )
);
