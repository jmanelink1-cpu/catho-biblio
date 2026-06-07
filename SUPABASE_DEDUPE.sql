-- Supprime les livres en double (même titre), en gardant le plus ancien de chaque.
-- À coller dans Supabase → SQL Editor → Run.

delete from public.books
where id in (
  select id from (
    select id, row_number() over (partition by title order by created_at, id) as rn
    from public.books
  ) t
  where t.rn > 1
);

-- Vérification : combien de livres reste-t-il, et plus aucun doublon ?
select count(*) as total_livres from public.books;
select title, count(*) as n from public.books group by title having count(*) > 1;
