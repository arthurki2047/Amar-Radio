
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
  TrendingUp,
  Edit,
  Trash2,
  Palette,
  Check,
  Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/firebase";
import { useMemo, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

export function AdminView() {
  const { 
    setView, 
    syncStationsToFirestore, 
    t, 
    isAdmin, 
    announcement, 
    announcementColor, 
    updateAnnouncement, 
    userStats,
    allUsersData,
    allStations
  } = useApp();
  const { isUserLoading } = useUser();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (isEditDialogOpen) {
      setEditText(announcement);
    }
  }, [isEditDialogOpen, announcement]);

  const topStationsList = useMemo(() => {
    if (!allUsersData || allUsersData.length === 0) return [];
    
    const now = new Date().getTime();
    const activeThreshold = 5 * 60 * 1000; // 5 minutes
    
    // Aggregate stats per station
    const stats: Record<string, { id: string; total: number; active: number }> = {};
    
    allUsersData.forEach(u => {
      const stationId = u.lastPlayedStationId;
      if (stationId) {
        if (!stats[stationId]) {
          stats[stationId] = { id: stationId, total: 0, active: 0 };
        }
        stats[stationId].total++;
        
        const lastUpdate = u.updatedAt ? new Date(u.updatedAt).getTime() : 0;
        if (now - lastUpdate < activeThreshold) {
          stats[stationId].active++;
        }
      }
    });
    
    return Object.values(stats)
      .map(s => ({
        ...s,
        name: allStations.find(st => st.id === s.id)?.name || `Station ${s.id}`
      }))
      // Sort by active listeners first, then total reach
      .sort((a, b) => b.active - a.active || b.total - a.total)
      .slice(0, 4);
  }, [allUsersData, allStations]);

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

  const handleSaveAnnouncement = () => {
    updateAnnouncement(editText, announcementColor);
    setIsEditDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    updateAnnouncement("", announcementColor);
    setIsDeleteDialogOpen(false);
  };

  const handleToggleColor = () => {
    const colors = [
      "text-purple-200", 
      "text-amber-200", 
      "text-emerald-200", 
      "text-white",
      "text-rose-400",
      "text-sky-400",
      "text-orange-400",
      "text-fuchsia-400",
      "text-yellow-200",
      "text-cyan-300"
    ];
    const currentIndex = colors.indexOf(announcementColor);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % colors.length;
    updateAnnouncement(announcement, colors[nextIndex]);
  };

  const renderPreview = (text: string) => {
    if (!text) return <span>No active announcement.</span>;
    
    const imgRegex = /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif|webp|svg)(?:\?[^\s]*)?)/gi;
    const parts = text.split(imgRegex);
    
    return parts.map((part, i) => {
      if (part.match(imgRegex)) {
        return (
          <img 
            key={i} 
            src={part} 
            alt="preview icon" 
            className="inline-block h-6 mx-1 object-contain align-middle"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-purple-600 text-white shadow-xl shadow-purple-500/20">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
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
                <p className="text-2xl font-bold mt-1">{userStats.total.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Active Now</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-2xl font-bold">{userStats.active.toLocaleString()}</p>
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
              <Badge variant="outline" className="text-[10px] bg-orange-500/10 text-orange-400 border-orange-500/20">LIVE REPORT</Badge>
            </div>
            <CardTitle className="mt-4">Radio Analytics</CardTitle>
            <CardDescription>
              Popularity report based on real-time listener activity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-3">
                {topStationsList.length > 0 ? (
                  topStationsList.map((item, i) => (
                    <div key={item.id} className="flex items-center justify-between text-sm group">
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-4 text-xs text-muted-foreground font-mono">{i + 1}.</span>
                        <span className="font-semibold truncate group-hover:text-amber-400 transition-colors">{item.name}</span>
                      </div>
                      <div className="flex gap-2">
                        {item.active > 0 && (
                          <Badge className="bg-green-500/10 text-green-500 border-none text-[9px] flex gap-1 items-center px-1.5 py-0 h-5">
                            <Zap className="w-2 h-2 fill-current" /> {item.active}
                          </Badge>
                        )}
                        <Badge variant="outline" className="border-white/5 bg-white/5 text-[9px] h-5 opacity-60">
                          {item.total}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-sm bg-white/5 rounded-lg border border-dashed border-white/10">
                    No active listener data yet.
                  </div>
                )}
             </div>
             <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 rounded-xl h-11 mt-2" disabled>
              <TrendingUp className="w-4 h-4 mr-2" />
              Detailed Reports
            </Button>
          </CardContent>
        </Card>

        {/* Global Announcements */}
        <Card className="bg-card/40 border-white/10 backdrop-blur-xl lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                <Bell className="w-6 h-6" />
              </div>
            </div>
            <CardTitle className="mt-4">Announcement</CardTitle>
            <CardDescription>
              Manage live scrolling notifications for all users. Supports images (add a .jpg/.png link in the text).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="p-4 rounded-xl bg-black/40 border border-white/5 min-h-[60px] flex items-center">
                <div className={`font-medium italic flex items-center flex-wrap gap-1 ${announcementColor}`}>
                  {renderPreview(announcement)}
                </div>
             </div>
             
             <div className="flex flex-wrap gap-3">
                <Button onClick={() => setIsEditDialogOpen(true)} variant="outline" className="flex-1 min-w-[120px] gap-2 border-white/10 hover:bg-white/5 rounded-xl h-11">
                  <Edit className="w-4 h-4" /> Edit Broadcast
                </Button>
                <Button onClick={handleToggleColor} variant="secondary" className="flex-1 min-w-[120px] gap-2 rounded-xl h-11">
                  <Palette className="w-4 h-4" /> Cycle Color
                </Button>
                <Button onClick={() => setIsDeleteDialogOpen(true)} variant="outline" className="flex-1 min-w-[120px] gap-2 border-white/10 hover:bg-destructive/10 text-destructive border-destructive/20 rounded-xl h-11">
                  <Trash2 className="w-4 h-4" /> Clear Message
                </Button>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Announcement Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-[#0f172a] border-white/10 text-white rounded-[1.5rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Announcement</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update the scrolling message. You can paste image URLs directly into the text.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Example: Welcome to Amar Radio! https://example.com/logo.png"
              className="min-h-[120px] bg-white/5 border-white/10 text-white focus:ring-purple-500 rounded-xl"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-white/10 text-white hover:bg-white/5 rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleSaveAnnouncement} className="bg-purple-600 hover:bg-purple-700 text-white gap-2 rounded-xl">
              <Check className="w-4 h-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#0f172a] border-white/10 text-white rounded-[1.5rem]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will immediately clear the live broadcast message for everyone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5 rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
              Clear Message
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="pt-8 text-center text-xs text-muted-foreground">
        Amar Radio Admin v1.3.0 • Build ID: AR-2024-08-06
      </div>
    </div>
  );
}
