import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

// 1. Type definition (used below in the .returns<Motto[]>() query)
interface Motto {
  id: number;
  created_at: string;
  language: string;
  content: string;
  author: string;
}

export default async function Home() {
  let mottos: Motto[] | null = null;
  let error: { message: string } | null = null;
  const isDev = process.env.NODE_ENV === 'development';

  try {
    const supabase = createClient();
    const { data, error: queryError } = await supabase
      .from("mottos")
      .select("*")
      .limit(3)
      .returns<Motto[]>(); // <--- HERE we use the interface, fixing the linter error
    mottos = data;
    error = queryError;
  } catch (e: unknown) {
    error = { message: e instanceof Error ? e.message : "Supabase client initialization failed." };
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center text-foreground">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Supabase Connection Check
        </p>
        <h1 className="text-balance text-4xl font-bold sm:text-5xl">
          Bolt.new template ready ⚡
        </h1>
      </div>

      <div className="mt-4 w-full max-w-md rounded-lg border bg-card p-6 shadow-sm text-left">
        <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
          Database Status:
          {error ? (
            <span className="text-destructive text-sm font-bold">Error 🔴</span>
          ) : (
            <span className="text-green-500 text-sm font-bold">Connected 🟢</span>
          )}
        </h2>

        {error ? (
          <div className="text-sm text-destructive bg-destructive/10 p-4 rounded border border-destructive/20">
            <p className="font-semibold mb-2">Error: {error.message}</p>
            
            {isDev ? (
              <>
                <p className="mb-2 text-muted-foreground text-xs">
                  You are in <strong>DEV</strong> mode. Make sure you have a <code className="bg-background px-1 py-0.5 rounded border">.env</code> file in the root directory:
                </p>
                <pre className="p-3 bg-slate-950 text-slate-50 rounded-md overflow-x-auto text-xs font-mono">
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
                </pre>
              </>
            ) : (
              <p className="text-muted-foreground text-xs">
                The application is running in <strong>PROD</strong> mode. Check your environment variable configuration in your hosting panel.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Recently added mottos:
            </p>
            <ul className="space-y-3">
              
              {mottos?.map((motto) => (
                <li key={motto.id} className="rounded border bg-muted/30 p-3 text-sm">
                  <p className="italic mb-1">&quot;{motto.content}&quot;</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">{motto.author}</span>
                    <span className="uppercase border px-1 rounded text-[10px]">{motto.language}</span>
                  </div>
                </li>
              ))}
            </ul>
            {(mottos?.length === 0 || !mottos) && (
              <p className="text-sm text-warning bg-warning/10 p-2 rounded border border-warning/20">
                Connected, but the &ldquo;mottos&rdquo; table is empty. Run the SQL migration.
              </p>
            )}
          </div>
        )}
      </div>

      <p className="text-balance text-base text-muted-foreground mt-4">
        Start editing <code className="rounded bg-muted px-2 py-1">src/app/page.tsx</code> to make
        this project your own.
      </p>
    </main>
  );
}