import { createClient } from "@/utils/supabase/server";

// 1. Type definition (used below in the .returns<Motto[]>() query)
interface Motto {
  id: number;
  created_at: string;
  language: string;
  content: string;
  author: string;
}

export default async function Home() {
  const supabase = createClient();
  
  const isDev = process.env.NODE_ENV === 'development';

  // 2. Pobranie danych z jawnym typowaniem
  const { data: mottos, error } = await supabase
    .from("mottos")
    .select("*")
    .limit(3)
    .returns<Motto[]>(); // <--- TUTAJ używamy interfejsu, naprawiając błąd lintera

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
            <p className="font-semibold mb-2">Błąd: {error.message}</p>
            
            {isDev ? (
              <>
                <p className="mb-2 text-muted-foreground text-xs">
                  Jesteś w trybie <strong>DEV</strong>. Upewnij się, że masz plik <code className="bg-background px-1 py-0.5 rounded border">.env</code> w głównym katalogu:
                </p>
                <pre className="p-3 bg-slate-950 text-slate-50 rounded-md overflow-x-auto text-xs font-mono">
NEXT_PUBLIC_SUPABASE_URL=twoj-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj-klucz
                </pre>
              </>
            ) : (
              <p className="text-muted-foreground text-xs">
                Aplikacja działa w trybie <strong>PROD</strong>. Sprawdź konfigurację zmiennych środowiskowych w panelu hostingu.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ostatnio dodane motta:
            </p>
            <ul className="space-y-3">
              {/* Teraz TypeScript wie, że 'motto' ma pole .content, .author itp. */}
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
            {(!mottos || mottos.length === 0) && (
              <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-200">
                Połączono, ale tabela &quot;mottos&quot; jest pusta. Uruchom migrację SQL.
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