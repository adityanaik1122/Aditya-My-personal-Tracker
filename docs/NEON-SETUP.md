# Neon storage on Vercel

The app uses Postgres whenever `DATABASE_URL` is configured. Local development
without that variable retains the JSON store. Vercel requires the database and
never falls back to filesystem writes. Existing cookie authentication is retained.

1. Save the pooled Neon URL as `DATABASE_URL` in `.env.local` and Vercel Production.
   Do not commit it or prefix it with `NEXT_PUBLIC_`.
2. Test schema migration on a separate Neon branch first, using that branch's URL.
3. Run `npm run db:migrate` against the intended database. The script uses
   `DATABASE_URL_UNPOOLED` if supplied, otherwise derives Neon's direct endpoint.
4. Before starting the app against the production database, run `npm run db:import`
   to copy `.data/learning-hub.json`. An existing database row is never overwritten.
5. Deploy the tested code to Vercel. Check `/today`, change a task, reload, and
   verify the same data from another signed-in device.

`tracker_state` contains the single owner's complete state, including lesson
progress, task history, preferences, and push subscriptions. Updates use a Postgres
transaction and row lock so parallel requests cannot overwrite each other.
The schema is managed in `db/001-tracker-state.sql`, not created on page requests.
No public database API or browser credentials are used.
