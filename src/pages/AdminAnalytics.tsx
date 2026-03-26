import { useEffect, useState } from "react";
import { Users, MessageSquare, FileText, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/landing/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Stats {
  totalUsers: number;
  totalReports: number;
  totalLetters: number;
  totalMessages: number;
}

export default function AdminAnalytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalReports: 0, totalLetters: 0, totalMessages: 0 });
  const [events, setEvents] = useState<{ name: string; count: number }[]>([]);
  const [pageViews, setPageViews] = useState<{ page: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .rpc("is_admin" as any, { _user_id: user.id })
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  useEffect(() => {
    if (!isAdmin) return;

    Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("credit_reports").select("id", { count: "exact", head: true }),
      supabase.from("dispute_letters").select("id", { count: "exact", head: true }),
      supabase.from("messages").select("id", { count: "exact", head: true }),
      supabase.from("events").select("event_name").order("created_at", { ascending: false }).limit(200),
      supabase.from("page_views").select("page").order("created_at", { ascending: false }).limit(200),
    ]).then(([users, reports, letters, msgs, evts, pvs]) => {
      setStats({
        totalUsers: users.count ?? 0,
        totalReports: reports.count ?? 0,
        totalLetters: letters.count ?? 0,
        totalMessages: msgs.count ?? 0,
      });

      // Aggregate events
      const eventCounts: Record<string, number> = {};
      for (const e of (evts.data ?? []) as Array<{ event_name: string | null }>) {
        if (e.event_name) eventCounts[e.event_name] = (eventCounts[e.event_name] ?? 0) + 1;
      }
      setEvents(Object.entries(eventCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10));

      // Aggregate page views
      const pageCounts: Record<string, number> = {};
      for (const p of (pvs.data ?? []) as Array<{ page: string | null }>) {
        if (p.page) pageCounts[p.page] = (pageCounts[p.page] ?? 0) + 1;
      }
      setPageViews(Object.entries(pageCounts).map(([page, count]) => ({ page, count })).sort((a, b) => b.count - a.count));

      setLoading(false);
    });
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted-foreground">Access denied.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-8 text-2xl font-bold tracking-tight text-foreground">
          Admin Analytics
        </h1>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Total Users", value: stats.totalUsers, icon: Users },
                { label: "Credit Reports", value: stats.totalReports, icon: FileText },
                { label: "Dispute Letters", value: stats.totalLetters, icon: MessageSquare },
                { label: "Chat Messages", value: stats.totalMessages, icon: TrendingUp },
              ].map(({ label, value, icon: Icon }) => (
                <Card key={label}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{value.toLocaleString()}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              {events.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Top Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={events} layout="vertical" margin={{ left: 8, right: 16 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" tick={{ fontSize: 12 }} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
                        <Tooltip />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {pageViews.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Page Views</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={pageViews} layout="vertical" margin={{ left: 8, right: 16 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" tick={{ fontSize: 12 }} />
                        <YAxis type="category" dataKey="page" tick={{ fontSize: 11 }} width={80} />
                        <Tooltip />
                        <Bar dataKey="count" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
