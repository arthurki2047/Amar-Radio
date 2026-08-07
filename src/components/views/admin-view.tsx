
"use client";

import { useApp } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Database, 
  LayoutDashboard, 
  ArrowLeft, 
  RefreshCw, 
  Users, 
  BarChart3, 
  Bell, 
  ShieldAlert,
  PlusCircle,
  TrendingUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/firebase";

export function AdminView() {
  const { setView, syncStationsToFirestore, t, isAdmin } = useApp();
  const { isUserLoading } = useUser();

  if (isUserLoading) {
    return <div className="p-8 text-center animate-pulse">Verifying permissions...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Access Restricted</h1>
        <p className="text-muted-foreground mt-2 max-w-md">
          This dashboard is only available to the authorized administrator ID.
        </p>
        <Button className="mt-6" onClick={() => setView('HOME')}>
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-purple-600 text-white shadow-xl shadow-purple-500/20">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">admin dashboard available only for my id</h1>
            <p className="text-muted-foreground text-sm">Comprehensive control for Amar Radio.</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => setView('HOME')} className="gap-2 h-11 px-6 rounded-xl border-white/10 hover:bg-white/5">
          <ArrowLeft className="w-4 h-4" />
          {t('nav_home')}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Catalog Management */}
        <Card className="bg-card/40 border-white/10 backdrop-blur-xl hover:border-purple-500/30 transition-colors">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Database className="w-6 h-6" />
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-none">Active</Badge>
            </div>
            <CardTitle className="mt-4">{t('catalog_management_title')}</CardTitle>
            <CardDescription>
              {t('catalog_sync_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={syncStationsToFirestore} className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white h-11 rounded-xl">
              <RefreshCw className="w-4 h-4" />
              {t('sync_to_firestore_button')}
            </Button>
          </CardContent>
        </Card>

        {/* User Insights */}
        <Card className="bg-card/40 border-white/10 backdrop-blur-xl">
          <CardHeader>
             <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <CardTitle className="mt-4">User Insights</CardTitle>
            <CardDescription>
              Manage user accounts and view growth statistics.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Users</p>
                <p className="text-2xl font-bold mt-1">1,284</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Active Now</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-2xl font-bold">42</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 rounded-xl h-11" disabled>
              View User Directory
            </Button>
          </CardContent>
        </Card>

        {/* Analytics Module */}
        <Card className="bg-card/40 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
            <CardTitle className="mt-4">Radio Analytics</CardTitle>
            <CardDescription>
              Monitor stream usage and station popularity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Top Station</span>
                  <span className="font-bold">Radio Mirchi</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Avg. Session</span>
                  <span className="font-bold">42m 15s</span>
                </div>
             </div>
             <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 rounded-xl h-11" disabled>
              <TrendingUp className="w-4 h-4 mr-2" />
              Open Full Report
            </Button>
          </CardContent>
        </Card>

        {/* Global Announcements */}
        <Card className="bg-card/40 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                <Bell className="w-6 h-6" />
              </div>
            </div>
            <CardTitle className="mt-4">Announcements</CardTitle>
            <CardDescription>
              Update the scrolling notification bar text.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 rounded-xl h-11" disabled>
              Update Broadcast
            </Button>
          </CardContent>
        </Card>

        {/* System & Security */}
        <Card className="bg-card/40 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
            </div>
            <CardTitle className="mt-4">System Control</CardTitle>
            <CardDescription>
              Maintenance mode and emergency overrides.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button variant="destructive" className="w-full rounded-xl h-11 opacity-50 cursor-not-allowed">
              Maintenance Mode
            </Button>
          </CardContent>
        </Card>

        {/* Content Management */}
        <Card className="bg-card/40 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                <PlusCircle className="w-6 h-6" />
              </div>
            </div>
            <CardTitle className="mt-4">Station Editor</CardTitle>
            <CardDescription>
              Manually add or edit radio station streams.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 rounded-xl h-11" disabled>
              Launch Editor
            </Button>
          </CardContent>
        </div>
      </div>

      <div className="pt-8 text-center text-xs text-muted-foreground">
        Amar Radio Admin v1.2.0 • Build ID: AR-2024-08-05
      </div>
    </div>
  );
}
