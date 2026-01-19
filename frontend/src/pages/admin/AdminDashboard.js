import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { getAllHistory, getdashboardData } from "../../services/api";
import { StatCard } from "../../components/Admin/dashboard/StatCard";
import { MostViewedCard } from "../../components/Admin/dashboard/MostViewedCard";
import { ActivityCard } from "../../components/Admin/dashboard/ActivityCard";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [newestActivities, setNewestActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [responseDashboard, responseHistory] = await Promise.all([
        getdashboardData(),
        getAllHistory(5, 1),
      ]);
      setDashboardData(responseDashboard.data);

      setNewestActivities(responseHistory.data.history);
      console.log("history data", responseHistory.data.history);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
    topFiveAnn,
  } = dashboardData;
  const userTrend = parseFloat(userPercentage) > 0 ? "up" : "down";
  const announcementTrend =
    parseFloat(announcementPercentage) > 0 ? "up" : "down";

  const totalPublished =
    typeof announcements.totalPublishedAnnouncement === "object"
      ? announcements.totalPublishedAnnouncement?.views ||
        announcements.totalAnnouncement
      : announcements.totalPublishedAnnouncement;

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
          className="flex items-center justify-center p-2 rounded-lg bg-blue-700 text-xs gap-x-2 "
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
              <Link to="/admin/history">
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
    </div>
  );
};

export default Dashboard;
