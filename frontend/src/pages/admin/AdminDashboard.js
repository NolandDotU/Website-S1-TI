import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Megaphone,
  Eye,
  FileText,
  Calendar,
  Loader2,
  BarChart3,
  History,
  ArrowRight,
  ListRestart,
  Bot,
  Timer,
  ShieldAlert,
  Shuffle,
  PlugZap,
  Cpu,
  Database,
  Workflow,
  Activity,
} from "lucide-react";
import { getAllHistory, getdashboardData } from "../../services/api";
import { StatCard } from "../../components/Admin/dashboard/StatCard";
import { MostViewedCard } from "../../components/Admin/dashboard/MostViewedCard";
import { ActivityCard } from "../../components/Admin/dashboard/ActivityCard";
import { useAuth } from "../../context/Context";

const Dashboard = () => {
  const user = useAuth().user;
  const [dashboardData, setDashboardData] = useState(null);
  const [newestActivities, setNewestActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [responseDashboard, responseHistory] = await Promise.all([
        getdashboardData(),
        getAllHistory(3, 1, "", user),
      ]);
      setDashboardData(responseDashboard.data);

      setNewestActivities(responseHistory.data.history);
      console.log("history data", responseHistory.data.history);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Memuat data dashboard...
          </p>
        </div>
      </div>
    );
  }

  const {
    users,
    announcements,
    userPercentage,
    announcementPercentage,
    chatbotRequestPercentage,
    topFiveAnn,
    chatbot,
  } = dashboardData;
  const userTrend = parseFloat(userPercentage) > 0 ? "up" : "down";
  const announcementTrend =
    parseFloat(announcementPercentage) > 0 ? "up" : "down";
  const chatbotTrend = parseFloat(chatbotRequestPercentage) > 0 ? "up" : "down";

  const totalPublished =
    typeof announcements.totalPublishedAnnouncement === "object"
      ? announcements.totalPublishedAnnouncement?.views ||
        announcements.totalAnnouncement
      : announcements.totalPublishedAnnouncement;

  const chatbotInfo = chatbot?.info || {};
  const chatbotConnections = chatbot?.connections || {};
  const chatbotTopModels = chatbot?.topUsedModels || [];
  const chatbotConfiguredModels = chatbot?.configuredModels || [];

  const formatConnectionStatus = (status) => {
    const normalized = (status || "").toString().toLowerCase();
    if (["connected", "configured"].includes(normalized)) {
      return {
        label: normalized === "connected" ? "Connected" : "Configured",
        style:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
      };
    }

    if (["connecting", "disconnecting"].includes(normalized)) {
      return {
        label: normalized === "connecting" ? "Connecting" : "Disconnecting",
        style:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
      };
    }

    return {
      label: normalized ? normalized.replace(/_/g, " ") : "Unknown",
      style: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between">
        <div className="">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Overview statistik dan aktivitas sistem
          </p>
        </div>
        <button
          onClick={() => fetchDashboardData()}
          className="flex items-center justify-center p-2 rounded-lg bg-blue-700 text-xs gap-x-2 text-white "
          title="Reload data dashboard">
          <ListRestart className="w-5 h-5" />
          Reload
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={users.totalUser}
          subtitle={`${users.currentMonthActiveUser} active bulan ini`}
          icon={Users}
          trend={userTrend}
          trendValue={Math.abs(parseFloat(userPercentage)).toFixed(2)}
          bgColor="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Pengumuman Aktif"
          value={announcements.currentMonthActiveAnnouncement}
          subtitle="Bulan ini"
          icon={FileText}
          trend={announcementTrend}
          trendValue={Math.abs(parseFloat(announcementPercentage)).toFixed(2)}
          bgColor="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
        />
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}>
          <MostViewedCard announcement={announcements.mostViewedThisMonth} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Request Chatbot"
          value={chatbot?.totalRequests || 0}
          subtitle={`${chatbot?.uniqueSessions || 0} sesi unik`}
          icon={Bot}
          trend={chatbotTrend}
          trendValue={Math.abs(parseFloat(chatbotRequestPercentage || "0")).toFixed(2)}
          bgColor="bg-cyan-100 dark:bg-cyan-900/30"
          iconColor="text-cyan-700 dark:text-cyan-300"
        />
        <StatCard
          title="Success Rate Chatbot"
          value={Math.round(chatbot?.successRate || 0)}
          subtitle={`${chatbot?.successfulRequests || 0} sukses`}
          icon={Timer}
          bgColor="bg-emerald-100 dark:bg-emerald-900/30"
          iconColor="text-emerald-700 dark:text-emerald-300"
        />
        <StatCard
          title="Error Rate Chatbot"
          value={Math.round(chatbot?.errorRate || 0)}
          subtitle={`${chatbot?.failedRequests || 0} gagal`}
          icon={ShieldAlert}
          bgColor="bg-rose-100 dark:bg-rose-900/30"
          iconColor="text-rose-700 dark:text-rose-300"
        />
        <StatCard
          title="Fallback Model"
          value={Math.round(chatbot?.fallbackRate || 0)}
          subtitle={`${chatbot?.fallbackRequests || 0} request fallback`}
          icon={Shuffle}
          bgColor="bg-amber-100 dark:bg-amber-900/30"
          iconColor="text-amber-700 dark:text-amber-300"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-x-2">
              Aktivitas Terbaru
              <History className="w-5 h-5 text-gray-400" />
            </h2>
            <div className="flex items-center gap-x-2">
              <Link to="/cms/history">
                <button className="flex items-center text-xs gap-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  lihat semua <ArrowRight className="w-3 h-3" />
                </button>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            {newestActivities && newestActivities.length > 0 ? (
              (console.log("newestActivities : ", newestActivities),
              newestActivities.map((activity, index) => (
                <motion.div
                  key={activity._id || activity.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}>
                  <ActivityCard history={activity} />
                </motion.div>
              )))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Belum ada aktivitas terbaru
              </div>
            )}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Top 5 Pengumuman Populer
            </h2>
            <Eye className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {topFiveAnn && topFiveAnn.length > 0 ? (
              topFiveAnn.map((announcement, index) => (
                <motion.div
                  key={announcement._id || announcement.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 
                    dark:hover:bg-gray-700/50 transition-colors group">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center 
                    justify-center font-bold text-lg ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : index === 1
                          ? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          : index === 2
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}>
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-semibold text-gray-900 dark:text-white mb-1 
                      group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {announcement.title || "Tidak ada judul"}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span className="font-medium">
                          {(announcement.views || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {announcement.publishDate
                            ? new Date(
                                announcement.publishDate,
                              ).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Belum ada data pengumuman
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Perbandingan User Aktif
            </h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Bulan Ini
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {users.currentMonthActiveUser}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${(users.currentMonthActiveUser / users.totalUser) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Bulan Lalu
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {users.lastMonthActiveUser}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gray-400 dark:bg-gray-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${(users.lastMonthActiveUser / users.totalUser) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Perbandingan Pengumuman
            </h3>
            <Megaphone className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Bulan Ini
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {announcements.currentMonthActiveAnnouncement}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-600 dark:bg-purple-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${(announcements.currentMonthActiveAnnouncement / announcements.totalAnnouncement) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Bulan Lalu
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {announcements.lastMonthActiveAnnouncement}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gray-400 dark:bg-gray-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${(announcements.lastMonthActiveAnnouncement / announcements.totalAnnouncement) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Status Publikasi
            </h3>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Dipublikasikan
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {totalPublished}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${(totalPublished / announcements.totalAnnouncement) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Draft</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {announcements.totalAnnouncement - totalPublished}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gray-400 dark:bg-gray-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${((announcements.totalAnnouncement - totalPublished) / announcements.totalAnnouncement) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Informasi Chatbot
            <Cpu className="w-5 h-5 text-gray-400" />
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Snapshot bulan berjalan
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-4">
              <Bot className="w-4 h-4" />
              Konfigurasi Model
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 dark:text-gray-400">Provider</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {chatbotInfo.provider || "-"}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 dark:text-gray-400">Model Utama</span>
                <span className="font-medium text-gray-900 dark:text-white text-right break-all">
                  {chatbotInfo.primaryModel || "-"}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 dark:text-gray-400">
                  Fallback Model
                </span>
                <span className="font-medium text-gray-900 dark:text-white text-right break-all">
                  {chatbotInfo.fallbackModels?.length > 0
                    ? chatbotInfo.fallbackModels.join(", ")
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 dark:text-gray-400">
                  Total Model Terdaftar
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {chatbotInfo.modelCount ?? chatbotConfiguredModels.length}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 dark:text-gray-400">
                  Model Terpakai Bulan Ini
                </span>
                <span className="font-medium text-gray-900 dark:text-white text-right break-all">
                  {chatbotConfiguredModels.length > 0
                    ? chatbotConfiguredModels.join(", ")
                    : "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-4">
              <Workflow className="w-4 h-4" />
              RAG & Response Pipeline
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 dark:text-gray-400">
                  OpenRouter Responses
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {chatbot?.openrouterResponses || 0}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 dark:text-gray-400">Intent Responses</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {chatbot?.intentResponses || 0}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 dark:text-gray-400">No Context Responses</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {chatbot?.noContextResponses || 0}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 dark:text-gray-400">Mode Stream</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {chatbot?.streamRequests || 0}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 dark:text-gray-400">Mode Non-Stream</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {chatbot?.nonStreamRequests || 0}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 dark:text-gray-400">Avg Response Time</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {(chatbot?.avgResponseTimeMs || 0).toLocaleString()} ms
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-4">
              <PlugZap className="w-4 h-4" />
              Status Koneksi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "MongoDB", value: chatbotConnections.mongodb, icon: Database },
                { label: "Redis", value: chatbotConnections.redis, icon: Database },
                { label: "OpenRouter", value: chatbotConnections.openrouter, icon: Bot },
                { label: "Embedding", value: chatbotConnections.embedding, icon: Cpu },
              ].map((item) => {
                const status = formatConnectionStatus(item.value);
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-700/40 p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      {item.label}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${status.style}`}>
                      {status.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4" />
              Operasional & Integrasi
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 dark:text-gray-400">Embedding Endpoint</span>
                <span className="font-medium text-gray-900 dark:text-white text-right break-all">
                  {chatbotInfo.embeddingBaseUrl || "-"}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 dark:text-gray-400">Embedding Dimension</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {chatbotInfo.embeddingDimension || 0}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 dark:text-gray-400">Vector Search Mode</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {chatbotInfo.vectorSearchMode || "-"}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 dark:text-gray-400">Timeout Request Model</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {(chatbotInfo.requestTimeoutMs || 0).toLocaleString()} ms
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 dark:text-gray-400">Last Request</span>
                <span className="font-medium text-gray-900 dark:text-white text-right">
                  {chatbot?.lastRequestAt
                    ? new Date(chatbot.lastRequestAt).toLocaleString("id-ID")
                    : "-"}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                Top Model Usage (Bulan Ini)
              </p>
              {chatbotTopModels.length > 0 ? (
                <div className="space-y-2">
                  {chatbotTopModels.map((item, index) => (
                    <div
                      key={`${item.model}-${index}`}
                      className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300 break-all pr-3">
                        {item.model}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {item.count}x
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Belum ada data penggunaan model.
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
